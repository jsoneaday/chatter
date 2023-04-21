use actix_web::{HttpResponse, Responder, body::BoxBody};
use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use sqlx::{FromRow};
use super::profile::ProfileShort;

#[derive(Deserialize, Serialize, FromRow)]
pub struct MessageQueryResult {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub user_id: i64,
    pub body: String,
    pub image: Option<Vec<u8>>,
    pub likes: i32    
}

#[derive(Deserialize)]
pub struct MessageQuery {
    pub id: i64
}

#[derive(Deserialize, Serialize)]
pub struct MessageJson {
    pub body: String
}

#[derive(Deserialize, Serialize)]
pub struct MessageBody {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub body: String,
    pub likes: i32,
    pub broadcasting_msg: Option<Box<MessageBody>>,
    pub image: Option<Vec<u8>>,
    pub profile: ProfileShort
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