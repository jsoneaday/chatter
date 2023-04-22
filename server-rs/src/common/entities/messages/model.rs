use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use sqlx::{FromRow};
use crate::common::entities::profiles::ProfileShort;

#[derive(Deserialize, Serialize, FromRow, Clone)]
pub struct MessageQueryResult {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub user_id: i64,
    pub body: Option<String>,
    pub image: Option<Vec<u8>>,
    pub likes: i32    
}

#[derive(Deserialize)]
pub struct MessageQuery {
    pub id: i64
}

#[derive(Deserialize, Serialize)]
pub struct MessagePostJson {
    pub user_id: i64,
    pub body: String
}

#[derive(Deserialize, Serialize, FromRow)]
pub struct MessageResponder {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub body: Option<String>,
    pub likes: i32,
    pub broadcasting_msg: Option<Box<MessageResponder>>,
    pub image: Option<Vec<u8>>,
    pub profile: ProfileShort
}
