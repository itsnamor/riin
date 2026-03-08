use std::sync::Mutex;
use tauri_plugin_shell::process::CommandChild;

pub struct OAuthState {
    pub child: Mutex<Option<CommandChild>>,
}

impl OAuthState {
    pub fn new() -> Self {
        Self {
            child: Mutex::new(None),
        }
    }
}
