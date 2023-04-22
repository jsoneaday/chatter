use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Row, postgres::PgRow};

#[derive(Deserialize, Serialize)]
pub struct BroadcastQueryResult {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub main_msg_id: i64,
    pub broadcasting_msg_id: i64
}

impl FromRow<'_, PgRow> for BroadcastQueryResult {
    fn from_row(row: &PgRow) -> sqlx::Result<Self> {
        Ok(Self {
            id: row.get_unchecked::<i64, _>("id"),
            created_at: row.get_unchecked::<DateTime<Utc>, _>("created_at"),
            updated_at: row.get_unchecked::<DateTime<Utc>, _>("updated_at"),
            main_msg_id: row.get_unchecked::<i64, _>("main_msg_id"),
            broadcasting_msg_id: row.get_unchecked::<i64, _>("broadcasting_msg_id")
        })
    }
}