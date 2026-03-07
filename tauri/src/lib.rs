mod commands;
mod helpers;
mod types;

use tauri::{Manager, RunEvent, WindowEvent};

use commands::{is_proxy_running, read_config, start_proxy, stop_proxy, write_config};
use helpers::{ensure_config, kill_proxy};
use types::ProxyState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .manage(ProxyState::new())
        .setup(|app| {
            if let Err(e) = ensure_config(app.handle()) {
                eprintln!("Warning: failed to ensure config: {e}");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            start_proxy,
            stop_proxy,
            is_proxy_running,
            read_config,
            write_config,
        ])
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|handle, event| match event {
        RunEvent::Reopen { .. } => {
            if let Some(w) = handle.get_webview_window("main") {
                let _ = w.show();
                let _ = w.set_focus();
            }
        }
        RunEvent::Exit => kill_proxy(handle),
        _ => {}
    });
}
