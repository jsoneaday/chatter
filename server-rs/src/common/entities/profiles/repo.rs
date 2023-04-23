use crate::common::entities::utils::EntityId;
use super::model::{ProfileCreate, ProfileQueryResult};
use sqlx::{Pool, Postgres};

pub async fn insert_profile(conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
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
        .fetch_one(conn)
        .await;

    match result {
        Ok(r) => Ok(r.id),
        Err(e) => {
            println!("create_profile error: {}", e);
            Err(e)
        },
    }
}

pub async fn query_profile(conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error> {
    let profile_result = sqlx::query_as::<_, ProfileQueryResult>("select * from profile where id = $1")
    .bind(id)
    .fetch_one(conn)
    .await;

    match profile_result {
        Ok(row) => {
            Ok(Some(row))
        },
        Err(e) => {
            println!("get_profile error: {:?}", e);
            Err(e)
        }
    }
}