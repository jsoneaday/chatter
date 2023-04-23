use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow};

#[derive(Deserialize, Serialize, FromRow)]
pub struct BroadcastQueryResult {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub main_msg_id: i64,
    pub broadcasting_msg_id: i64
}
