use serde::Deserialize;
use sqlx::{Pool, Postgres, FromRow};

pub async fn get_last_id(conn: &Pool<Postgres>) -> i64 {
    let result = sqlx::query_as::<_, EntityId>("SELECT LAST_INSERT_ID() AS id")
        .fetch_one(conn)
        .await;

    match result {
        Ok(entity) => entity.id,
        Err(e) => {
            println!("get_last_id error: {:?}", e);
            0
        }
    }
}

#[allow(unused)]
#[derive(FromRow, Deserialize)]
pub struct EntityId {
    pub id: i64
}
