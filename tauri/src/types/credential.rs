use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Credential {
    #[serde(default)]
    pub access_token: String,
    #[serde(default)]
    pub disabled: bool,
    #[serde(default)]
    pub email: String,
    #[serde(default)]
    pub expired: String,
    #[serde(default)]
    pub id_token: String,
    #[serde(default)]
    pub last_refresh: String,
    #[serde(default)]
    pub refresh_token: String,
    #[serde(rename = "type")]
    pub credential_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CredentialItem {
    pub filename: String,
    pub credential: Credential,
}
