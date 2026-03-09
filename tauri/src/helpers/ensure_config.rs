use std::fs;
use std::path::PathBuf;

use tauri::{AppHandle, Manager};

use super::config_path;

pub fn ensure_config(app: &AppHandle) -> Result<PathBuf, String> {
    let target = config_path()?;

    if target.exists() {
        return Ok(target);
    }

    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create config directory: {e}"))?;
    }

    let resource_path = app
        .path()
        .resolve(
            "resources/config.default.yml",
            tauri::path::BaseDirectory::Resource,
        )
        .map_err(|e| format!("Failed to resolve default config resource: {e}"))?;

    fs::copy(&resource_path, &target).map_err(|e| format!("Failed to copy default config: {e}"))?;

    Ok(target)
}
