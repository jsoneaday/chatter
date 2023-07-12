create table profile (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_name" varchar(50) NOT NULL,
    "full_name" varchar(100) NOT NULL,
    "description" varchar(250) NOT NULL,
    "region" varchar(50),
    "main_url" varchar(250),
    "avatar" bytea
);

insert into profile (user_name, full_name, description, region, main_url) values ('jon', 'Jon Davidson', 'I am a programmer', 'usa', 'http://test1.com');
insert into profile (user_name, full_name, description, region, main_url) values ('lynn', 'Lynn Thomas', 'I am a singer', 'France', 'http://test2.com');
insert into profile (user_name, full_name, description, region, main_url) values ('fran', 'Fran Arrington', 'I am a rocket scientist', 'usa', 'http://test3.com');
insert into profile (user_name, full_name, description, region, main_url) values ('tim', 'Tim Wang', 'I am a chef', 'Italy', 'http://test4.com');
insert into profile (user_name, full_name, description, region, main_url) values ('lisa', 'Lisa Wing', 'I am a teacher', 'usa', 'http://test5.com');
insert into profile (user_name, full_name, description, region, main_url) values ('jimmy', 'James Dean', 'I am an actor', 'usa', 'http://test6.com');

create table follow (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "follower_id" bigserial NOT NULL,
    "following_id" bigserial NOT NULL,

    constraint fk_profile_follower foreign key(follower_id) references profile(id),
    constraint fk_profile_following foreign key(following_id) references profile(id)
);

insert into follow (follower_id, following_id) values (1, 2);
insert into follow (follower_id, following_id) values (3, 2);
insert into follow (follower_id, following_id) values (4, 2);
insert into follow (follower_id, following_id) values (5, 2);
insert into follow (follower_id, following_id) values (1, 3);
insert into follow (follower_id, following_id) values (1, 4);
insert into follow (follower_id, following_id) values (1, 5);
insert into follow (follower_id, following_id) values (1, 6);

create table message (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" bigserial NOT NULL,
    "body"  varchar(140),
    "likes" int NOT NULL DEFAULT 0,
    "image" bytea,
    "msg_group_type" int NOT NULL,

    constraint fk_profile foreign key(user_id) references profile(id)
);

insert into message (user_id, body, likes, msg_group_type) values (1, 'The president is doing a bad job. He should not be reelected.', 231, 1);
insert into message (user_id, body, likes, msg_group_type) values (2, 'Apple pie is the best desert ever invented.', 2, 1);
insert into message (user_id, body, likes, msg_group_type) values (1, 'I love dogs!', 56, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'I love cats!', 897, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'Just came back from visiting Italy and it was wonderful.', 12, 1);
insert into message (user_id, body, likes, msg_group_type) values (4, 'I love French fashion. Do you too?', 234, 1);
insert into message (user_id, body, likes, msg_group_type) values (4, 'I wonder who will win the tour de france this year.', 23, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'Funny stories.', 4, 1);
insert into message (user_id, body, likes, msg_group_type) values (6, 'Funny acting stories.', 14, 1);
insert into message (user_id, body, likes, msg_group_type) values (6, 'Gone with the Wind is the greatest movie of all time.', 40, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'I had the worst day ever today.', 7, 1);
insert into message (user_id, body, likes, msg_group_type) values (2, 'I had the best day ever today.', 21, 1);
insert into message (user_id, body, likes, msg_group_type) values (2, 'What is the best pizza place in new jersey?', 23, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'Do you like cookies? I like cookies.', 65, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'Societies woes are caused by the secret society.', 87, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'If black were blue and blue were black where is my hat?', 09, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'Bears are omnivours.', 4, 1);
insert into message (user_id, body, likes, msg_group_type) values (1, 'Who said I think therefore I am?', 435, 1);

create table message_response (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_msg_id" bigserial NOT NULL,
    "responding_msg_id" bigserial NOT NULL,

    constraint fk_original_message foreign key(original_msg_id) references message(id),
    constraint fk_responding_message foreign key(responding_msg_id) references message(id)
);

insert into message_response (original_msg_id, responding_msg_id) values (1, 17);
insert into message_response (original_msg_id, responding_msg_id) values (1, 18);

create table message_broadcast (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "main_msg_id" bigserial NOT NULL,
    "broadcasting_msg_id" bigserial NOT NULL,

    constraint fk_original_message foreign key(main_msg_id) references message(id),
    constraint fk_broadcasting_message foreign key(broadcasting_msg_id) references message(id)
);
