use crate::types::OAuthState;

#[tauri::command]
pub fn cancel_oauth_login(state: tauri::State<'_, OAuthState>) -> Result<(), String> {
    if let Some(child) = state.child.lock().map_err(|e| e.to_string())?.take() {
        child.kill().map_err(|e| e.to_string())?;
    }
    Ok(())
}
