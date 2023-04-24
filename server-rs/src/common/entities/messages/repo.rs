use crate::common::entities::{
    utils::EntityId
};
use sqlx::{Pool, Postgres};
use super::model::MessageQueryResult;

pub async fn insert_message(conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
    let query_result = sqlx::query_as::<_, EntityId>("insert into message (user_id, body) values ($1, $2) returning id")
    .bind(user_id)
    .bind(body)
    .fetch_one(conn)
    .await;

    match query_result {
        Ok(r) => Ok(r.id),
        Err(e) => {
            println!("insert_message error: {}", e);
            Err(e)
        },
    }
}

pub async fn query_message(conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error> {
    sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(id)
        .fetch_optional(conn)
        .await
}
