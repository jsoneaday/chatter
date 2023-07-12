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

insert into message (user_id, body, likes, msg_group_type) values (1, 'Matt told her to reach for the stars, but Veronica thought it was the most ridiculous advice she''d ever received.', 231, 1);
insert into message (user_id, body, likes, msg_group_type) values (2, 'They decided to find the end of the rainbow. While they hoped they would find a pot of gold.', 2, 1);
insert into message (user_id, body, likes, msg_group_type) values (1, 'Of course he was getting them, but if he wasn''t getting them, how would he ever be able to answer?', 56, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'Zeke read the sign as an invitation to explore an area that would be adventurous and exciting.', 897, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'Just came back from visiting Italy and it was wonderful.', 12, 1);
insert into message (user_id, body, likes, msg_group_type) values (4, 'She sat deep in thought. The next word that came out o her mouth would likely be the most important word of her life.', 234, 1);
insert into message (user_id, body, likes, msg_group_type) values (4, 'The rain was coming. Everyone thought this would be a good thing. It hadn''t rained in months and the earth was dry as a bone.', 23, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'Luckily dogs don''t discriminate. Just watch at a dog park. Big black and white dogs wag their tails and play with tiny tan dogs.', 4, 1);
insert into message (user_id, body, likes, msg_group_type) values (6, 'He looked at the sand. Picking up a handful, he wondered how many grains were in his hand. Hundreds of thousands? "Not enough,"', 14, 1);
insert into message (user_id, body, likes, msg_group_type) values (6, 'Gone with the Wind is the greatest movie of all time.', 40, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'The bowl was filled with fruit. It seemed to be an overabundance of strawberries, but it also included grapes and banana slices', 7, 1);
insert into message (user_id, body, likes, msg_group_type) values (2, 'The only one who had disagreed with this sentiment was her brother.', 21, 1);
insert into message (user_id, body, likes, msg_group_type) values (2, 'Patrick didn''t want to go. The fact that she was insisting they must go made him want to go even less.', 23, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'He couldn''t move. His head throbbed and spun. He couldn''t decide if it was the flu or the drinking last night.', 65, 1);
insert into message (user_id, body, likes, msg_group_type) values (3, 'He slowly poured the drink over a large chunk of ice he has especially chiseled off a larger block.', 87, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'She wished that she could simply accept the gesture and be content knowing someone had given it to her.', 09, 1);
insert into message (user_id, body, likes, msg_group_type) values (5, 'She sat deep in thought. The next word that came out o her mouth would likely be the most important word of her life.', 4, 1);
insert into message (user_id, body, likes, msg_group_type) values (1, 'They would have never believed they would actually find the end of a rainbow, and when they did, what they actually found there.', 435, 1);

create table message_response (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_msg_id" bigserial NOT NULL,
    "responding_msg_id" bigserial NOT NULL,

    constraint fk_original_message foreign key(original_msg_id) references message(id),
    constraint fk_responding_message foreign key(responding_msg_id) references message(id)
);

insert into message_response (original_msg_id, responding_msg_id) values (18, 5);
insert into message_response (original_msg_id, responding_msg_id) values (18, 4);
insert into message_response (original_msg_id, responding_msg_id) values (17, 3);
insert into message_response (original_msg_id, responding_msg_id) values (17, 2);
insert into message_response (original_msg_id, responding_msg_id) values (16, 1);

create table message_broadcast (
    "id" bigserial primary key,
    "created_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "main_msg_id" bigserial NOT NULL,
    "broadcasting_msg_id" bigserial NOT NULL,

    constraint fk_original_message foreign key(main_msg_id) references message(id),
    constraint fk_broadcasting_message foreign key(broadcasting_msg_id) references message(id)
);
