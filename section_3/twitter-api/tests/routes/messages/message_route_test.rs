use actix_http::header::HeaderValue;
use actix_web::http::header;
use fake::Fake;
use fake::faker::internet::en::Username;
use twitter_clone_api::common_tests::actix_fixture::{
    get_profile_create_multipart,
    get_profile_avatar, get_fake_message_body, get_message_create_multipart, get_message_create_response_multipart,
};
use twitter_clone_api::routes::output_id::OutputId;
use twitter_clone_api::{
    common_tests::actix_fixture::get_app,
    routes::messages::model::MessageResponder,
};
use actix_web::test;


#[tokio::test]
pub async fn test_route_create_and_get_message() {
    let app = get_app().await;
    let avatar = get_profile_avatar();
    let boundary = Username().fake::<String>(); // use random name as boundary
    let profile_payload = get_profile_create_multipart(&avatar, &boundary, true);

    let header_value_string = format!("multipart/form-data; boundary={}", boundary);
    let header_value = HeaderValue::from_str(&header_value_string).unwrap();
    let update_avatar_req = test::TestRequest
        ::post()
        .append_header((header::CONTENT_TYPE, header_value.clone()))
        .uri("/v1/profile")
        .set_payload(profile_payload)
        .to_request();
    let profile_id_result = test::call_and_read_body_json::<_, _, OutputId>(&app, update_avatar_req).await;
    println!("created profile");
    let msg_body: String = get_fake_message_body(None);
    let msg_payload = get_message_create_multipart(&avatar, &boundary, true, profile_id_result.id, &msg_body);
    let create_msg_req = test::TestRequest
        ::post()
        .append_header((header::CONTENT_TYPE, header_value.clone()))
        .uri("/v1/msg")
        .set_payload(msg_payload)
        .to_request();
    let msg_id_result = test::call_and_read_body_json::<_, _, OutputId>(&app, create_msg_req).await;
    println!("created message");
    let get_msg_req = test::TestRequest::get().uri(&format!("/v1/msg/{}", msg_id_result.id)).to_request();
    let get_msg_body = test::call_and_read_body_json::<_, _, Option<MessageResponder>>(
        &app,
        get_msg_req
    ).await;

    assert!(get_msg_body.unwrap().body.unwrap().eq(&msg_body));
}

#[tokio::test]
pub async fn test_route_create_and_get_message_response() {
    let app = get_app().await;
    let avatar = get_profile_avatar();
    let boundary = Username().fake::<String>(); // use random name as boundary
    let profile_payload = get_profile_create_multipart(&avatar, &boundary, true);

    let header_value_string = format!("multipart/form-data; boundary={}", boundary);
    let header_value = HeaderValue::from_str(&header_value_string).unwrap();
    let update_avatar_req = test::TestRequest
        ::post()
        .append_header((header::CONTENT_TYPE, header_value.clone()))
        .uri("/v1/profile")
        .set_payload(profile_payload)
        .to_request();
    let profile_id_result = test::call_and_read_body_json::<_, _, OutputId>(&app, update_avatar_req).await;
    println!("created profile");
    let msg_body: String = get_fake_message_body(None);
    let msg_payload = get_message_create_response_multipart(&avatar, &boundary, true, profile_id_result.id, &msg_body);
    let create_msg_req = test::TestRequest
        ::post()
        .append_header((header::CONTENT_TYPE, header_value.clone()))
        .uri("/v1/msg_response")
        .set_payload(msg_payload)
        .to_request();
    let msg_id_result = test::call_and_read_body_json::<_, _, OutputId>(&app, create_msg_req).await;
    println!("created message");
    let get_msg_req = test::TestRequest::get().uri(&format!("/v1/msg/{}", msg_id_result.id)).to_request();
    let get_msg_body = test::call_and_read_body_json::<_, _, Option<MessageResponder>>(
        &app,
        get_msg_req
    ).await;

    assert!(get_msg_body.unwrap().body.unwrap().eq(&msg_body));
}