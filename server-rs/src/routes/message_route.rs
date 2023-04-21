use crate::common::entities::broadcast::BroadcastQueryResult;
use crate::common::entities::message::{MessageJson, MessageQuery, MessageQueryResult, MessageBody};
use crate::common::app_state::AppState;
use crate::common::entities::profile::{ProfileQueryResult, ProfileShort};
use crate::common::entities::utils::get_last_id;
use actix_web::{web, web::{Query, Json}, Responder};
use futures::TryStreamExt;
use sqlx::{Pool, Postgres};


#[allow(unused)]
pub async fn create_message(app_data: web::Data<AppState>, params: Json<MessageJson>) -> impl Responder {
    let insert = "insert into message (body) values ($1) returning id";

    let body = if params.body.len() < 140 {
        &params.body[..]
    } else {
        &params.body[..140]
    };

    let query_result = sqlx::query(insert)
        .bind(body)
        .execute(&app_data.conn)
        .await;

    match query_result {
        Ok(r) => {
            let id = get_last_id(&app_data.conn).await;
            Json(format!("create_message id: {}", id))
        },
        Err(e) => Json(format!("create_messaage error: {}", e)),
    }
}

#[allow(unused)]
pub async fn get_message(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    // get message
    let message_result = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(query.id)
        .fetch_one(&app_data.conn)
        .await;
      
    let message_body = set_msg_result_profile(&app_data.conn, message_result).await;

    set_msg_broadcasting_msg(&app_data.conn, message_body.unwrap()).await    
}

#[allow(unused)]
pub async fn get_messages(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let mut message_rows = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(query.id)
        .fetch(&app_data.conn);
    
    let mut msg_collection: Vec<MessageBody> = vec![];
    while let Ok(Some(row)) = message_rows.try_next().await {
        let msg_body = set_msg_profile(&app_data.conn, row).await;
        msg_collection.push(set_msg_broadcasting_msg(&app_data.conn, msg_body.unwrap()).await.unwrap());
    }

    Json(msg_collection)
}

async fn set_msg_result_profile(conn: &Pool<Postgres>, message_result: Result<MessageQueryResult, sqlx::Error>) -> Option<MessageBody> {
    match message_result {
        Ok(msg) => {
            set_msg_profile(conn, msg).await
        },
        Err(e) => {
            println!("get_message error: {:?}", e);
            None
        }
    }
}

async fn set_msg_profile(conn: &Pool<Postgres>, msg: MessageQueryResult) -> Option<MessageBody> {
    let profile_result = sqlx::query_as::<_, ProfileQueryResult>("select * from profile where id = $1")
        .bind(msg.user_id)
        .fetch_one(conn)
        .await;

    match profile_result {
        Ok(profile) => {
            Some(MessageBody {
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
            None
        }
    }
}

async fn set_msg_broadcasting_msg(conn: &Pool<Postgres>, mut message: MessageBody) -> Option<MessageBody> {
    let broadcast_result = sqlx::query_as::<_, BroadcastQueryResult>("select * from message_broadcast where main_msg_id = $1")
        .bind(message.id)
        .fetch_one(conn)
        .await;
    
    match broadcast_result {
        Ok(broadcast_msg) => {
            let broadcast_msg_result = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
                .bind(broadcast_msg.broadcasting_msg_id)
                .fetch_one(conn)
                .await;

            let broadcast_msg_body = set_msg_result_profile(conn, broadcast_msg_result).await;

            match broadcast_msg_body {
                Some(body) => {
                    message.broadcasting_msg = Some(Box::new(body));                    
                },
                None => {}
            }            
        },
        Err(e) => {
            println!("get_broadcast error: {:?}", e);            
        }
    }

    Some(message)
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        test, 
    };
    use crate::{common_test::actix_fixtures::{get_app}, common::entities::profile::ProfileCreate};

    #[actix_web::test]
    async fn test_get_message() {
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
        let create_req = test::TestRequest::post().uri("/v1/msg").set_json(Json(MessageJson {
            body: "hello".to_string()
        })).to_request();
        let create_result = test::call_service(&app, create_req).await;
        println!("create_result: {:?}", create_result.response().body());

        // 3. get the new message
        let get_req = test::TestRequest::get().uri("/v1/msg&id=123").to_request();
        let get_result = test::call_service(&app, get_req).await;

        println!("get_result: {:?}", get_result.response().body());
        assert!(get_result.status() == 200);
    }
}