use sqlx::{Pool, Postgres};
use crate::common::entities::base::DbRepo;
use async_trait::async_trait;

use super::model::BroadcastQueryResult;

mod private_members {
    use super::*;

    pub async fn query_message_broadcast_inner(conn: &Pool<Postgres>, id: i64) -> Result<Option<BroadcastQueryResult>, sqlx::Error> {
        sqlx::query_as::<_, BroadcastQueryResult>("select * from message_broadcast where main_msg_id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await
    }
}

#[async_trait]
pub trait QueryMessageBroadcastFn {
    async fn query_message_broadcast(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<BroadcastQueryResult>, sqlx::Error>;
}

#[async_trait]
impl QueryMessageBroadcastFn for DbRepo {
    async fn query_message_broadcast(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<BroadcastQueryResult>, sqlx::Error> {
        private_members::query_message_broadcast_inner(conn, id).await
    }
}