use crate::types::ProxyState;

#[tauri::command]
pub fn is_proxy_running(state: tauri::State<'_, ProxyState>) -> bool {
    state.child.lock().is_ok_and(|l| l.is_some())
}
