use crate::common::{
    app_state::AppState, 
    entities::{
        profiles::{
            model::{ProfileQuery, ProfileQueryResult, ProfileCreate}, 
            repo::{insert_profile, query_profile}
        }
    }
};
use actix_web::{web, web::{Query, Json}, Responder};
use chrono::{DateTime, Utc};
use std::error::Error;
use serde::{Deserialize, Serialize};

#[allow(unused)]
pub async fn create_profile(app_data: web::Data<AppState>, params: Json<ProfileCreate>) -> Result<impl Responder, Box<dyn Error>> {
    let result = insert_profile(&app_data.conn, ProfileCreate { 
        user_name: params.user_name.clone(), 
        full_name: params.full_name.clone(), 
        description: params.description.clone(), 
        region: params.region.clone(), 
        main_url: params.main_url.clone(), 
        avatar: params.avatar.clone()
    }).await;

    match result {
        Ok(id) => Ok(Json(id)),
        Err(e) => Err(Box::new(e))
    }
}

pub async fn get_profile(app_data: web::Data<AppState>, query: Query<ProfileQuery>) -> Result<impl Responder, Box<dyn Error>> {
    let result = query_profile(&app_data.conn, query.id).await;

    match result {
        Ok(profile) => Ok(Json(convert(profile))),
        Err(e) => Err(Box::new(e))
    }
}

fn convert(profile: Option<ProfileQueryResult>) -> Option<ProfileResponder> {
    match profile {
        Some(item) => Some(ProfileResponder { 
            id: item.id, 
            created_at: item.created_at, 
            user_name: item.user_name, 
            full_name: item.full_name, 
            description: item.description, 
            region: item.region, 
            main_url: item.main_url, 
            avatar: item.avatar
        }),
        None => None
    }
}

#[derive(Deserialize, Serialize)]
pub struct ProfileResponder {
    pub id: i64,
    pub created_at: DateTime<Utc>,
    pub user_name: String,
    pub full_name: String,
    pub description: String,
    pub region: Option<String>,
    pub main_url: Option<String>,
    pub avatar: Vec<u8>
}


#[cfg(test)]
mod tests {
    
}