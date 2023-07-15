use actix_web::{web::{self, Json, Path}, HttpResponse};
use crate::{common::{app_state::AppState, entities::circle_group::repo::{InsertCircleMemberFn, DeleteCircleMemberFn, QueryCircleByOwnerFn, QueryCircleMembersFn}}, routes::{errors::error_utils::UserError, output_id::OutputId}};

use super::model::{CreateCircleMemberQuery, RemoveCircleMemberQuery, CircleQuery, CircleGroupMemberResponder, CircleGroupMemberResponders};

pub async fn create_circle_member<T: InsertCircleMemberFn>(app_data: web::Data<AppState<T>>, json: Json<CreateCircleMemberQuery>) -> Result<OutputId, UserError> {
    let create_member = app_data.db_repo.insert_circle_member(json.circle_owner_id, json.new_member_id).await;

    match create_member {
        Ok(id) => Ok(OutputId { id }),
        Err(e) => Err(e.into())
    }
}

pub async fn remove_circle_member<T: DeleteCircleMemberFn>(app_data: web::Data<AppState<T>>, json: Json<RemoveCircleMemberQuery>) -> HttpResponse {
    println!("start remove_circle_member {} {}", json.circle_group_id, json.member_id);
    let result = app_data.db_repo.delete_member(json.circle_group_id, json.member_id).await;

    match result {
        Ok(_) => HttpResponse::Ok().body(()),
        Err(e) => {
            println!("{}", e);
            HttpResponse::InternalServerError().body(())
        }
    }
}

pub async fn get_circle_by_owner<T: QueryCircleByOwnerFn>(app_data: web::Data<AppState<T>>, path: Path<CircleQuery>) -> Result<Option<OutputId>, UserError> {
    let result = app_data.db_repo.query_circle_by_owner(path.id).await;

    match result {
        Ok(id) => 
        if let Some(id) = id {
            Ok(Some(OutputId {id}))
        } else {
            Ok(None)
        },
        Err(e) => Err(e.into())
    }
}

pub async fn get_circle_members<T: QueryCircleMembersFn>(app_data: web::Data<AppState<T>>, path: Path<CircleQuery>) -> Result<CircleGroupMemberResponders, UserError> {
    let result = app_data.db_repo.query_circle_members(path.id).await;

    match result {
        Ok(members) => {
            let responders = members.iter().map(|member| CircleGroupMemberResponder {
                id: member.id,
                updated_at: member.updated_at,
                circle_group_id: member.circle_group_id,
                member_id: member.member_id,
                user_name: member.clone().user_name,
                full_name: member.clone().full_name,
                avatar: member.clone().avatar
            })
            .collect::<Vec<CircleGroupMemberResponder>>();
            println!("circle_members {:?}", responders);
            Ok(CircleGroupMemberResponders(responders))
        },
        Err(e) => {
            println!("circle_members err {:?}", e);
            Err(e.into())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use async_trait::async_trait;
    use crate::common::entities::circle_group::repo::{DeleteCircleMemberFn, InsertCircleMemberFn};
    use crate::common_tests::actix_fixture::get_app_data;      
    use chrono::Utc;
    use fake::faker::internet::en::Username;
    use fake::Fake;
    use crate::common::entities::circle_group::model::CircleGroupMemberWithProfileQueryResult;

    mod test_mod_route_create_circle_member {
        use crate::common_tests::actix_fixture::get_app_data;
        use super::*;

        struct TestDbRepo;
        const ID: i64 = 1;

        #[async_trait]
        impl InsertCircleMemberFn for TestDbRepo {
            async fn insert_circle_member(&self, _: i64, _: i64) -> Result<i64, sqlx::Error> {
                Ok(ID)
            }
        }

        #[tokio::test]
        async fn test_route_create_circle_member() {
            let app_data = get_app_data(TestDbRepo).await;
            let result = create_circle_member(app_data, Json(CreateCircleMemberQuery { circle_owner_id: 1, new_member_id: 2 })).await;

            match result {
                Ok(entity) => assert!(entity.id == ID),
                Err(e) => panic!("Error failed to create new circle member {}", e)
            }        
        }
    }

    mod test_mod_remove_circle_member {
        use super::*;

        struct TestDbRepo;

        #[async_trait]
        impl DeleteCircleMemberFn for TestDbRepo {
            async fn delete_member(&self, _: i64, _: i64) -> Result<(), sqlx::Error> {
                Ok(())
            }
        }

        #[tokio::test]
        async fn test_remove_circle_member() {
            let app = get_app_data(TestDbRepo).await;
            let result = app.db_repo.delete_member(1, 2).await;
            match result {
                Ok(()) => (),
                Err(e) => panic!("test for remove member failed {}", e)
            };
        }
    }

    mod test_mod_get_circle_by_owner {      
        use super::*;

        struct TestDbRepo;
        const ID: i64 = 1;

        #[async_trait]
        impl QueryCircleByOwnerFn for TestDbRepo {
            async fn query_circle_by_owner(
                &self,
                _: i64
            ) -> Result<Option<i64>, sqlx::Error> {
                Ok(Some(ID))
            }
        }

        #[tokio::test]
        async fn test_get_circle_by_owner() {
            let app = get_app_data(TestDbRepo).await;
            let result = app.db_repo.query_circle_by_owner(2).await;
            match result {
                Ok(id) => assert!(ID == id.unwrap()),
                Err(e) => panic!("test for query_circle_by_owner failed {}", e)
            };
        }
    }

    mod test_mod_get_circle_members {
        use fake::faker::name::en::{FirstName, LastName};

        use super::*;

        struct TestDbRepo;
        const ID: i64 = 1;

        #[async_trait]
        impl QueryCircleMembersFn for TestDbRepo {
            async fn query_circle_members(
                &self,
                _: i64
            ) -> Result<Vec<CircleGroupMemberWithProfileQueryResult>, sqlx::Error> {
                Ok(vec![CircleGroupMemberWithProfileQueryResult {
                    id: ID,
                    updated_at: Utc::now(),
                    circle_group_id: 2,
                    member_id: 2,
                    user_name: Username().fake::<String>(),
                    full_name: format!("{} {}", FirstName().fake::<String>(), LastName().fake::<String>()),
                    avatar: None
                }])
            }
        }

        #[tokio::test]
        async fn test_get_circle_members() {
            let app = get_app_data(TestDbRepo).await;
            let result = app.db_repo.query_circle_members(2).await;
            match result {
                Ok(members) => assert!(members.len() > 0),
                Err(e) => panic!("test for query_circle_by_owner failed {}", e)
            };
        }
    }
}