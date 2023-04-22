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
    use crate::{common_test::actix_fixtures::get_app, common::entities::profile::ProfileResponder};

    use super::*;
    use actix_web::{
        test
    };

    #[actix_web::test]
    async fn test_create_profile_and_get_profile() {
        let app = get_app().await;
        const USER_NAME: &str = "tester";
        const FULL_NAME: &str = "John Donson";
        const DESCRIPTION: &str = "desc";
        const REGION: Option<&str> = Some("usa");
        const MAIN_URL: Option<&str> = Some("http://test.com");
        const AVATAR: Vec<u8> = Vec::new();

        let create_req = test::TestRequest::post().uri("/v1/profile").set_json(ProfileCreate {
            user_name: USER_NAME.to_string(),
            full_name: FULL_NAME.to_string(), 
            description: DESCRIPTION.to_string(), 
            region: Some(REGION.unwrap().to_string()),
            main_url: Some(MAIN_URL.unwrap().to_string()), 
            avatar: AVATAR
        }).to_request();
        let id = test::call_and_read_body_json::<_, _, i64>(&app, create_req).await;
        assert!(id > 0);

        let get_req = test::TestRequest::get().uri(&format!("/v1/profile?id={}", id)).to_request();
        let get_res = test::call_and_read_body_json::<_, _, Option<ProfileResponder>>(&app, get_req).await;
        let profile = get_res.unwrap();
        assert!(&profile.user_name.eq(USER_NAME));
        assert!(&profile.full_name.eq(FULL_NAME));
        assert!(&profile.description.eq(DESCRIPTION));
        assert!(&profile.region.unwrap() == REGION.unwrap());
        assert!(&profile.main_url.unwrap() == MAIN_URL.unwrap());
        assert!(*&profile.avatar.to_ascii_lowercase() == *&AVATAR.to_ascii_lowercase());
    }
}