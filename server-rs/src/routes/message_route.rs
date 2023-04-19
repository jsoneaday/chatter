use actix_web::{web, HttpResponse, web::Query, Responder, body::BoxBody};
use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use crate::common::app_state::AppState;

#[derive(Deserialize, Serialize)]
pub struct MessageBody {
    pub id: String,
    pub user_name: String,
    pub full_name: String,
    pub time_stamp: DateTime<Utc>,
    pub body: String,
    pub repeat_id: String,
    pub like_count: usize,
    pub response_ids: Vec<String>,
    pub rechat_ids: Vec<String>,
    pub pic_url: Option<String>
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

#[allow(unused)]
pub async fn get_message(data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let message = MessageBody {
        id: "123456789".to_string(),
        user_name: "don".to_string(),
        full_name: "Don Johnson".to_string(),
        time_stamp: chrono::offset::Utc::now(),
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".to_string(),
        repeat_id: "987654321".to_string(),
        like_count: 22,
        response_ids: vec!["1".to_string(), "2".to_string()],
        rechat_ids: vec!["1".to_string(), "3".to_string()],
        pic_url: None
    };

    message
}