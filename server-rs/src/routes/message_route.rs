use std::error::Error;
use actix_web::{web, HttpResponse, web::{Query, Json}, Responder, body::BoxBody};
use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use crate::common::app_state::AppState;

#[derive(Deserialize, Serialize)]
pub struct MessageBody {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub body: String,
    // pub repeat_id: String,
    // pub like_count: usize,
    // pub response_ids: Vec<String>,
    // pub rechat_ids: Vec<String>,
    // pub pic_url: Option<String>
}
impl Responder for MessageBody {
    type Body = BoxBody;

    fn respond_to(self, _: &actix_web::HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self);
        
        HttpResponse::Ok()
            .content_type("application/json")
            .body(body.unwrap())        
    }
}

#[derive(Deserialize)]
pub struct MessageQuery {
    pub id: String,
    pub user_name: String
}

#[derive(Deserialize)]
pub struct MessageJson {
    pub body: String
}

#[allow(unused)]
pub async fn create_message(app_data: web::Data<AppState>, params: Json<MessageJson>) -> Result<impl Responder, Box<dyn Error>> {
    let insert = "insert into message (body) values ($1)";

    _ = sqlx::query(insert)
        .bind(&params.body)
        .execute(&app_data.conn)
        .await;
    
    Ok("")
}

#[allow(unused)]
pub async fn get_message(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let message = MessageBody {
        id: 1,
        created_at: chrono::offset::Utc::now(),
        updated_at: chrono::offset::Utc::now(),
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".to_string(),
        // repeat_id: "987654321".to_string(),
        // like_count: 22,
        // response_ids: vec!["1".to_string(), "2".to_string()],
        // rechat_ids: vec!["1".to_string(), "3".to_string()],
        // pic_url: None
    };

    message
}