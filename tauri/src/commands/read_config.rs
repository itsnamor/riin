use std::fs;

use crate::helpers::config_path;

#[tauri::command]
pub fn read_config() -> Result<String, String> {
    let path = config_path()?;
    fs::read_to_string(&path).map_err(|e| format!("Failed to read config: {e}"))
}
