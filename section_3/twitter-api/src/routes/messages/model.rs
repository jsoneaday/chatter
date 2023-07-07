use actix_http::body::BoxBody;
use actix_web::{Responder, FromRequest, HttpResponse, HttpRequest, http::header::ContentType};
use actix_web::dev::Payload;
use actix_multipart::Multipart;
use log::info;
use serde::{Deserialize, Serialize};
use serde_repr::*;
use chrono::prelude::*;
use crate::routes::{profiles::model::ProfileShort, utils::multipart::{read_string, read_i64, read_i32}, errors::error_utils::TwitterResponseError};
use std::vec::Vec;
use std::pin::Pin;
use futures::{ Future, StreamExt };

#[derive(Deserialize)]
pub struct MessageQuery {
    pub id: i64
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageByFollowingQuery {
    pub follower_id: i64,
    pub last_updated_at: DateTime<Utc>,
    pub page_size: Option<i16>
}

#[derive(Deserialize, Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MessageCreateMultipart {
    pub user_id: i64,
    pub body: String,
    pub group_type: MessageGroupTypes,
    pub broadcasting_msg_id: Option<i64>,
    pub image: Option<Vec<u8>>,
}

impl MessageCreateMultipart {
    async fn from_multipart(
        mut multipart: Multipart
    ) -> Result<Self, <Self as FromRequest>::Error> {
        println!("start MessageCreateMultipart");
        let mut user_id: Option<i64> = None;
        let mut body: Option<String> = None;
        let mut group_type: Option<i32> = None;
        let mut broadcasting_msg_id: Option<i64> = None;
        let mut image: Option<Vec<u8>> = None;
        
        let mut find_fields_loop_count = 0;
        while let Some(field_result) = multipart.next().await {
            find_fields_loop_count += 1;
            info!("find_fields_loop_count {}", find_fields_loop_count);
            if let Err(e) = field_result {
                println!("error {}", e);
                break;
            }

            let mut field = field_result.unwrap();
            let content_disposition = field.content_disposition();
            let field_name = content_disposition.get_name().unwrap();
            println!("field_name {}", field_name);
            match field_name {
                "userId" | "user_id" => {
                    user_id = read_i64(&mut field).await;
                }
                "body" => {
                    body = read_string(&mut field).await;
                }
                "groupType" | "group_type" => {
                    group_type = read_i32(&mut field).await;
                }
                "broadcastingMsgId" | "broadcasting_msg_id" => {
                    broadcasting_msg_id = read_i64(&mut field).await;
                }
                "image" => {
                    let mut field_image = vec![];
                    while let Some(chunk) = field.next().await {
                        let chunk = chunk.unwrap();
                        field_image.extend_from_slice(&chunk);
                    }
                    image = Some(field_image);
                }
                _ => (),
            }
            if find_fields_loop_count > 6 {
                println!("looping count for finding multipart message fields has exceeded max {}", find_fields_loop_count);
                break;
            }
        }

        if user_id.is_some() && body.is_some() && group_type.is_some() {
            let result = Self {
                user_id: user_id.unwrap(),
                body: body.unwrap(),
                group_type: match group_type.unwrap() {
                    1 => MessageGroupTypes::Public,
                    2 => MessageGroupTypes::Circle,
                    _ => MessageGroupTypes::Public
                },
                broadcasting_msg_id,
                image: if let Some(img) = image {
                    Some(img.to_vec())
                } else {
                    None
                }
            };
            Ok(result)
        } else {
            Err(TwitterResponseError.into())
        }
    }
}

impl FromRequest for MessageCreateMultipart {
    type Error = actix_web::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {
        let multipart_future = Multipart::from_request(req, payload);

        let future = async {
            let multipart = multipart_future.await?;

            Self::from_multipart(multipart).await
        };

        Box::pin(future)
    }
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MessageResponder {
    pub id: i64,
    pub updated_at: DateTime<Utc>,
    pub body: Option<String>,
    pub likes: i32,
    pub has_image: bool,
    pub broadcasting_msg: Option<Box<MessageResponder>>,
    pub profile: ProfileShort
}

impl Responder for MessageResponder {
    type Body = BoxBody;

    fn respond_to(self, _: &HttpRequest) -> HttpResponse<Self::Body> {
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
                    .body("Failed to serialize MessageResponder.")
            },
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MessageResponders(pub Vec<MessageResponder>);

impl Responder for MessageResponders {
    type Body = BoxBody;

    fn respond_to(self, _: &HttpRequest) -> HttpResponse<Self::Body> {
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
                    .body("Failed to serialize MessageResponders.")
            },
        }
    }
}

#[derive(Deserialize_repr, Serialize_repr, Clone, Debug)]
#[repr(i32)]
pub enum MessageGroupTypes {
    Public = 1,
    Circle = 2
}
