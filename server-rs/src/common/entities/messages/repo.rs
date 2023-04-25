use crate::common::entities::{
    base::{EntityId, DbRepo}
};
use sqlx::{Pool, Postgres};
use super::model::MessageQueryResult;
use async_trait::async_trait;

mod private_members {
    use super::*;

    pub async fn insert_message_inner(conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
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

    pub async fn insert_response_message_inner(conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error> {
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

    pub async fn query_message_inner(conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error> {
        sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await
    }
}

#[async_trait]
pub trait InsertMessageFn {
    async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error>;
}

#[async_trait]
pub trait InsertResponseMessageFn {
    async fn insert_response_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error>;
}

#[async_trait]
pub trait QueryMessageFn {
    async fn query_message(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error>;
}

#[async_trait]
impl InsertMessageFn for DbRepo {
    async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
        private_members::insert_message_inner(conn, user_id, body).await
    }
}

#[async_trait]
impl InsertResponseMessageFn for DbRepo {
    async fn insert_response_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error> {
        private_members::insert_response_message_inner(conn, user_id, body, original_msg_id).await
    }
}

#[async_trait]
impl QueryMessageFn for DbRepo {
    async fn query_message(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error> {
        private_members::query_message_inner(conn, id).await
    }
}

#[cfg(test)]
mod tests {
    use crate::{common_tests::actix_fixture::get_conn_pool, common::entities::profiles::{repo::{InsertProfileFn}, model::ProfileCreate}};
    use super::*;

    #[derive(Clone)]
    struct Fixtures{
        pub original_msg_id: i64,
        pub profile_id: i64,
        pub conn: Pool<Postgres>
    }

    #[async_trait]
    trait TestRepoSetup {
        async fn setup(&mut self) -> Fixtures {
            let conn = get_conn_pool().await;
            let db_repo = DbRepo{};
            let profile = db_repo.insert_profile(&conn, ProfileCreate { 
                user_name: "tester".to_string(), 
                full_name: "Dave Wave".to_string(), 
                description: "a description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            }).await;
            let profile_id = profile.unwrap();
            let original_msg_id = db_repo.insert_message(&conn, profile_id, "Testing body 123").await;
    
            Fixtures {
                original_msg_id: original_msg_id.unwrap(),
                profile_id: profile_id,
                conn
            }
        }
    }

    mod test_mod_insert_response_message {
        use super::*;

        struct InsertResponseMsgDbRepo {
            fixtures: Option<Fixtures>
        }

        impl TestRepoSetup for InsertResponseMsgDbRepo {}

        #[async_trait]
        impl InsertResponseMessageFn for InsertResponseMsgDbRepo {
            async fn insert_response_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, original_msg_id: i64) -> Result<i64, sqlx::Error> {
                private_members::insert_response_message_inner(conn, user_id, body, original_msg_id).await
            }
        }

        #[allow(unused)]
        #[async_trait]
        impl InsertMessageFn for InsertResponseMsgDbRepo {
            async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
                Ok(self.fixtures.clone().unwrap().original_msg_id)
            }
        }

        #[allow(unused)]
        #[async_trait]
        impl InsertProfileFn for InsertResponseMsgDbRepo {
            async fn insert_profile(&self, conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
                Ok(self.fixtures.clone().unwrap().profile_id)
            }
        }

        #[tokio::test]
        async fn test_insert_response_message() {                
            let mut db_repo = InsertResponseMsgDbRepo{ fixtures: None };
            let fixtures = db_repo.setup().await;
            db_repo.fixtures = Some(fixtures.clone());

            let profile_id_result = db_repo.insert_profile(&fixtures.conn, ProfileCreate { 
                user_name: "tester".to_string(), 
                full_name: "Dave Wave".to_string(), 
                description: "a description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            }).await;
            let profile_id = profile_id_result.unwrap();
            let original_msg_id = db_repo.insert_message(&fixtures.conn, profile_id, "Body of message that is being responded to.").await;

            let response_msg = db_repo.insert_response_message(&fixtures.conn, profile_id, "Body of response message", original_msg_id.unwrap()).await;
            assert!(response_msg.unwrap() > 0);
        }
    }
}