use chrono::{Utc, DateTime};
use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileResponder {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub user_name: String,
    pub full_name: String,
    pub description: String,
    pub region: Option<String>,
    pub main_url: Option<String>,
    pub avatar: Vec<u8>
}