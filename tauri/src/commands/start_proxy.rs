use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

use crate::helpers::config_path;
use crate::types::ProxyState;

#[tauri::command]
pub fn start_proxy(app: AppHandle, state: tauri::State<'_, ProxyState>) -> Result<(), String> {
    let mut lock = state.child.lock().map_err(|e| e.to_string())?;
    if lock.is_some() {
        return Err("Proxy is already running".into());
    }

    let path = config_path()?;

    let (mut rx, child) = app
        .shell()
        .sidecar("riin-proxy")
        .map_err(|e| e.to_string())?
        .args(["--config", &path.to_string_lossy()])
        .spawn()
        .map_err(|e| e.to_string())?;

    *lock = Some(child);
    drop(lock);

    let handle = app.clone();
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Terminated(payload) = event {
                let state = handle.state::<ProxyState>();
                if let Ok(mut l) = state.child.lock() {
                    *l = None;
                }
                let _ = handle.emit("proxy-stopped", payload.code);
            }
        }
    });

    Ok(())
}
