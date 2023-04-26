use crate::common::entities::{
    base::{EntityId, DbRepo}
};
use sqlx::{Pool, Postgres};
use super::model::MessageQueryResult;
use async_trait::async_trait;
use chrono::{DateTime, Utc};


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

    pub async fn query_messages_by_user_inner(conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MessageQueryResult>, sqlx::Error> {
        sqlx::query_as::<_, MessageQueryResult>(
            r"select * from message 
                where user_id = $1 
                and updated_at < $2 
                order by $2 desc 
                limit $3
            ")
            .bind(user_id)
            .bind(last_updated_at)
            .bind(page_size)
            .fetch_all(conn)
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
pub trait QueryMessagesByUserFn {
    async fn query_messages_by_user(&self, conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MessageQueryResult>, sqlx::Error>;
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

#[async_trait]
impl QueryMessagesByUserFn for DbRepo {
    async fn query_messages_by_user(&self, conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MessageQueryResult>, sqlx::Error> {
        private_members::query_messages_by_user_inner(conn, user_id, last_updated_at, page_size).await
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

    mod test_mod_query_messages_by_user {
        use crate::common::entities::profiles::repo::QueryProfileFn;

        use super::*;

        struct QueryMsgByUserDbRepo { fixtures: Option<Fixtures> }

        impl QueryMsgByUserDbRepo {
            async fn setup(&mut self) -> Fixtures {
                let conn = get_conn_pool().await;
                let db_repo = DbRepo{};
                let profile = db_repo.query_profile(&conn, 1).await;
                let optional_profile_result = profile.unwrap();
                let profile_id: i64 = match optional_profile_result {
                    Some(profile_result) => profile_result.id,
                    None => {
                        let inserted_profile = db_repo.insert_profile(&conn, ProfileCreate { 
                            user_name: "tester".to_string(), 
                            full_name: "Dave Wave".to_string(), 
                            description: "a description".to_string(), 
                            region: Some("usa".to_string()), 
                            main_url: Some("http://whatever.com".to_string()), 
                            avatar: vec![] 
                        }).await;
                        inserted_profile.unwrap()
                    }
                };
                let original_msg_id = db_repo.insert_message(&conn, profile_id, "Testing body 123").await;
        
                Fixtures {
                    original_msg_id: original_msg_id.unwrap(),
                    profile_id: profile_id,
                    conn
                }
            }
        }

        #[async_trait]
        impl QueryMessagesByUserFn for QueryMsgByUserDbRepo {
            async fn query_messages_by_user(&self, conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MessageQueryResult>, sqlx::Error> {
                private_members::query_messages_by_user_inner(conn, user_id, last_updated_at, page_size).await
            }
        }

        #[tokio::test]
        async fn test_query_messages_by_user () {
            let mut db_repo = QueryMsgByUserDbRepo{fixtures: None};
            db_repo.fixtures = Some(db_repo.setup().await);

            let fixtures = db_repo.fixtures.clone().unwrap();
            let result = db_repo.query_messages_by_user(&fixtures.conn, fixtures.profile_id, Utc::now(), 10).await;

            match result {
                Ok(rows) => {
                    println!("length {}", rows.len());
                    assert!(rows.len() == 10)
                },
                Err(e) => {
                    println!("test_query_messages_by_user error: {:?}", e);
                    panic!("{}", e)
                }
            }
        }
    }
}