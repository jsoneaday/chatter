use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{FromRow};


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