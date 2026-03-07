use std::fs;
use std::path::PathBuf;

use crate::types::credential::{Credential, CredentialItem};

pub fn auth_dir() -> Result<PathBuf, String> {
    dirs::home_dir()
        .map(|h| h.join(".config").join("riin").join("auth"))
        .ok_or_else(|| "Cannot determine home directory".into())
}

pub fn read_all_credentials() -> Result<Vec<CredentialItem>, String> {
    let dir = auth_dir()?;

    if !dir.exists() {
        return Ok(Vec::new());
    }

    let entries =
        fs::read_dir(&dir).map_err(|e| format!("Failed to read auth directory: {e}"))?;

    let mut credentials = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {e}"))?;
        let path = entry.path();

        if path.extension().and_then(|ext| ext.to_str()) == Some("json") {
            let filename = path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or_default()
                .to_string();

            let content = fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read {filename}: {e}"))?;

            let credential: Credential = serde_json::from_str(&content)
                .map_err(|e| format!("Failed to parse {filename}: {e}"))?;

            credentials.push(CredentialItem {
                filename,
                credential,
            });
        }
    }

    Ok(credentials)
}

pub fn write_credential(filename: &str, credential: &Credential) -> Result<(), String> {
    let dir = auth_dir()?;

    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create auth directory: {e}"))?;

    let path = dir.join(filename);
    let content =
        serde_json::to_string_pretty(credential).map_err(|e| format!("Failed to serialize: {e}"))?;

    fs::write(&path, content).map_err(|e| format!("Failed to write {filename}: {e}"))
}
