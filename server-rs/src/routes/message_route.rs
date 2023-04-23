use crate::common::entities::messages::model::{MessagePostJson, MessageQuery, MessageQueryResult, MessageResponder};
use crate::common::app_state::AppState;
use crate::common::entities::messages::repo::MessageRepo;
use actix_web::{web, web::{Query, Json}, Responder};
use futures::TryStreamExt;
use std::error::Error;


#[allow(unused)]
pub async fn create_message(app_data: web::Data<AppState>, params: Json<MessagePostJson>) -> Result<impl Responder, Box<dyn Error>> {   
    let body = if params.body.len() < 140 {
        &params.body[..]
    } else {
        &params.body[..140]
    };

    let result = MessageRepo::create_message(&app_data.conn, params.user_id, body).await;
    match result {
        Ok(id) => Ok(Json(id)),
        Err(e) => Err(Box::new(e))
    }
}

#[allow(unused)]
pub async fn get_message(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> Result<impl Responder, Box<dyn Error>> {
    let result = MessageRepo::get_message(&app_data.conn, query.id).await;

    match result {
        Ok(message) => Ok(Json(message)),
        Err(e) => Err(Box::new(e))
    }
}

#[allow(unused)]
pub async fn get_messages(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let mut message_rows = sqlx::query_as::<_, MessageQueryResult>("select * from message where id = $1")
        .bind(query.id)
        .fetch(&app_data.conn);
    
    let mut msg_collection: Vec<MessageResponder> = vec![];
    while let Ok(Some(row)) = message_rows.try_next().await {
        let msg_body = MessageRepo::set_msg_profile(&app_data.conn, row).await;
        msg_collection.push(MessageRepo::set_msg_broadcasting_msg(&app_data.conn, msg_body.unwrap()).await.unwrap());
    }

    Json(msg_collection)
}

#[cfg(test)]
mod tests {
    
}