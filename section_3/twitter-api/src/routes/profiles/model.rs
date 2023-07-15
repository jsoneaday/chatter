use std::pin::Pin;
use actix_http::body::BoxBody;
use actix_multipart::Multipart;
use actix_web::http::header::ContentType;
use actix_web::{ FromRequest, HttpRequest, Responder, HttpResponse};
use actix_web::dev::Payload;
use chrono::{ Utc, DateTime };
use futures::{ Future, StreamExt };
use serde::{ Serialize, Deserialize };

use crate::routes::errors::error_utils::TwitterResponseError;
use crate::routes::utils::multipart::read_string;


#[derive(Deserialize)]
pub struct ProfileQuery {
    pub id: i64,
}

#[derive(Deserialize)]
pub struct ProfileByUserNameQuery {
    pub user_name: String,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileShort {
    pub id: i64,
    pub user_name: String,
    pub full_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProfileCreateMultipart {
    pub user_name: String,
    pub full_name: String,
    pub description: String,
    pub region: Option<String>,
    pub main_url: Option<String>,
    pub avatar: Option<Vec<u8>>,
}

impl ProfileCreateMultipart {
    async fn from_multipart(
        mut multipart: Multipart
    ) -> Result<Self, <Self as FromRequest>::Error> {
        let mut user_name: Option<String> = None;
        let mut full_name: Option<String> = None;
        let mut description: Option<String> = None;
        let mut region: Option<String> = None;
        let mut main_url: Option<String> = None;
        // did not need Bytes as conversion of field direct to vec<u8> is done later
        let mut avatar: Option<Vec<u8>> = None; 

        while let Some(field_result) = multipart.next().await {
            if let Err(e) = field_result {
                println!("error {}", e);
                break;
            }

            let mut field = field_result.unwrap();
            let content_disposition = field.content_disposition();
            let field_name = content_disposition.get_name().unwrap();

            match field_name {
                "user_name" => {
                    user_name = read_string(&mut field).await;
                }
                "full_name" => {
                    full_name = read_string(&mut field).await;
                }
                "description" => {
                    description = read_string(&mut field).await;
                }
                "region" => {
                    region = read_string(&mut field).await;
                }
                "main_url" => {
                    main_url = read_string(&mut field).await;                    
                }
                "avatar" => {
                    let mut field_avatar = vec![];
                    while let Some(chunk) = field.next().await {
                        let chunk = chunk.unwrap();
                        field_avatar.extend_from_slice(&chunk);
                    }
                    avatar = Some(field_avatar);
                }
                _ => (),
            }
        }

        if user_name.is_some() && full_name.is_some() && description.is_some() {
            Ok(Self {
                user_name: user_name.unwrap(),
                full_name: full_name.unwrap(),
                description: description.unwrap(),
                region,
                main_url,
                avatar,
            })
        } else {
            Err(TwitterResponseError.into())
        }
    }
}

impl FromRequest for ProfileCreateMultipart {
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
pub struct ProfileResponder {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub user_name: String,
    pub full_name: String,
    pub description: String,
    pub region: Option<String>,
    pub main_url: Option<String>,
    pub avatar: Option<Vec<u8>>,
}

impl Responder for ProfileResponder {
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
                    .body("Failed to serialize ProfileResponder.")
            },
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct  ProfileResponders(pub Vec<ProfileResponder>);

impl Responder for ProfileResponders {
    type Body = BoxBody;

    fn respond_to(self, _: &HttpRequest) -> HttpResponse<Self::Body> {
        let response = serde_json::to_string(&self);

        match response {
            Ok(str) => HttpResponse::Ok()
                .content_type(ContentType::json())
                .body(str),
            Err(_) => HttpResponse::InternalServerError()
                .content_type(ContentType::json())
                .body("Failed to serialize ProfileResponders")
        }
    }
}