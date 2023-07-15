use actix_web::web::{self, Json};
use crate::{common::{app_state::AppState, entities::circle_group::repo::{InsertCircleMemberFn, DeleteCircleMemberFn}}, routes::{errors::error_utils::UserError, output_id::OutputId}};

use super::model::{CreateCircleMemberQuery, RemoveCircleMemberQuery};

pub async fn create_circle_member<T: InsertCircleMemberFn>(app_data: web::Data<AppState<T>>, json: Json<CreateCircleMemberQuery>) -> Result<OutputId, UserError> {
    let create_member = app_data.db_repo.insert_circle_member(json.circle_owner_id, json.new_member_id).await;

    match create_member {
        Ok(id) => Ok(OutputId { id }),
        Err(e) => Err(e.into())
    }
}

pub async fn remove_circle_member<T: DeleteCircleMemberFn>(app_data: web::Data<AppState<T>>, json: Json<RemoveCircleMemberQuery>) -> Result<String, UserError> {
    let result = app_data.db_repo.delete_member(json.circle_group_id, json.member_id).await;

    match result {
        Ok(_) => Ok("".to_string()),
        Err(e) => Err(e.into())
    }
}