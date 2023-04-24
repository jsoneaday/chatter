use crate::{common::app_state::AppState, routes::{message_route::{get_message, create_message}, profile_route::{create_profile, get_profile}}};
use std::env;
use dotenv::dotenv;
use sqlx::postgres::PgPool;
use actix_web::{
    App,
    web,
    Error,
    test, 
    dev::{Service, ServiceResponse}
};
use actix_http::Request;

#[allow(unused)]
pub async fn get_app_data() -> AppState {
    dotenv().ok();
    let postgres_host = env::var("POSTGRES_HOST").unwrap();
    let postgres_port = env::var("POSTGRES_PORT").unwrap().parse::<u16>().unwrap();
    let postgres_password = env::var("POSTGRES_PASSWORD").unwrap();
    let postgres_user = env::var("POSTGRES_USER").unwrap();
    let postgres_db = env::var("POSTGRES_DB").unwrap();

    AppState {
        client: reqwest::Client::new(),
        conn: PgPool::connect(&format!("postgres://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}")).await.unwrap()
    }
}

#[allow(unused)]
pub async fn get_app() -> impl Service<Request, Response = ServiceResponse, Error = Error> {
    test::init_service(
        App::new()
            .app_data(web::Data::new(get_app_data().await))
            .service(
                web::scope("/v1")
                    .service(
                        web::resource("/msg")
                            .route(web::get().to(get_message))
                            .route(web::post().to(create_message))
                    )
                    .service(
                        web::resource("/profile")
                            .route(web::get().to(get_profile))
                            .route(web::post().to(create_profile))
                    )
            )
    ).await
}