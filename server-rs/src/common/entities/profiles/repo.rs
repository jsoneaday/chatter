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

    pub async fn follow_user_inner(conn: &Pool<Postgres>, follower_id: i64, following_id: i64) -> Result<i64, sqlx::Error> {
        let id_result = sqlx::query_as::<_, EntityId>("insert into follow (follower_id, following_id) values ($1, $2) returning id")
            .bind(follower_id)
            .bind(following_id)
            .fetch_one(conn)
            .await;

        match id_result {
            Ok(row) => Ok(row.id),
            Err(e) => Err(e)
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
impl InsertProfileFn for DbRepo {
    async fn insert_profile(&self, conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
        private_members::insert_profile_inner(conn, params).await
    }
}

#[async_trait]
pub trait QueryProfileFn {
    async fn query_profile(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error>;
}

#[async_trait]
impl QueryProfileFn for DbRepo {
    async fn query_profile(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error> {
        private_members::query_profile_inner(conn, id).await
    }
}

#[async_trait]
pub trait FollowUserFn {
    async fn follow_user(&self, conn: &Pool<Postgres>, follower_id: i64, following_id: i64) -> Result<i64, sqlx::Error>;
}

#[async_trait]
impl FollowUserFn for DbRepo {
    async fn follow_user(&self, conn: &Pool<Postgres>, follower_id: i64, following_id: i64) -> Result<i64, sqlx::Error>  {
        private_members::follow_user_inner(conn, follower_id, following_id).await
    }
}

#[cfg(test)]
mod tests {
    use crate::common_tests::actix_fixture::get_conn_pool;
    use super::*;
    use lazy_static::lazy_static;
    use std::sync::{Arc, RwLock};

    #[derive(Clone)]
    #[allow(unused)]
    struct Fixtures {
        profiles: Vec<ProfileQueryResult>,
        conn: Pool<Postgres>
    }

    lazy_static! {
        static ref FIXTURES: Arc<RwLock<Option<Fixtures>>> = Arc::new(RwLock::new(None));
    }

    async fn setup(conn: Pool<Postgres>) -> Fixtures {
        let mut profiles = Vec::new();
        let db_repo = DbRepo;

        for l in ["a", "b", "c"] {
            let profile_id = db_repo.insert_profile(&conn, ProfileCreate { 
                user_name: format!("user_{}", l), 
                full_name: format!("User {}", l.to_string().to_uppercase()), 
                description: "Profile's description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            }).await.unwrap();
            
            profiles.push(db_repo.query_profile(&conn, profile_id).await.unwrap().unwrap());
        }

        Fixtures {
            profiles,
            conn
        }
    }

    async fn setup_fixtures() {
        let fixtures = Arc::clone(&FIXTURES);
        let mut fx = fixtures.write().unwrap();
        match fx.clone() {
            Some(_) => (),
            None => {
                let conn = get_conn_pool().await;

                *fx = Some(setup(conn).await);
            }
        }
    }

    mod test_mod_insert_profile {
        use super::*;

        struct InsertProfileDbRepo;

        #[async_trait]
        impl InsertProfileFn for InsertProfileDbRepo {
            async fn insert_profile(&self, conn: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
                private_members::insert_profile_inner(conn, params).await
            }
        }

        #[tokio::test]
        async fn test_insert_profile() {
            setup_fixtures().await;
            let db_repo = InsertProfileDbRepo;
            let fixtures = Arc::clone(&FIXTURES).read().unwrap().clone().unwrap();

            let profile_id = db_repo.insert_profile(&fixtures.conn, ProfileCreate { 
                user_name: "user_a".to_string(), 
                full_name: "User A".to_string(), 
                description: "Profile's description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            }).await.unwrap();

            assert!(profile_id > 0);
        }
    }

    mod test_mod_query_profile {
        use super::*;

        struct QueryProfileDbRepo;

        #[async_trait]
        impl InsertProfileFn for QueryProfileDbRepo {
            async fn insert_profile(&self, _: &Pool<Postgres>, params: ProfileCreate) -> Result<i64, sqlx::Error> {
                Ok(Arc::clone(&FIXTURES).read().unwrap().clone().unwrap().profiles.into_iter().find(|p| {
                    p.user_name == params.user_name
                }).unwrap().id)
            }
        }

        #[async_trait]
        impl QueryProfileFn for QueryProfileDbRepo {
            async fn query_profile(&self, conn: &Pool<Postgres>, id: i64) -> Result<Option<ProfileQueryResult>, sqlx::Error> {
                private_members::query_profile_inner(conn, id).await
            }
        }

        #[tokio::test]
        async fn test_insert_profile_and_get_profile() {
            setup_fixtures().await;
            let db_repo = QueryProfileDbRepo;
            let fixtures = Arc::clone(&FIXTURES).read().unwrap().clone().unwrap();

            let profile_to_create = ProfileCreate { 
                user_name: "user_a".to_string(), 
                full_name: "User A".to_string(), 
                description: "Profile's description".to_string(), 
                region: Some("usa".to_string()), 
                main_url: Some("http://whatever.com".to_string()), 
                avatar: vec![] 
            };
            let profile_id = db_repo.insert_profile(&fixtures.conn, profile_to_create.clone()).await.unwrap();

            let profile = db_repo.query_profile(&fixtures.conn, profile_id).await.unwrap().unwrap();

            assert!(profile_id > 0);
            assert!(profile.id == profile_id);
            assert!(profile.user_name == profile_to_create.clone().user_name);
            assert!(profile.full_name == profile_to_create.clone().full_name);
            assert!(profile.description == profile_to_create.clone().description);
            assert!(profile.region == profile_to_create.clone().region);
            assert!(profile.main_url == profile_to_create.clone().main_url);
        }
    }
}