use crate::common::entities::{
    base::{EntityId, DbRepo}
};
use sqlx::{Pool, Postgres};
use super::model::{MessageQueryResult, MessageWithProfileQueryResult, MsgWithBroadcastMsgQueryResult};
use async_trait::async_trait;
use chrono::{DateTime, Utc};


mod private_members {
    use super::*;

    pub async fn insert_message_inner(conn: &Pool<Postgres>, user_id: i64, body: &str, broadcasting_msg_id: Option<i64>) -> Result<i64, sqlx::Error> {
        let tx = conn.begin().await.unwrap();

        let insert_msg_result = sqlx::query_as::<_, EntityId>("insert into message (user_id, body) values ($1, $2) returning id")
            .bind(user_id)
            .bind(body)
            .fetch_one(conn)
            .await;        
    
        let message_id_result = match insert_msg_result {
            Ok(r) => Ok(r.id),
            Err(e) => {
                println!("insert_message error: {}", e);
                Err(e)
            },
        };
        if let Err(e) = message_id_result {
            _ = tx.rollback().await;
            return Err(e);
        }

        if let Some(bm_id) = broadcasting_msg_id {
            let message_braodcast_result = sqlx::query_as::<_, EntityId>("insert into message_broadcast (main_msg_id, broadcasting_msg_id) values ($1, $2) returning id")
                .bind(message_id_result.as_ref().unwrap())
                .bind(bm_id)
                .fetch_one(conn)
                .await;

            if let Err(e) = message_braodcast_result {
                _ = tx.rollback().await;
                return Err(e);
            }
        }

        _ = tx.commit().await;

        message_id_result
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

    /// todo: Need to include broadcasting messages if existing
    #[allow(unused)]
    pub async fn query_message_inner(conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageQueryResult>, sqlx::Error> {
        sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await
    }

    /// todo: Need to include broadcasting messages if existing
    #[allow(unused)]
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

    pub async fn query_messages_by_following_inner(conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MsgWithBroadcastMsgQueryResult>, sqlx::Error> {
        // 1. get the messages of the users the user_id is following
        let following_messages_with_profiles_result = sqlx::query_as::<_, MessageWithProfileQueryResult>(
            r"
                select m.id, m.updated_at, m.body, m.likes, m.image, m.user_id as creator_id, p.user_name, p.full_name, p.avatar, mb.id as broadcast_msg_id                    
                    from message m 
                        join follow f on m.user_id = f.following_id
                        join profile p on p.id = f.following_id
                        left join message_broadcast mb on m.id = mb.main_msg_id
                        where
                            f.follower_id = $1 
                            and m.updated_at < $2
                        order by m.updated_at desc 
                        limit $3
            "
        )
        .bind(user_id)
        .bind(last_updated_at)
        .bind(page_size)
        .fetch_all(conn)
        .await;
        
        match following_messages_with_profiles_result {
            Ok(following_messages) => {
                let following_messages_with_broadcasts = following_messages.clone()
                    .into_iter()
                    .filter(|msg| {
                        msg.broadcast_msg_id.is_some() && msg.broadcast_msg_id.unwrap() > 0
                    })                    
                    .collect::<Vec<MessageWithProfileQueryResult>>();

                let optional_matching_broadcast_messages = get_broadcasting_messages_of_messages(conn, &following_messages_with_broadcasts).await;
                let final_message_list = get_following_messages_with_broadcasts(&optional_matching_broadcast_messages, following_messages);
                Ok(final_message_list)
            },
            Err(e) => Err(e) 
        }
    }

    async fn get_broadcasting_messages_of_messages(conn: &Pool<Postgres>, following_messages_with_broadcasts: &Vec<MessageWithProfileQueryResult>) -> Option<Vec<MessageWithProfileQueryResult>> {               
        let following_broadcast_message_ids = following_messages_with_broadcasts
            .iter()
            .map(|msg| {
                msg.broadcast_msg_id.unwrap()
            })
            .collect::<Vec<i64>>();

        let broadcasting_msg_result = sqlx::query_as::<_, MessageWithProfileQueryResult>(
            r"
                select m.id, m.updated_at, m.body, m.likes, m.image, m.user_id as creator_id, p.user_name, p.full_name, p.avatar, mb.id as broadcast_msg_id
                    from message m 
                        join profile p on m.user_id = p.id
                        left join message_broadcast mb on m.id = mb.main_msg_id
                    where m.id = ANY($1)
            "
        )
        .bind(following_broadcast_message_ids)
        .fetch_all(conn)
        .await;

        match broadcasting_msg_result {
            Ok(broadcast_messages) => {
                Some(broadcast_messages)
            },
            Err(e) => { 
                println!("get_broadcasting_messages_of_messages: {}", e);
                None
            }
        }
    }

    fn get_following_messages_with_broadcasts(optional_broadcast_messages: &Option<Vec<MessageWithProfileQueryResult>>, following_messages_with_broadcasts: Vec<MessageWithProfileQueryResult>) -> Vec<MsgWithBroadcastMsgQueryResult> {
        let mut final_list_of_messages: Vec<MsgWithBroadcastMsgQueryResult> = vec![];
        
        following_messages_with_broadcasts
            .iter()
            .for_each(|following_message_with_broadcast| {
                let mut final_message = MsgWithBroadcastMsgQueryResult {
                    id: following_message_with_broadcast.id,
                    updated_at: following_message_with_broadcast.updated_at,
                    creator_id: following_message_with_broadcast.creator_id,
                    body: following_message_with_broadcast.body.clone(),
                    likes: following_message_with_broadcast.likes,
                    image: following_message_with_broadcast.image.clone(),
                    user_name: following_message_with_broadcast.user_name.clone(),
                    full_name: following_message_with_broadcast.full_name.clone(),
                    avatar: following_message_with_broadcast.avatar.clone(),
                    broadcast_msg_id: None,
                    broadcast_msg_updated_at: None,
                    broadcast_msg_creator_id: None,
                    broadcast_msg_body: None,
                    broadcast_msg_likes: None,
                    broadcast_msg_image: None,    
                    broadcast_msg_user_name: None,
                    broadcast_msg_full_name: None,
                    broadcast_msg_avatar: None
                };

                let optional_matching_broadcast_msg = if let Some(broadcast_messages) = optional_broadcast_messages {
                    broadcast_messages
                    .iter()
                    .find(|bm| {
                        Some(bm.id) == following_message_with_broadcast.broadcast_msg_id
                    })
                } else {
                    None
                };

                if let Some(matching_broadcast) = optional_matching_broadcast_msg {
                    final_message.broadcast_msg_id = Some(matching_broadcast.id);
                    final_message.broadcast_msg_updated_at = Some(matching_broadcast.updated_at);
                    final_message.broadcast_msg_creator_id = Some(matching_broadcast.creator_id);
                    final_message.broadcast_msg_body = matching_broadcast.body.to_owned();
                    final_message.broadcast_msg_likes = Some(matching_broadcast.likes);
                    final_message.broadcast_msg_image = matching_broadcast.image.to_owned();
                    final_message.broadcast_msg_user_name = Some(matching_broadcast.user_name.to_string());
                    final_message.broadcast_msg_full_name = Some(matching_broadcast.full_name.to_string());
                    final_message.broadcast_msg_avatar = Some(matching_broadcast.avatar.to_owned());
                };

                final_list_of_messages.push(final_message);
            });
        
        final_list_of_messages
    }
}

#[async_trait]
pub trait InsertMessageFn {
    async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, broadcasting_msg_id: Option<i64>) -> Result<i64, sqlx::Error>;
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
pub trait QueryMessagesByFollowingFn {
    async fn query_messages_by_following(&self, conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MsgWithBroadcastMsgQueryResult>, sqlx::Error>;
}

#[async_trait]
impl InsertMessageFn for DbRepo {
    async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, broadcasting_msg_id: Option<i64>) -> Result<i64, sqlx::Error> {
        private_members::insert_message_inner(conn, user_id, body, broadcasting_msg_id).await
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

#[async_trait]
impl QueryMessagesByFollowingFn for DbRepo {
    async fn query_messages_by_following(&self, conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MsgWithBroadcastMsgQueryResult>, sqlx::Error> {
        private_members::query_messages_by_following_inner(conn, user_id, last_updated_at, page_size).await
    }
}

#[cfg(test)]
mod tests {
    use crate::{common_tests::actix_fixture::get_conn_pool, common::entities::profiles::{repo::{InsertProfileFn, QueryProfileFn}, model::ProfileCreate}};
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
            let original_msg_id = db_repo.insert_message(&conn, profile_id, "Testing body 123", None).await;
    
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
            async fn insert_message(&self, conn: &Pool<Postgres>, user_id: i64, body: &str, broadcasting_msg_id: Option<i64>) -> Result<i64, sqlx::Error> {
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
            let original_msg_id = db_repo.insert_message(&fixtures.conn, profile_id, "Body of message that is being responded to.", None).await;

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
                let original_msg_id = db_repo.insert_message(&conn, profile_id, "Testing body 123", None).await;
        
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

    mod test_mod_query_messages_by_following {
        use crate::common::entities::profiles::{model::ProfileQueryResult, repo::FollowUserFn};

        use super::*;

        #[derive(Clone, Debug)]
        struct QueryMsgFollowingFixtures {
            pub follower_user: ProfileQueryResult,
            pub following_users: Vec<ProfileQueryResult>,
            pub following_users_messages: Vec<MessageQueryResult>,
            pub conn: Pool<Postgres>
        }
        struct QueryMsgFollowingDbRepo { fixtures: Option<QueryMsgFollowingFixtures> }

        async fn setup() -> QueryMsgFollowingFixtures {
            let conn = get_conn_pool().await;
            let db_repo = DbRepo{};

            let follower_id = db_repo.insert_profile(&conn, ProfileCreate { 
                user_name: "follower".to_string(), 
                full_name: "Dave Follower".to_string(), 
                description: "Follower description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            }).await.unwrap();
            
            let follower_user = db_repo.query_profile(&conn, follower_id).await.unwrap().unwrap();
          
            let mut following_users: Vec<ProfileQueryResult> = Vec::new();
            let mut following_users_messages: Vec<MessageQueryResult> = Vec::new();
            let following_letters = vec!["a", "b"];
            for l in following_letters {
                let following_id = db_repo.insert_profile(&conn, ProfileCreate { 
                    user_name: format!("following_{}", l), 
                    full_name: format!("Dave Following{}", l), 
                    description: format!("Follower{} description", l), 
                    region: Some("usa".to_string()), 
                    main_url: Some("http://whatever.com".to_string()), 
                    avatar: vec![] 
                }).await.unwrap();
                
                following_users.push(db_repo.query_profile(&conn, following_id).await.unwrap().unwrap());

                let following_user_message_1_id = db_repo.insert_message(&conn, following_id, format!("Message {}: 1", l).as_str(), None).await.unwrap();                
                let following_user_message_1 = db_repo.query_message(&conn, following_user_message_1_id).await.unwrap().unwrap();
                following_users_messages.push(following_user_message_1);

                let following_user_message_2_id = db_repo.insert_message(&conn, following_id, format!("Message {}: 2", l).as_str(), None).await.unwrap();
                let following_user_message_2 = db_repo.query_message(&conn, following_user_message_2_id).await.unwrap().unwrap();
                following_users_messages.push(following_user_message_2);

                _ = db_repo.follow_user(&conn, follower_id, following_id).await.unwrap();
            }
                   
            QueryMsgFollowingFixtures {
                follower_user,
                following_users,
                following_users_messages,
                conn
            }
        }

        #[async_trait]
        impl QueryMessagesByFollowingFn for QueryMsgFollowingDbRepo {
            async fn query_messages_by_following(&self, conn: &Pool<Postgres>, user_id: i64, last_updated_at: DateTime<Utc>, page_size: i16) -> Result<Vec<MsgWithBroadcastMsgQueryResult>, sqlx::Error> {
                private_members::query_messages_by_following_inner(conn, user_id, last_updated_at, page_size).await
            }
        }

        #[async_trait]
        impl InsertProfileFn for QueryMsgFollowingDbRepo {
            async fn insert_profile(&self, _: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
                let fixtures = self.fixtures.as_ref().unwrap();
                if params.user_name.eq(&fixtures.follower_user.user_name) {
                    Ok(fixtures.follower_user.id)
                } else {
                    let following = fixtures.following_users.iter().find(|fl| {
                        fl.user_name == params.user_name
                    });
                    Ok(following.unwrap().id)
                }
            }
        }

        #[async_trait]
        impl InsertMessageFn for QueryMsgFollowingDbRepo {
            async fn insert_message(&self, _: &Pool<Postgres>, user_id: i64, body: &str, _: Option<i64>) -> Result<i64, sqlx::Error> {                
                Ok(self.fixtures.clone().unwrap().following_users_messages.into_iter().find(|msg| {
                    msg.user_id == user_id && msg.body == Some(body.to_string())
                }).unwrap().id)
            }
        }

        #[async_trait]
        impl FollowUserFn for QueryMsgFollowingDbRepo {
            async fn follow_user(&self, _: &Pool<Postgres>, _: i64, _: i64) -> Result<i64, sqlx::Error>  {
                Ok(0)
            }
        }

        #[tokio::test]
        async fn test_query_messages_by_following() {
            let db_repo = QueryMsgFollowingDbRepo{ fixtures: Some(setup().await) };
            let conn = &db_repo.fixtures.clone().unwrap().conn;
            
            // create a single profile that will follow other profiles
            let follower_id = db_repo.insert_profile(conn, ProfileCreate { 
                user_name: "follower".to_string(), 
                full_name: "Dave Follower".to_string(), 
                description: "Follower description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            }).await.unwrap();
            
            let mut created_following_messages: Vec<i64> = vec![];
            for l in ["a", "b"] {
                let following_id = db_repo.insert_profile(conn, ProfileCreate { 
                    user_name: format!("following_{}", l), 
                    full_name: format!("Dave Following{}", l), 
                    description: format!("Follower{} description", l), 
                    region: Some("usa".to_string()), 
                    main_url: Some("http://whatever.com".to_string()), 
                    avatar: vec![] 
                }).await.unwrap();
                
                // create several messages by those following profiles
                let following_message_1_id = db_repo.insert_message(&conn, following_id, format!("Message {}: 1", l).as_str(), None).await.unwrap();
                created_following_messages.push(following_message_1_id);
                let following_message_2_id = db_repo.insert_message(&conn, following_id, format!("Message {}: 2", l).as_str(), None).await.unwrap();
                created_following_messages.push(following_message_2_id);

                // set follow
                _ = db_repo.follow_user(conn, follower_id, following_id).await;
            }

            // query db to get the messages created by profiles the single user is following
            let following_messages = db_repo.query_messages_by_following(conn, follower_id, Utc::now(), 10).await.unwrap();
            let following_msg_ids = following_messages.clone().iter().map(|fm| {
                fm.id
            }).collect::<Vec<i64>>();

            for following_msg_id in &following_msg_ids {
                assert!(created_following_messages.contains(following_msg_id));
            }
            assert!(following_msg_ids.len() == created_following_messages.len());
        }
    }
}