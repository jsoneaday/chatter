mod common {
    pub mod app_state;
}
mod routes {
    pub mod message_route;
}

use actix_web::{ web, App, HttpServer, Responder };
use std::error::Error;
use crate::common::app_state::AppState;
use crate::routes::message_route::get_message;
use std::env;
use dotenv::dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port = env::var("PORT").unwrap().parse().unwrap();

    let result = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState{
                client: reqwest::Client::new()
            }))
            .route("/", web::get().to(get_root))
            .service(
                web::scope("/v1")
                    .service(
                        web::resource("/msg")
                            .route(web::get().to(get_message))
                    )
            )
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await;

    result
}



#[allow(unused)]
pub async fn get_root() -> Result<impl Responder, Box<dyn Error>> {
    Ok("Hello World!!!")
}