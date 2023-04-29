use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow};

/// The message that is being broadcast to the user's followers and potentially responded to
/// Think of it as a retweet
#[derive(Deserialize, Serialize, FromRow)]
pub struct BroadcastQueryResult {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub main_msg_id: i64,
    pub broadcasting_msg_id: i64
}
