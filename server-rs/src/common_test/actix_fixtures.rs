use crate::{common::app_state::AppState, routes::{message_route::{get_message, create_message}, profile_route::create_profile}};
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
pub struct ActixFixture {
    pub app_data: Option<AppState>
}

#[allow(unused)]
impl ActixFixture {
    pub async fn init(&mut self) {
        dotenv().ok();
        let postgres_host = env::var("POSTGRES_HOST").unwrap();
        let postgres_port = env::var("POSTGRES_PORT").unwrap().parse::<u16>().unwrap();
        let postgres_password = env::var("POSTGRES_PASSWORD").unwrap();
        let postgres_user = env::var("POSTGRES_USER").unwrap();
        let postgres_db = env::var("POSTGRES_DB").unwrap();

        self.app_data = Some(AppState {
            client: reqwest::Client::new(),
            conn: PgPool::connect(&format!("postgres://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}")).await.unwrap()
        });
    }
}

#[allow(unused)]
pub async fn get_app() -> impl Service<Request, Response = ServiceResponse, Error = Error> {
    dotenv().ok();
    let postgres_host = env::var("POSTGRES_HOST").unwrap();
    let postgres_port = env::var("POSTGRES_PORT").unwrap().parse::<u16>().unwrap();
    let postgres_password = env::var("POSTGRES_PASSWORD").unwrap();
    let postgres_user = env::var("POSTGRES_USER").unwrap();
    let postgres_db = env::var("POSTGRES_DB").unwrap();

    let postgres_url = format!("postgres://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}");        
    let conn = sqlx::postgres::PgPool::connect(&postgres_url).await.unwrap();

    test::init_service(
        App::new()
            .app_data(web::Data::new(AppState{
                client: reqwest::Client::new(),
                conn: conn.clone()
            }))
            .service(
                web::scope("/v1")
                    .service(
                        web::resource("/msg")
                            .route(web::get().to(get_message))
                            .route(web::post().to(create_message))
                    )
                    .service(
                        web::resource("/profile")
                            .route(web::post().to(create_profile))
                    )
            )
    ).await
}