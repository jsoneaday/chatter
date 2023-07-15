use async_trait::async_trait;
use mockall::automock;
use sqlx::{ Pool, Postgres };
use crate::common::entities::base::{ EntityId, DbRepo, DbConnGetter };
use super::model::{ CircleGroupWithProfileQueryResult, CircleGroupMemberWithProfileQueryResult };

mod private_members {
    use super::*;

    pub async fn insert_circle_inner(
        conn: &Pool<Postgres>,
        circle_owner_id: i64
    ) -> Result<i64, sqlx::Error> {
        let insert_result = sqlx
            ::query_as::<_, EntityId>(
                "insert into circle_group (owner_id) values ($1) returning id"
            )
            .bind(circle_owner_id)
            .fetch_one(conn).await;

        match insert_result {
            Ok(row) => Ok(row.id),
            Err(e) => Err(e),
        }
    }

    pub async fn insert_circle_member_inner(
        conn: &Pool<Postgres>,
        circle_owner_id: i64,
        new_member_id: i64
    ) -> Result<i64, sqlx::Error> {
        let query_circle_group_result = sqlx::query_as::<_, EntityId>("select id from circle_group where owner_id = $1")
            .bind(circle_owner_id)
            .fetch_one(conn)
            .await;
        
        #[allow(unused)] let mut circle_group_id: i64 = 0;
        match query_circle_group_result {
            Ok(entity) => circle_group_id = entity.id,
            Err(e) => match e {
                sqlx::Error::RowNotFound => {
                    let insert_result = sqlx
                        ::query_as::<_, EntityId>(
                            "insert into circle_group (owner_id) values ($1) returning id"
                        )
                        .bind(circle_owner_id)
                        .fetch_one(conn).await;

                    match insert_result {
                        Ok(entity) => circle_group_id = entity.id,
                        Err(e) => return Err(e),
                    };
                },
                _ => {
                    return Err(e);
                }
            }
        };

        let insert_circle_member_result = sqlx
            ::query_as::<_, EntityId>(
                "insert into circle_group_member (circle_group_id, member_id) values ($1, $2) returning id"
            )
            .bind(circle_group_id)
            .bind(new_member_id)
            .fetch_one(conn).await;

        match insert_circle_member_result {
            Ok(row) => Ok(row.id),
            Err(e) => Err(e),
        }
    }

    pub async fn query_circle_inner(
        conn: &Pool<Postgres>,
        id: i64
    ) -> Result<Option<CircleGroupWithProfileQueryResult>, sqlx::Error> {
        sqlx
            ::query_as::<_, CircleGroupWithProfileQueryResult>(
                r"
                select c.id, c.updated_at, c.owner_id, p.user_name, p.full_name, p.avatar
                from circle_group c
                    join profile p on c.owner_id = p.id
                where c.id = $1
            "
            )
            .bind(id)
            .fetch_optional(conn).await
    }

    pub async fn query_circle_by_owner_inner(
        conn: &Pool<Postgres>,
        owner_id: i64
    ) -> Result<Option<i64>, sqlx::Error> {
        let result = sqlx
            ::query_as::<_, EntityId>(
                r"
                select id
                from circle_group 
                where owner_id = $1
            "
            )
            .bind(owner_id)
            .fetch_optional(conn)
            .await;
        match result {
            Ok(entity) => 
            if let Some(entity) = entity {
                Ok(Some(entity.id)) 
            } else {
                Ok(None)
            },
            Err(e) => Err(e)
        }
    }

    pub async fn query_circle_members_inner(
        conn: &Pool<Postgres>,
        circle_group_id: i64
    ) -> Result<Vec<CircleGroupMemberWithProfileQueryResult>, sqlx::Error> {
        sqlx
            ::query_as::<_, CircleGroupMemberWithProfileQueryResult>(
                r"
                select c.id, c.updated_at, c.circle_group_id, p.id as member_id, p.user_name, p.full_name, p.avatar
                from circle_group_member c
                    join profile p on c.member_id = p.id
                where c.circle_group_id = $1
                "
            )
            .bind(circle_group_id)
            .fetch_all(conn).await
    }

    pub async fn delete_member_inner(conn: &Pool<Postgres>, circle_group_id: i64, member_id: i64) -> Result<(), sqlx::Error> {
        let result = sqlx::query::<_>("delete from circle_group_member where circle_group_id = $1 and member_id = $2")
            .bind(circle_group_id)
            .bind(member_id)
            .execute(conn)
            .await;

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(e)
        }
    }
}

