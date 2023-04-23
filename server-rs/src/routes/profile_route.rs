use crate::common::{app_state::AppState, entities::{profiles::model::{ProfileQuery, ProfileQueryResult, ProfileCreate}, utils::EntityId}};
use actix_web::{web, web::{Query, Json}, Responder};

#[allow(unused)]
pub async fn create_profile(app_data: web::Data<AppState>, params: Json<ProfileCreate>) -> impl Responder {
    let result = sqlx::query_as::<_, EntityId>(
        r"
            insert into Profile 
                (user_name, full_name, description, region, main_url, avatar) 
                values 
                ($1, $2, $3, $4, $5, $6)
            returning id"
        )
        .bind(&params.user_name)
        .bind(&params.full_name)
        .bind(&params.description)
        .bind(&params.region)
        .bind(&params.main_url)
        .bind(&params.avatar)
        .fetch_one(&app_data.conn)
        .await;

        match result {
            Ok(r) => Json(r.id),
            Err(e) => {
                println!("create_profile error: {}", e);
                Json(0)
            },
        }
}

pub async fn get_profile(app_data: web::Data<AppState>, query: Query<ProfileQuery>) -> impl Responder {
    let profile_result = sqlx::query_as::<_, ProfileQueryResult>("select * from profile where id = $1")
        .bind(query.id)
        .fetch_one(&app_data.conn)
        .await;

    match profile_result {
        Ok(row) => {
            Json(Some(row))
        },
        Err(e) => {
            println!("get_profile error: {:?}", e);
            Json::<Option<ProfileQueryResult>>(None)
        }
    }
}

#[cfg(test)]
mod tests {
    
}