use crate::helpers::auth;
use crate::types::credential::Credential;

#[tauri::command]
pub fn write_credential(filename: String, credential: Credential) -> Result<(), String> {
    auth::write_credential(&filename, &credential)
}