#[automock]
#[async_trait]
pub trait InsertCircleFn {
    async fn insert_circle(
        &self,
        circle_owner_id: i64
    ) -> Result<i64, sqlx::Error>;
}

#[async_trait]
impl InsertCircleFn for DbRepo {
    async fn insert_circle(
        &self,
        circle_owner_id: i64
    ) -> Result<i64, sqlx::Error> {
        private_members::insert_circle_inner(self.get_conn(), circle_owner_id).await
    }
}

#[automock]
#[async_trait]
pub trait InsertCircleMemberFn {
    async fn insert_circle_member(
        &self,
        circle_owner_id: i64,
        new_member_id: i64
    ) -> Result<i64, sqlx::Error>;
}

#[async_trait]
impl InsertCircleMemberFn for DbRepo {
    async fn insert_circle_member(
        &self,
        circle_owner_id: i64,
        new_member_id: i64
    ) -> Result<i64, sqlx::Error> {
        private_members::insert_circle_member_inner(self.get_conn(), circle_owner_id, new_member_id).await
    }
}

#[automock]
#[async_trait]
pub trait QueryCircleFn {
    async fn query_circle(
        &self,
        id: i64
    ) -> Result<Option<CircleGroupWithProfileQueryResult>, sqlx::Error>;
}

#[async_trait]
impl QueryCircleFn for DbRepo {
    async fn query_circle(
        &self,
        id: i64
    ) -> Result<Option<CircleGroupWithProfileQueryResult>, sqlx::Error> {
        private_members::query_circle_inner(self.get_conn(), id).await
    }
}

#[automock]
#[async_trait]
pub trait QueryCircleByOwnerFn {
    async fn query_circle_by_owner(
        &self,
        owner_id: i64
    ) -> Result<Option<i64>, sqlx::Error>;
}

#[async_trait]
impl QueryCircleByOwnerFn for DbRepo {
    async fn query_circle_by_owner(
        &self,
        owner_id: i64
    ) -> Result<Option<i64>, sqlx::Error> {
        private_members::query_circle_by_owner_inner(self.get_conn(), owner_id).await
    }
}

#[automock]
#[async_trait]
pub trait QueryCircleMembersFn {
    async fn query_circle_members(
        &self,
        circle_group_id: i64
    ) -> Result<Vec<CircleGroupMemberWithProfileQueryResult>, sqlx::Error>;
}

#[async_trait]
impl QueryCircleMembersFn for DbRepo {
    async fn query_circle_members(
        &self,
        circle_group_id: i64
    ) -> Result<Vec<CircleGroupMemberWithProfileQueryResult>, sqlx::Error> {
        private_members::query_circle_members_inner(self.get_conn(), circle_group_id).await
    }
}

#[automock]
#[async_trait]
pub trait DeleteCircleMemberFn {
    async fn delete_member(&self, circle_group_id: i64, member_id: i64) -> Result<(), sqlx::Error>;
}

#[async_trait]
impl DeleteCircleMemberFn for DbRepo {
    async fn delete_member(&self, circle_group_id: i64, member_id: i64) -> Result<(), sqlx::Error> {
        private_members::delete_member_inner(self.get_conn(), circle_group_id, member_id).await
    }
}

#[cfg(test)]
mod tests {
    use crate::common::entities::circle_group::model::{
        CircleGroupMemberWithProfileQueryResult,
        CircleGroupWithProfileQueryResult,
    };
    use crate::common::entities::profiles::{
        repo::{ InsertProfileFn, QueryProfileFn },
        model::ProfileCreate,
    };
    use super::*;
    use super::InsertCircleFn;
    use crate::common::entities::profiles::model::ProfileQueryResult;
    use std::sync::{ Arc, RwLock };
    use lazy_static::lazy_static;

    #[derive(Clone)]
    #[allow(unused)]
    struct Fixtures {
        pub follower: ProfileQueryResult,
        pub following: ProfileQueryResult,
        /// randomly select on person being followed group
        pub circle_group: CircleGroupWithProfileQueryResult,
        pub circle_group_members: Vec<CircleGroupMemberWithProfileQueryResult>,
        pub db_repo: DbRepo,
    }

    const PREFIX: &str = "Test circle";

