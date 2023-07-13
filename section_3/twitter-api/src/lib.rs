pub mod common {
    pub mod app_state;
    pub mod entities {
        pub mod messages {
            pub mod model;            
            pub mod repo;
        }
        pub mod profiles {
            pub mod model;
            pub mod repo;
        }
        pub mod circle_group {
            pub mod model;
            pub mod repo;
        }
        pub mod base;
    }
    pub mod fs {
        pub mod file_utils;
    }    
}
pub mod common_tests {
    pub mod actix_fixture;
}
pub mod routes {
    pub mod output_id;
    pub mod messages {
        pub mod model;
        pub mod model_create_msg;
        pub mod model_create_response_msg;
        pub mod message_route;
    }
    pub mod profiles {
        pub mod model;
        pub mod profile_route;
    }
    pub mod errors {
        pub mod error_utils;
    }
    pub mod utils {
        pub mod multipart;
    }
}

use std::env;
use common::entities::base::DbRepo;
use dotenv::dotenv;
use actix_web::{ web, App, HttpServer, Responder, middleware::Logger };
use log::info;
use routes::messages::message_route::{get_message, get_messages};
use routes::profiles::profile_route::{ create_profile, get_profile, get_profile_by_user, get_followers };
use std::error::Error;
use crate::common::app_state::AppState;
use crate::routes::messages::message_route::{ create_message, get_message_image, create_response_message, get_response_messages };

pub async fn run() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("debug"));
    
    dotenv().ok();
    let port = env::var("PORT").unwrap().parse().unwrap();
    let host = env::var("HOST").unwrap();
    let db_repo = DbRepo::init().await;
    let app_data = web::Data::new(AppState {
                    client: reqwest::Client::new(),
                    db_repo,
                });    
    //info!("RUST_BACKTRACE={}", std::env::var("RUST_BACKTRACE").unwrap());
    let result = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(app_data.clone())
            .route("/", web::get().to(get_root))
            .service(
                web::scope("/v1")
                    .service(web::resource("/msg/{id}").route(web::get().to(get_message::<DbRepo>)))
                    .service(web::resource("/msg").route(web::post().to(create_message::<DbRepo>)))
                    .service(web::resource("/msg_responses").route(web::post().to(get_response_messages::<DbRepo>)))
                    .service(web::resource("/msg_response").route(web::post().to(create_response_message::<DbRepo>)))
                    .service(web::resource("/msgs").route(web::post().to(get_messages::<DbRepo>)))
                    .service(web::resource("/msg_image/{id}").route(web::get().to(get_message_image::<DbRepo>)))
                    .service(web::resource("/profile/{id}").route(web::get().to(get_profile::<DbRepo>)))
                    .service(web::resource("/profile/username/{user_name}").route(web::get().to(get_profile_by_user::<DbRepo>)))
                    .service(web::resource("/profile").route(web::post().to(create_profile::<DbRepo>)))
                    .service(web::resource("/follow/{id}").route(web::get().to(get_followers::<DbRepo>)))                    
            )
    })
    .bind((host, port))?
    .run().await;

    result
}

#[allow(unused)]
pub async fn get_root() -> Result<impl Responder, Box<dyn Error>> {
    Ok("Hello World!!!")
}
