use std::fs;

use crate::helpers::config_path;

#[tauri::command]
pub fn write_config(content: String) -> Result<(), String> {
    let path = config_path()?;
    fs::write(&path, content).map_err(|e| format!("Failed to write config: {e}"))
}