    async fn setup_data(db_repo: DbRepo) -> Fixtures {
        let follower_result_id = db_repo.insert_profile(ProfileCreate {
            user_name: "follower".to_string(),
            full_name: "Follower Guy".to_string(),
            description: format!("{} Follower's description", PREFIX),
            region: Some("usa".to_string()),
            main_url: Some("http://whatever.com".to_string()),
            avatar: Some(vec![]),
        }).await;
        let follower = (
            match follower_result_id {
                Ok(id) => {
                    let profile_result = db_repo.query_profile(id).await;
                    match profile_result {
                        Ok(profile) => profile,
                        Err(_) => None,
                    }
                }
                Err(_) => None,
            }
        ).unwrap();

        let following_result_id = db_repo.insert_profile(ProfileCreate {
            user_name: "following".to_string(),
            full_name: "Following Guy".to_string(),
            description: format!("{} Following's description", PREFIX),
            region: Some("usa".to_string()),
            main_url: Some("http://whatever.com".to_string()),
            avatar: Some(vec![]),
        }).await;

        let following = (
            match following_result_id {
                Ok(id) => {
                    let profile_result = db_repo.query_profile(id).await;
                    match profile_result {
                        Ok(profile) => profile,
                        Err(_) => None,
                    }
                }
                Err(_) => None,
            }
        ).unwrap();
      
        let currently_following = following.clone();
        let insert_circle_result_id = db_repo.insert_circle(currently_following.id).await.unwrap();
        let circle_group = db_repo
            .query_circle(insert_circle_result_id).await
            .unwrap()
            .unwrap();            
        _ = db_repo
            .insert_circle_member(circle_group.owner_id, follower.id).await
            .unwrap();
        let circle_group_members = db_repo
            .query_circle_members(circle_group.id).await
            .unwrap();

        Fixtures {
            follower,
            following,
            circle_group,
            circle_group_members,
            db_repo
        }
    }

    lazy_static! {
        static ref FIXTURES: Arc<RwLock<Option<Fixtures>>> = Arc::new(RwLock::new(None));
    }

    async fn setup_fixtures() {
        let fixtures = Arc::clone(&FIXTURES);
        let mut writeable_fixtures = fixtures
            .write()
            .expect("Failed to get write lock on CircleRepo");

        match writeable_fixtures.clone() {
            Some(_) => (),
            None => {
                println!("log: start circle setup_fixtures()");
                let db_repo = DbRepo::init().await;

                *writeable_fixtures = Some(setup_data(db_repo).await);
                println!("log: end circle setup_fixtures()");
            }
        };
    }

    fn get_fixtures() -> Fixtures {
        Arc::clone(&FIXTURES).read().unwrap().clone().unwrap()
    }

    lazy_static! {
        static ref RT: tokio::runtime::Runtime = {
            let rt = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();

            rt.block_on(async {
                setup_fixtures().await;
            });

            rt
        };
    }

    mod test_mod_insert_new_circle_group {
        use crate::common::entities::profiles::repo::MockInsertProfileFn;
        use super::*;

