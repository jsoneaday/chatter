use crate::common::{app_state::AppState, entities::profile::{ProfileQuery, ProfileQueryResult}};
use actix_web::{web, web::{Query, Json}, Responder};

pub async fn get_profile(app_data: web::Data<AppState>, query: Query<ProfileQuery>) -> impl Responder {
    let profile_result = sqlx::query_as::<_, ProfileQueryResult>("")
        .bind(query.id)
        .fetch_one(&app_data.conn)
        .await;

    match profile_result {
        Ok(row) => Json(Some(row)),
        Err(e) => {
            println!("get_profile error: {:?}", e);
            Json::<Option<ProfileQueryResult>>(None)
        }
    }
}