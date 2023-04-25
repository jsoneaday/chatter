use crate::common::entities::{
    base::{EntityId, DbRepo}
};
use sqlx::{Pool, Postgres};
use super::model::MessageQueryResult;
use async_trait::async_trait;
use self::private_members::InsertMessageFn;
use self::private_members::InsertResponseMessageFn;
use self::private_members::QueryMessageFn;

mod private_members {
    use super::*;

    #[async_trait]
    pub trait InsertMessageFn {
        async fn insert_message_inner(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error>;
    }

    #[async_trait]
    pub trait InsertResponseMessageFn {
        async fn insert_response_message_inner(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error>;
    }

    #[async_trait]
    pub trait QueryMessageFn {
        async fn query_message_inner(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error>;
    }
}

#[async_trait]
pub trait MessageRepo: private_members::InsertMessageFn + private_members::QueryMessageFn + private_members::InsertResponseMessageFn {
    async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error>;
    async fn query_message(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error>;
    async fn insert_response_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error>;
}

#[async_trait]
impl private_members::InsertMessageFn for DbRepo {
    async fn insert_message_inner(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
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
}

#[async_trait]
impl private_members::InsertResponseMessageFn for DbRepo {
    async fn insert_response_message_inner(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error> {
        let tx = conn.begin().await.unwrap();

        let insert_result = sqlx::query_as::<_, EntityId>("insert into message (user_id, body) values ($1, $2) returning id")
            .bind(user_id)
            .bind(body)
            .fetch_one(conn)
            .await;
        let msg_id_result = match insert_result {
            Ok(r) => Ok(r.id),
            Err(e) => {
                println!("insert_message error: {}", e);
                Err(e)
            },
        };
        if msg_id_result.is_err() {
            return msg_id_result;
        }
        let msg_id: i64 = msg_id_result.unwrap();

        let insert_msg_response_result = sqlx::query_as::<_, EntityId>("insert into message_response (original_msg_id, responding_msg_id) values ($1, $2) returning id")
            .bind(original_msg_id)
            .bind(msg_id)
            .fetch_one(conn)
            .await;

        let msg_response_id_result = match insert_msg_response_result {
            Ok(row) => Ok(row.id),
            Err(e) => Err(e)
        };
        if msg_response_id_result.is_err() {
            return msg_response_id_result;
        }
    
        _ = tx.commit().await;

        Ok(msg_id)
    }
}

#[async_trait]
impl private_members::QueryMessageFn for DbRepo {
    async fn query_message_inner(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error> {
        sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await
    }
}

#[async_trait]
impl MessageRepo for DbRepo {
    async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
        self.insert_message_inner(conn, user_id, body).await
    }

    async fn query_message(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error> {
        self.query_message_inner(conn, id).await
    }

    async fn insert_response_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error> {
        self.insert_response_message_inner(conn, user_id, body, original_msg_id).await
    }
}


#[cfg(test)]
mod tests {
    // use crate::common_tests::actix_fixture::get_conn_pool;
    // use super::*;

    // pub struct Configs{
    //     response_msg_id: i64,
    //     profile_id: i64
    // }

    // async fn setup(conn: &Pool<Postgres>, msg_repo: &DbRepo) -> Configs {
    //     let profile = msg_repo.
    //     let response = msg_repo.insert_message(conn, , body)
    // }

    #[tokio::test]
    async fn test_insert_response_message() {        
        //let conn = get_conn_pool().await;
        //let db_repo = DbRepo{};
        //let configs = setup(&conn, &db_repo).await;

        //db_repo.insert_response_message_inner(&conn, user_id, body, original_msg_id).await;
    }
}