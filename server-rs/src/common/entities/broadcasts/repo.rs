use sqlx::{Pool, Postgres};
use super::model::BroadcastQueryResult;

pub async fn query_message_broadcast(conn: &Pool<Postgres>, id: i64) -> Result<Option<BroadcastQueryResult>, sqlx::Error> {
    sqlx::query_as::<_, BroadcastQueryResult>("select * from message_broadcast where main_msg_id = $1")
        .bind(id)
        .fetch_optional(conn)
        .await
}