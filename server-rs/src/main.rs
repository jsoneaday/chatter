use actix_web::{ web, App, HttpServer, Responder };
use std::error::Error;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let result = HttpServer::new(move || {
        App::new()
            .route("/", web::get().to(get_root))
            // .service(
            //     web::scope("/v1")
            //         .service(
            //             web::resource("/")
            //                 .route(web::get().to(get_root))
            //         )
            // )
    })
    .bind(("0.0.0.0", 4000))?
    .run()
    .await;

    result
}

#[allow(unused)]
pub async fn get_root() -> Result<impl Responder, Box<dyn Error>> {
    Ok("Hello World!!!")
}