        async fn test_insert_new_circle_group_body() {
            let fixtures = get_fixtures();
            let following = fixtures.follower.clone();
            let following_id = following.clone().id;
            let mut mock_insert_profile = MockInsertProfileFn::new();
            mock_insert_profile.expect_insert_profile().returning(move |_| { Ok(following_id) });
            
            let profile_id = mock_insert_profile
                .insert_profile(ProfileCreate {
                    user_name: "follower".to_string(),
                    full_name: "Follower Guy".to_string(),
                    description: "Follower's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();

            let circle_id = fixtures.db_repo.insert_circle(profile_id).await.unwrap();

            assert!(circle_id > 0);
        }

        #[test]
        fn test_insert_new_circle_group() {
            RT.block_on(test_insert_new_circle_group_body());
        }
    }

    mod test_mod_insert_new_circle_member {
        use crate::common::entities::profiles::repo::MockInsertProfileFn;
        use super::*;

        fn get_insert_profile_mock() -> MockInsertProfileFn {
            let mut mock_insert_profile = MockInsertProfileFn::new();
            mock_insert_profile.expect_insert_profile().returning(move |profile_create| {
                let fixtures = get_fixtures();
                if profile_create.user_name == "following" {
                    Ok(fixtures.following.id)
                } else {
                    Ok(fixtures.follower.id)
                }
            });
            mock_insert_profile
        }

        fn get_insert_circle_mock() -> MockInsertCircleFn {
            let mut mock_insert_circle = MockInsertCircleFn::new();
            mock_insert_circle
                .expect_insert_circle()
                .returning(|_| { Ok(get_fixtures().circle_group.id) });
            mock_insert_circle
        }

        fn get_insert_circle_member_mock() -> MockInsertCircleMemberFn {
            let mut mock_insert_circle_member = MockInsertCircleMemberFn::new();
            mock_insert_circle_member
                .expect_insert_circle_member()
                .returning(|_, _| { Ok(get_fixtures().circle_group_members.get(0).unwrap().id) });
            mock_insert_circle_member
        }

        async fn test_insert_new_circle_group_member_body() {
            let fixtures = get_fixtures();

            let mock_insert_profile = get_insert_profile_mock();
            let mock_insert_circle = get_insert_circle_mock();

            let circle_owner_id = mock_insert_profile
                .insert_profile(ProfileCreate {
                    user_name: "following".to_string(),
                    full_name: "Following Guy".to_string(),
                    description: "Following's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();
            _ = mock_insert_circle
                .insert_circle(circle_owner_id).await
                .unwrap();

            let circle_member_id = mock_insert_profile
                .insert_profile(ProfileCreate {
                    user_name: "follower".to_string(),
                    full_name: "Follower Guy".to_string(),
                    description: "follower's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();

            let circle_group_member_id = fixtures.db_repo
                .insert_circle_member(circle_owner_id, circle_member_id).await
                .unwrap();

            assert!(circle_group_member_id > 0);
        }

        #[test]
        fn test_insert_new_circle_group_member() {
            RT.block_on(test_insert_new_circle_group_member_body());
        }

        async fn test_insert_new_circle_group_member_and_verify_fields_body() {
            let fixtures = get_fixtures();

            let mock_insert_profile = get_insert_profile_mock();
            let mock_insert_circle = get_insert_circle_mock();
            let mock_insert_circle_member = get_insert_circle_member_mock();

            let member_id = mock_insert_profile
                .insert_profile(ProfileCreate {
                    user_name: "follower".to_string(),
                    full_name: "Follower Guy".to_string(),
                    description: "Follower's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();            
            let owner_id = mock_insert_profile
                .insert_profile(ProfileCreate {
                    user_name: "following".to_string(),
                    full_name: "following Guy".to_string(),
                    description: "following's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();

            let circle_group_id = mock_insert_circle
                .insert_circle(owner_id).await
                .unwrap();
            _ = mock_insert_circle_member
                .insert_circle_member(owner_id, member_id).await
                .unwrap();

            let circle_members = fixtures.db_repo
                .query_circle_members(circle_group_id).await
                .unwrap();

            let first_circle_member = circle_members.get(0).unwrap();
            assert!(first_circle_member.id > 0);
            assert!(first_circle_member.circle_group_id == circle_group_id);
            assert!(first_circle_member.member_id == member_id);
        }

        #[test]
        fn test_insert_new_circle_group_member_and_verify_fields() {
            RT.block_on(test_insert_new_circle_group_member_and_verify_fields_body());
        }
    }

    mod test_mod_delete_member {
        use crate::common::entities::profiles::repo::MockInsertProfileFn;
        use super::*;

        async fn test_delete_member_body() {
            let fixtures = get_fixtures();
            let owner = fixtures.following.clone();
            let mut mock_insert_owner = MockInsertProfileFn::new();
            mock_insert_owner.expect_insert_profile().returning(move |_| { Ok(owner.id) });            
            let owner_id = mock_insert_owner
                .insert_profile(ProfileCreate {
                    user_name: "follower".to_string(),
                    full_name: "Follower Guy".to_string(),
                    description: "Follower's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();

            let member = fixtures.follower.clone();
            let mut mock_insert_member = MockInsertProfileFn::new();
            mock_insert_member.expect_insert_profile().returning(move |_| { Ok(member.id) });            
            let member_id = mock_insert_member
                .insert_profile(ProfileCreate {
                    user_name: "follower".to_string(),
                    full_name: "Follower Guy".to_string(),
                    description: "Follower's description".to_string(),
                    region: Some("usa".to_string()),
                    main_url: Some("http://whatever.com".to_string()),
                    avatar: Some(vec![]),
                }).await
                .unwrap();

            let circle_id = fixtures.db_repo.insert_circle_member(owner_id, member_id).await.unwrap();

            assert!(circle_id > 0);
        }

        #[test]
        fn test_delete_member() {
            RT.block_on(test_delete_member_body());
        }
    }
}
