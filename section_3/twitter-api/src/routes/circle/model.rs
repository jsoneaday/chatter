use actix_http::body::BoxBody;
use actix_web::{Responder, HttpResponse, http::header::ContentType};
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
pub struct CircleQuery {
    pub id: i64,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCircleMemberQuery {
    pub circle_owner_id: i64, 
    pub new_member_id: i64
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveCircleMemberQuery{
    pub circle_group_id: i64, 
    pub member_id: i64
}

#[derive(Deserialize, Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CircleGroupMemberResponder {
    pub id: i64,
    pub updated_at: DateTime<Utc>,
    pub circle_group_id: i64,
    pub member_id: i64,
    pub user_name: String,
    pub full_name: String,
    pub avatar: Option<Vec<u8>>
}

impl Responder for CircleGroupMemberResponder {
    type Body = BoxBody;

    fn respond_to(self, _: &actix_web::HttpRequest) -> actix_web::HttpResponse<Self::Body> {
        let body_result = serde_json::to_string(&self);

        match body_result {
            Ok(body) => {
                HttpResponse::Ok()
                .content_type(ContentType::json())
                .body(body)
            },
            Err(_) => {
                HttpResponse::InternalServerError()
                    .content_type(ContentType::json())
                    .body("Failed to serialize CircleGroupMemberResponder.")
            },
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CircleGroupMemberResponders(pub Vec<CircleGroupMemberResponder>);

impl Responder for CircleGroupMemberResponders {
    type Body = BoxBody;

    fn respond_to(self, _: &actix_web::HttpRequest) -> actix_web::HttpResponse<Self::Body> {
        let body_result = serde_json::to_string(&self);

        match body_result {
            Ok(body) => {
                HttpResponse::Ok()
                .content_type(ContentType::json())
                .body(body)
            },
            Err(_) => {
                HttpResponse::InternalServerError()
                    .content_type(ContentType::json())
                    .body("Failed to serialize CircleGroupMemberResponder.")
            },
        }
    }
}