use crate::common::entities::broadcast::BroadcastQueryResult;
use crate::common::entities::message::{MessageJson, MessageQuery, MessageQueryResult, MessageResponder};
use crate::common::app_state::AppState;
use crate::common::entities::profile::{ProfileQueryResult, ProfileShort};
use crate::common::entities::utils::EntityId;
use actix_web::{web, web::{Query, Json}, Responder};
use futures::TryStreamExt;
use sqlx::{Pool, Postgres};


#[allow(unused)]
pub async fn create_message(app_data: web::Data<AppState>, params: Json<MessageJson>) -> impl Responder {   
    let body = if params.body.len() < 140 {
        &params.body[..]
    } else {
        &params.body[..140]
    };

    let query_result = sqlx::query_as::<_, EntityId>("insert into message (user_id, body) values ($1, $2) returning id")
        .bind(params.user_id)
        .bind(body)
        .fetch_one(&app_data.conn)
        .await;

    match query_result {
        Ok(r) => Json(r.id),
        Err(e) => {
            println!("create_messaage error: {}", e);
            Json(0)
        },
    }
}

#[allow(unused)]
pub async fn get_message(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let message_result = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(query.id)
        .fetch_one(&app_data.conn)
        .await;
    
    match message_result {
        Ok(row) => {
            let set_msg_with_profile = set_msg_result_profile(&app_data.conn, Ok(row.clone())).await;
            let complete_msg = set_msg_result_broadcasting_msg(&app_data.conn, set_msg_with_profile).await;
            Json(Some(complete_msg.unwrap()))
        },
        Err(e) => {
            println!("get_message error: {:?}", e);
            Json::<Option<MessageResponder>>(None)
        }
    }  
}

#[allow(unused)]
pub async fn get_messages(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let mut message_rows = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(query.id)
        .fetch(&app_data.conn);
    
    let mut msg_collection: Vec<MessageResponder> = vec![];
    while let Ok(Some(row)) = message_rows.try_next().await {
        let msg_body = set_msg_profile(&app_data.conn, row).await;
        msg_collection.push(set_msg_broadcasting_msg(&app_data.conn, msg_body.unwrap()).await.unwrap());
    }

    Json(msg_collection)
}

async fn set_msg_result_profile(conn: &Pool<Postgres>, message_result: Result<MessageQueryResult, sqlx::Error>) -> Result<MessageResponder, sqlx::Error> {
    match message_result {
        Ok(msg) => set_msg_profile(conn, msg).await,
        Err(e) => {
            println!("set_msg_result_profile error: {:?}", e);
            Err(e)
        }
    }
}

async fn set_msg_profile(conn: &Pool<Postgres>, msg: MessageQueryResult) -> Result<MessageResponder, sqlx::Error> {
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

async fn set_msg_result_broadcasting_msg(conn: &Pool<Postgres>, message_result: Result<MessageResponder, sqlx::Error>) -> Result<MessageResponder, sqlx::Error> {
    match message_result {
        Ok(msg) => set_msg_broadcasting_msg(conn, msg).await,
        Err(e) => {
            println!("set_msg_result_broadcasting_msg error: {:?}", e);
            Err(e)
        }
    }
}

async fn set_msg_broadcasting_msg(conn: &Pool<Postgres>, mut message: MessageResponder) -> Result<MessageResponder, sqlx::Error>  {
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

                let broadcast_msg_with_profile = set_msg_result_profile(conn, broadcast_msg_result).await;

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

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        test, 
    };
    use crate::{common_test::actix_fixtures::{get_app}, common::entities::profile::ProfileCreate};

    #[actix_web::test]
    async fn test_create_and_get_message() {
        let app = get_app().await;

        // 1. create new profile
        let create_profile_req = test::TestRequest::post().uri("/v1/profile").set_json(Json(ProfileCreate {
            user_name: "user_name".to_string(),
            full_name: "full_name".to_string(),
            description: "description".to_string(),
            region: Some("region".to_string()),
            main_url: Some("main_url".to_string()),
            avatar: Vec::new()
        })).to_request();
        let profile_id = test::call_and_read_body_json::<_, _, i64>(&app, create_profile_req).await;

        // 2. create new message
        const MSG_BODY_STR: &str = "Testing 123";
        let create_msg_req = test::TestRequest::post().uri("/v1/msg").set_json(Json(MessageJson {
            user_id: profile_id,
            body: MSG_BODY_STR.clone().to_string()
        })).to_request();
        let msg_id = test::call_and_read_body_json::<_, _, i64>(&app, create_msg_req).await;

        // 3. get the new message
        let get_msg_req = test::TestRequest::get().uri(&format!("/v1/msg?id={}", msg_id)).to_request();
        let get_msg_body = test::call_and_read_body_json::<_, _, Option<MessageResponder>>(&app, get_msg_req).await;

        assert!(get_msg_body.unwrap().body.unwrap().eq(MSG_BODY_STR));
    }
}