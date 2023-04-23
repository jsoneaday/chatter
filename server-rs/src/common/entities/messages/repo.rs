use crate::common::entities::{utils::EntityId, broadcasts::model::BroadcastQueryResult, profiles::model::{ProfileQueryResult, ProfileShort}};
use sqlx::{Pool, Postgres};

use super::model::{MessageResponder, MessageQueryResult};

pub struct MessageRepo{}

#[allow(unused)]
impl MessageRepo {
    pub async fn create_message(conn: &Pool<Postgres>, user_id: i64, body: &str) -> Result<i64, sqlx::Error> {
        let query_result = sqlx::query_as::<_, EntityId>("insert into message (user_id, body) values ($1, $2) returning id")
        .bind(user_id)
        .bind(body)
        .fetch_one(conn)
        .await;

        match query_result {
            Ok(r) => Ok(r.id),
            Err(e) => {
                println!("create_messaage error: {}", e);
                Err(e)
            },
        }
    }

    pub async fn get_message(conn: &Pool<Postgres>, id: i64) -> Result<Option<MessageResponder>, sqlx::Error> {
        let message_result = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await;
    
        match message_result {
            Ok(row) => {
                if let Some(message) = row {
                    let set_msg_with_profile = MessageRepo::set_msg_result_profile(conn, Ok(message.clone())).await;
                    let complete_msg = MessageRepo::set_msg_result_broadcasting_msg(conn, set_msg_with_profile).await;
                    Ok(Some(complete_msg.unwrap()))
                } else {
                    Ok(None)
                }
            },
            Err(e) => {
                println!("get_message error: {:?}", e);
                Err(e)
            }
        }  
    }

    pub async fn set_msg_result_profile(conn: &Pool<Postgres>, message_result: Result<MessageQueryResult, sqlx::Error>) -> Result<MessageResponder, sqlx::Error> {
        match message_result {
            Ok(msg) => MessageRepo::set_msg_profile(conn, msg).await,
            Err(e) => {
                println!("set_msg_result_profile error: {:?}", e);
                Err(e)
            }
        }
    }

    pub async fn set_msg_profile(conn: &Pool<Postgres>, msg: MessageQueryResult) -> Result<MessageResponder, sqlx::Error> {
        let profile_result = sqlx::query_as::<_, ProfileQueryResult>("select * from profile where id = $1")
            .bind(msg.user_id)
            .fetch_one(conn)
            .await;
    
        match profile_result {
            Ok(profile) => {
                Ok(MessageResponder {
                    id: msg.id,
                    created_at: msg.created_at,
                    body: msg.body,
                    likes: msg.likes,
                    broadcasting_msg: None,
                    image: msg.image,
                    profile: ProfileShort {
                        id: profile.id,
                        created_at: profile.created_at,
                        user_name: profile.user_name,
                        full_name: profile.full_name,
                        avatar: profile.avatar
                    }
                })
            },
            Err(e) => {
                println!("get_profile error: {:?}", e);
                Err(e)
            }
        }
    }

    pub async fn set_msg_result_broadcasting_msg(conn: &Pool<Postgres>, message_result: Result<MessageResponder, sqlx::Error>) -> Result<MessageResponder, sqlx::Error> {
        match message_result {
            Ok(msg) => MessageRepo::set_msg_broadcasting_msg(conn, msg).await,
            Err(e) => {
                println!("set_msg_result_broadcasting_msg error: {:?}", e);
                Err(e)
            }
        }
    }

    pub async fn set_msg_broadcasting_msg(conn: &Pool<Postgres>, mut message: MessageResponder) -> Result<MessageResponder, sqlx::Error>  {
        let broadcast_result = sqlx::query_as::<_, BroadcastQueryResult>("select * from message_broadcast where main_msg_id = $1")
            .bind(message.id)
            .fetch_optional(conn)
            .await;
        
        match broadcast_result {
            Ok(optional_broadcast_msg) => {
                let result = if let Some(broadcast_msg) = optional_broadcast_msg {
                    let broadcast_msg_result = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
                        .bind(broadcast_msg.broadcasting_msg_id)
                        .fetch_one(conn)
                        .await;
    
                    let broadcast_msg_with_profile = MessageRepo::set_msg_result_profile(conn, broadcast_msg_result).await;
    
                    match broadcast_msg_with_profile {
                        Ok(msg_body) => {
                            message.broadcasting_msg = Some(Box::new(msg_body)); 
                            Ok(message)
                        },
                        Err(e) => Err(e)
                    }
                } else {
                    Ok(message)
                };
                result
            },
            Err(e) => {
                println!("set_msg_broadcasting_msg error: {:?}", e);   
                Err(e)
            }
        }
    }
}
