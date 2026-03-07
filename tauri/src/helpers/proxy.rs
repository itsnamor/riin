use tauri::{AppHandle, Manager};

use crate::types::ProxyState;

pub fn kill_proxy(handle: &AppHandle) {
    let state = handle.state::<ProxyState>();
    if let Some(child) = state.child.lock().ok().and_then(|mut l| l.take()) {
        let _ = child.kill();
    }
}
