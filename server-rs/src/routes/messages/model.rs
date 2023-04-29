use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use crate::common::entities::profiles::model::ProfileShort;


#[derive(Deserialize)]
pub struct MessageQuery {
    pub id: i64
}

#[derive(Deserialize, Serialize)]
pub struct MessagePostJson {
    pub user_id: i64,
    pub body: String,
    pub broadcasting_msg_id: Option<i64>
}

#[derive(Deserialize, Serialize)]
pub struct MessageResponder {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub body: Option<String>,
    pub likes: i32,
    pub broadcasting_msg: Option<Box<MessageResponder>>,
    pub image: Option<Vec<u8>>,
    pub profile: ProfileShort
}

