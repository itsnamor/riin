use crate::helpers::auth;

#[tauri::command]
pub fn delete_credential(filename: String) -> Result<(), String> {
    auth::delete_credential(&filename)
}
