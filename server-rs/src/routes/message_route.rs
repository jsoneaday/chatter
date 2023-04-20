use actix_web::{web, HttpResponse, web::{Query, Json}, Responder, body::BoxBody};
use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use sqlx::{postgres::PgRow, FromRow, Row};
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

impl FromRow<'_, PgRow> for MessageBody {
    fn from_row(r: &PgRow) -> sqlx::Result<Self> {
        Ok(Self {
            id: r.get_unchecked::<i64, _>("id"),
            created_at: r.get_unchecked::<DateTime<Utc>, _>("created_at"),
            updated_at: r.get_unchecked::<DateTime<Utc>, _>("updated_at"),
            body: r.get_unchecked::<String, _>("body")
        })
    }
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
    pub id: i64
}

#[derive(Deserialize)]
pub struct MessageJson {
    pub body: String
}

#[allow(unused)]
pub async fn create_message(app_data: web::Data<AppState>, params: Json<MessageJson>) -> impl Responder {
    let insert = "insert into message (body) values ($1)";

    let query_result = sqlx::query(insert)
        .bind(&params.body[..140])
        .execute(&app_data.conn)
        .await;

    match query_result {
        Ok(r) => Json(format!("rows affected: {}", r.rows_affected())),
        Err(e) => Json(format!("create_messaage error: {}", e)),
    }
}

#[allow(unused)]
pub async fn get_messages(app_data: web::Data<AppState>, query: Query<MessageQuery>) -> impl Responder {
    let message_result = sqlx::query_as::<_, MessageBody>("select * from message where id = $1")
        .bind(query.id)
        .fetch_all(&app_data.conn)
        .await;
    
    match message_result {
        Ok(row) => Json(row),
        Err(e) => Json::<Vec<MessageBody>>(vec![])
    }
}