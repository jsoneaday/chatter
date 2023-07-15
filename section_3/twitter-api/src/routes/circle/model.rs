use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
pub struct CircleQuery {
    pub id: i64,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCircleMemberQuery {
    pub circle_owner_id: i64, 
    pub new_member_id: i64
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveCircleMemberQuery{
    pub circle_group_id: i64, 
    pub member_id: i64
}