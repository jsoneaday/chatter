mod common {
    pub mod app_state;
}
mod routes {
    pub mod message_route;
}

use actix_web::{ web, App, HttpServer, Responder };
use std::error::Error;
use crate::common::app_state::AppState;
use crate::routes::message_route::{create_message, get_message};
use std::env;
use dotenv::dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port = env::var("PORT").unwrap().parse().unwrap();
    let host = env::var("HOST").unwrap();
    let postgres_host = env::var("POSTGRES_HOST").unwrap();
    let postgres_port = env::var("POSTGRES_PORT").unwrap().parse::<u16>().unwrap();
    let postgres_password = env::var("POSTGRES_PASSWORD").unwrap();
    let postgres_user = env::var("POSTGRES_USER").unwrap();
    let postgres_db = env::var("POSTGRES_DB").unwrap();

    let postgres_url = format!("postgres://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}");
    
    let conn = sqlx::postgres::PgPool::connect(&postgres_url).await.unwrap();
    let migrate = sqlx::migrate!("./migrations").run(&conn).await;
    match migrate {
        Ok(()) => println!("migrate success"),
        Err(e) => println!("migrate error: {:?}", e)
    };
    
    let result = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(
                AppState{
                    client: reqwest::Client::new(),
                    conn: conn.clone()
                }
            ))
            .route("/", web::get().to(get_root))
            .service(
                web::scope("/v1")
                    .service(
                        web::resource("/msg")
                            .route(web::get().to(get_message))
                            .route(web::post().to(create_message))
                    )
            )
    })
    .bind((host, port))?
    .run()
    .await;

    result
}

#[allow(unused)]
pub async fn get_root() -> Result<impl Responder, Box<dyn Error>> {
    Ok("Hello World!!!")
}