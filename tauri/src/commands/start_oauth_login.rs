use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

use crate::helpers::config_path;
use crate::types::OAuthState;

#[derive(serde::Serialize, Clone)]
struct DeviceCodePayload {
    provider: String,
    verification_uri: String,
    user_code: String,
}

#[tauri::command]
pub fn start_oauth_login(
    app: AppHandle,
    state: tauri::State<'_, OAuthState>,
    provider: String,
) -> Result<(), String> {
    let valid_providers = ["antigravity", "claude", "codex", "copilot"];
    if !valid_providers.contains(&provider.as_str()) {
        return Err(format!("Unknown provider: {provider}"));
    }

    let path = config_path()?;

    let (mut rx, child) = app
        .shell()
        .sidecar("riin-proxy")
        .map_err(|e| e.to_string())?
        .args(["login", &provider, "--config", &path.to_string_lossy()])
        .spawn()
        .map_err(|e| e.to_string())?;

    *state.child.lock().map_err(|e| e.to_string())? = Some(child);

    let handle = app.clone();
    let provider_name = provider.clone();
    tauri::async_runtime::spawn(async move {
        let mut verification_uri = String::new();
        let mut user_code = String::new();

        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    let output = String::from_utf8_lossy(&line);
                    // Parse device flow output from copilot
                    // Format: "To sign in, use a web browser to open the page https://github.com/login/device"
                    //         "and enter the code: XXXX-XXXX"
                    if output.contains("open the page") {
                        if let Some(url) = output.split_whitespace().last() {
                            verification_uri = url.to_string();
                        }
                    }
                    if output.contains("enter the code:") {
                        if let Some(code) = output.split_whitespace().last() {
                            user_code = code.to_string();
                        }
                    }
                    // Emit device code info when both are captured
                    if !verification_uri.is_empty() && !user_code.is_empty() {
                        let _ = handle.emit(
                            "oauth-device-code",
                            DeviceCodePayload {
                                provider: provider_name.clone(),
                                verification_uri: verification_uri.clone(),
                                user_code: user_code.clone(),
                            },
                        );
                        // Clear to avoid duplicate emits
                        verification_uri.clear();
                        user_code.clear();
                    }
                }
                CommandEvent::Terminated(payload) => {
                    let success = payload.code == Some(0);
                    let _ = handle.emit(
                        "oauth-login-completed",
                        serde_json::json!({
                            "provider": provider_name,
                            "success": success,
                            "code": payload.code,
                        }),
                    );
                }
                _ => {}
            }
        }
    });

    Ok(())
}
