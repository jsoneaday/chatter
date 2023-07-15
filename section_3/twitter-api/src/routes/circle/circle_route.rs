use actix_web::web::{self, Json, Path};
use crate::{common::{app_state::AppState, entities::circle_group::repo::{InsertCircleMemberFn, DeleteCircleMemberFn, QueryCircleByOwnerFn, QueryCircleMembersFn}}, routes::{errors::error_utils::UserError, output_id::OutputId}};

use super::model::{CreateCircleMemberQuery, RemoveCircleMemberQuery, CircleQuery, CircleGroupMemberResponder, CircleGroupMemberResponders};

pub async fn create_circle_member<T: InsertCircleMemberFn>(app_data: web::Data<AppState<T>>, json: Json<CreateCircleMemberQuery>) -> Result<OutputId, UserError> {
    let create_member = app_data.db_repo.insert_circle_member(json.circle_owner_id, json.new_member_id).await;

    match create_member {
        Ok(id) => Ok(OutputId { id }),
        Err(e) => Err(e.into())
    }
}

pub async fn remove_circle_member<T: DeleteCircleMemberFn>(app_data: web::Data<AppState<T>>, json: Json<RemoveCircleMemberQuery>) -> Result<String, UserError> {
    println!("start remove_circle_member {} {}", json.circle_group_id, json.member_id);
    let result = app_data.db_repo.delete_member(json.circle_group_id, json.member_id).await;

    match result {
        Ok(_) => Ok("".to_string()),
        Err(e) => {
            println!("{}", e);
            Err(e.into())
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