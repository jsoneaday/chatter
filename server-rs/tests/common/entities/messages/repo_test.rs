use server_rs::{
    common_tests::actix_fixture::get_app_data, 
    common::entities::{profiles::{model::ProfileCreate, repo::ProfileRepo}, messages::repo::{InsertMessageFn, QueryMessageFn}}
};

#[tokio::test]
async fn test_insert_message() {
    let app_data = get_app_data().await;

    const BODY: &str = "Test chatter post";
    let profile_id = app_data.db_repo.insert_profile(&app_data.conn, ProfileCreate { 
        user_name: "tester".to_string(), 
        full_name: "Dave Wave".to_string(), 
        description: "a description".to_string(), 
        region: Some("usa".to_string()), 
        main_url: Some("http://whatever.com".to_string()), 
        avatar: vec![] 
    }).await.unwrap();

    let message_id = app_data.db_repo.insert_message(&app_data.conn, profile_id, BODY).await.unwrap();
    
    assert!(message_id > 0);
}

#[tokio::test]
async fn test_query_message() {
    let app_data = get_app_data().await;

    const BODY: &str = "Test chatter post";
    let profile_id = app_data.db_repo.insert_profile(&app_data.conn, ProfileCreate { 
        user_name: "tester".to_string(), 
        full_name: "Dave Wave".to_string(), 
        description: "a description".to_string(), 
        region: Some("usa".to_string()), 
        main_url: Some("http://whatever.com".to_string()), 
        avatar: vec![] 
    }).await.unwrap();

    let message_id = app_data.db_repo.insert_message(&app_data.conn, profile_id, BODY).await.unwrap();    
    assert!(message_id > 0);

    let message = app_data.db_repo.query_message(&app_data.conn, message_id).await.unwrap();
    assert!(message.is_some() == true);
}