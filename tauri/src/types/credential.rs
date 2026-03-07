use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Credential {
    pub access_token: String,
    pub disabled: bool,
    pub email: String,
    pub expired: String,
    pub id_token: String,
    pub last_refresh: String,
    pub refresh_token: String,
    #[serde(rename = "type")]
    pub credential_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CredentialItem {
    pub filename: String,
    pub credential: Credential,
}
