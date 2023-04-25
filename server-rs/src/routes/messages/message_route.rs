use crate::common::entities::broadcasts::repo::{QueryMessageBroadcastFn};
use crate::common::entities::messages::model::MessageQueryResult;
use crate::common::app_state::AppState;
use crate::common::entities::messages::repo::{InsertMessageFn, QueryMessageFn};
use crate::common::entities::profiles::model::{ProfileQueryResult, ProfileShort};
use crate::common::entities::profiles::repo::{QueryProfileFn};
use crate::common::entities::base::DbRepo;
use actix_web::{web, web::{Query, Json}, Responder};
use futures::TryStreamExt;
use sqlx::{Pool, Postgres};
use std::error::Error;
use super::model::{MessageResponder, MessagePostJson, MessageQuery};


#[allow(unused)]
pub async fn create_message(app_data: web::Data<AppState>, params: Json<MessagePostJson>) -> Result<impl Responder, Box<dyn Error>> {   
    let body = if params.body.len() < 140 {
        &params.body[..]
    } else {
        &params.body[..140]
    };

    let result = app_data.db_repo.insert_message(&app_data.conn, params.user_id, body).await;
    match result {
        Ok(id) => Ok(Json(id)),
        Err(e) => Err(Box::new(e))
    }
}

#[allow(unused)]
pub async fn get_message(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> Result<impl Responder, Box<dyn Error>> {
    let result = app_data.db_repo.query_message(&app_data.conn, query.id).await;

    let msg_responder_result = get_message_responder(app_data, result).await;

    match msg_responder_result {
        Ok(msg) => Ok(Json(msg)),
        Err(e) => Err(e)
    }
}

#[allow(unused)]
pub async fn get_messages(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> Result<impl Responder, Box<dyn Error>>  {
    let mut message_rows = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(query.id)
        .fetch(&app_data.conn);
    
    let mut msg_collection: Vec<MessageResponder> = vec![];
    while let Ok(Some(row)) = message_rows.try_next().await {
        let message_responder = get_message_responder(app_data.clone(), Ok(Some(row))).await;
        match message_responder {
            Ok(msg_responder) => {
                msg_collection.push(msg_responder.unwrap());
            },
            Err(e) => return Err(e)
        };        
    }

    Ok(Json(msg_collection))
}

async fn get_message_responder(app_data: web::Data<AppState>, msg_query_result: Result<Option<MessageQueryResult>, sqlx::Error>) -> Result<Option<MessageResponder>, Box<dyn Error>> {
    match msg_query_result {
        Ok(row) => {
            if let Some(message) = row {                
                let broadcasting_msg_responder = get_broadcast_msg_responder(&app_data.db_repo, &app_data.conn, message.id).await;
                
                let message_profile = app_data.db_repo.query_profile(&app_data.conn, message.id).await.unwrap();
                let mut message_responder = convert(Some(message), message_profile.unwrap()).unwrap();
                message_responder.broadcasting_msg = broadcasting_msg_responder;
                
                Ok(Some(message_responder))
            } else {
                Ok(None)
            }
        },
        Err(e) => {
            println!("get_message error: {:?}", e);
            Err(Box::new(e))
        }
    }
}

async fn get_broadcast_msg_responder(db_repo: &DbRepo, conn: &Pool<Postgres>, main_msg_id: i64) -> Option<Box<MessageResponder>> {
    let message_broadcast = db_repo.query_message_broadcast(conn, main_msg_id).await;

    match message_broadcast {
        Ok(mb) => {
            match mb {
                Some(item) => {
                    let broadcast_profile = db_repo.query_profile(conn, item.broadcasting_msg_id).await.unwrap();
                    let broadcast_msg = db_repo.query_message(conn, item.broadcasting_msg_id).await.unwrap();
                    Some(Box::new(convert(broadcast_msg, broadcast_profile.unwrap()).unwrap()))
                },
                None => None
            }
        },
        Err(_) => None
    }
}

fn convert(message: Option<MessageQueryResult>, profile: ProfileQueryResult) -> Option<MessageResponder> {
    match message {
        Some(msg) => {
            Some(MessageResponder {
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
        None => None
    }
}
