use crate::common::entities::base::{EntityId, DbRepo};
use super::model::{ProfileCreate, ProfileQueryResult};
use async_trait::async_trait;
use sqlx::{Pool, Postgres};

mod private_members {
    use super::*;

    pub async fn insert_profile_inner(conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
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

    pub async fn query_profile_inner(conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error> {
        sqlx::query_as::<_, ProfileQueryResult>("select * from profile where id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await
    }
}

#[async_trait]
pub trait InsertProfileFn {
    async fn insert_profile(&self, conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error>;    
}

#[async_trait]
pub trait QueryProfileFn {
    async fn query_profile(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error>;
}

#[async_trait]
impl InsertProfileFn for DbRepo {
    async fn insert_profile(&self, conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
        private_members::insert_profile_inner(conn, params).await
    }
}

#[async_trait]
impl QueryProfileFn for DbRepo {
    async fn query_profile(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error> {
        private_members::query_profile_inner(conn, id).await
    }
}
