use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

use crate::helpers::config_path;

#[tauri::command]
pub fn start_oauth_login(app: AppHandle, provider: String) -> Result<(), String> {
    let flag = match provider.as_str() {
        "antigravity" => "--antigravity-login",
        "claude" => "--claude-login",
        "codex" => "--codex-login",
        _ => return Err(format!("Unknown provider: {provider}")),
    };

    let path = config_path()?;

    let (mut rx, _child) = app
        .shell()
        .sidecar("cli-proxy-api")
        .map_err(|e| e.to_string())?
        .args([flag, "--config", &path.to_string_lossy()])
        .spawn()
        .map_err(|e| e.to_string())?;

    let handle = app.clone();
    let provider_name = provider.clone();
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Terminated(payload) = event {
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
        }
    });

    Ok(())
}
