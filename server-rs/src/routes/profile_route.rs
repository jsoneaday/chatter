use crate::common::{app_state::AppState, entities::{profile::{ProfileQuery, ProfileQueryResult, ProfileCreate}, utils::EntityId}};
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
    let profile_result = sqlx::query_as::<_, ProfileQueryResult>("")
        .bind(query.id)
        .fetch_one(&app_data.conn)
        .await;

    match profile_result {
        Ok(row) => {
            println!("get_profile result: {:?}", row.user_name);
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
    use crate::common_test::actix_fixtures::get_app;

    use super::*;
    use actix_web::{
        test
    };

    #[actix_web::test]
    async fn test_create_profile() {
        let app = get_app().await;

        let create_req = test::TestRequest::post().uri("/v1/profile").set_json(ProfileCreate {
            user_name: "user_name".to_string(),
            full_name: "full_name".to_string(),
            description: "description".to_string(),
            region: Some("region".to_string()),
            main_url: Some("main_url".to_string()),
            avatar: Vec::new()
        }).to_request();
        let id = test::call_and_read_body_json::<_, _, i64>(&app, create_req).await;
        println!("create_profile id {:?}", id);
        assert!(id > 0)
    }
}