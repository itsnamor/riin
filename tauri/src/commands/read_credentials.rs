use crate::helpers::auth;
use crate::types::credential::CredentialItem;

#[tauri::command]
pub fn read_credentials() -> Result<Vec<CredentialItem>, String> {
    auth::read_all_credentials()
}
