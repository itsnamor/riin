use std::path::PathBuf;

pub fn config_path() -> Result<PathBuf, String> {
    dirs::home_dir()
        .map(|h| h.join(".config").join("riin").join("config.yml"))
        .ok_or_else(|| "Cannot determine home directory".into())
}
