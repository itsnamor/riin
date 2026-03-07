use std::sync::Mutex;
use tauri_plugin_shell::process::CommandChild;

pub struct ProxyState {
    pub child: Mutex<Option<CommandChild>>,
}

impl ProxyState {
    pub fn new() -> Self {
        Self {
            child: Mutex::new(None),
        }
    }
}
