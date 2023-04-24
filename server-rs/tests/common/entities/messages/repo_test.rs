use server_rs::{
    common_tests::actix_fixture::get_app_data, 
    common::entities::{profiles::{model::ProfileCreate, repo::insert_profile}, messages::repo::insert_message}
};

#[tokio::test]
async fn test_insert_message() {
    let app_data = get_app_data().await;

    const BODY: &str = "Test chatter post";
    let profile_id = insert_profile(&app_data.conn, ProfileCreate { 
        user_name: "tester".to_string(), 
        full_name: "Dave Wave".to_string(), 
        description: "a description".to_string(), 
        region: Some("usa".to_string()), 
        main_url: Some("http://whatever.com".to_string()), 
        avatar: vec![] 
    }).await.unwrap();

    let message_id = insert_message(&app_data.conn, profile_id, BODY).await.unwrap();
    
    assert!(message_id > 0);
}