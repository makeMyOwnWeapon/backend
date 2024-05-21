create table if not exists gpt_comments
(
    id                 int auto_increment
        primary key,
    lecture_history_id int                                      not null,
    gpt_keyword        varchar(255)                             not null,
    gpt_commentary     varchar(255)                             not null,
    created_at         datetime(6) default CURRENT_TIMESTAMP(6) null
);

create index if not exists FK_lecture_history
    on gpt_comments (lecture_history_id);

create table main_lectures
(
    id         int auto_increment
        primary key,
    title      varchar(255)                             not null,
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table if not exists members
(
    id                 int auto_increment
        primary key,
    oauth_id           varchar(255)                             not null,
    authorization_code int                                      not null,
    created_at         datetime(6) default CURRENT_TIMESTAMP(6) not null,
    nickname           varchar(100)                             not null
);

create table if not exists sub_lectures
(
    id              int auto_increment
        primary key,
    url             varchar(2048)                            not null,
    title           varchar(255)                             not null,
    duration        int                                      not null,
    main_lecture_id int                                      null,
    created_at      datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint FK_e28df0cdd46794663aa4ea4984c
        foreign key (main_lecture_id) references main_lectures (id)
);

create table if not exists lecture_histories
(
    id             int auto_increment
        primary key,
    created_at     datetime(6) default CURRENT_TIMESTAMP(6) not null,
    sub_lecture_id int                                      null,
    member_id      int                                      null,
    started_at     datetime                                 not null,
    ended_at       datetime                                 null,
    constraint FK_be3cc1cda0ad3b324b95a7a8fcb
        foreign key (sub_lecture_id) references sub_lectures (id),
    constraint FK_dcc45a07037bd2ab4826520aabd
        foreign key (member_id) references members (id)
);

create table if not exists quiz_sets
(
    id             int auto_increment
        primary key,
    created_at     datetime(6) default CURRENT_TIMESTAMP(6) not null,
    title          varchar(255)                             not null,
    sub_lecture_id int                                      null,
    member_id      int                                      null,
    constraint FK_7ac3288a01badca38b4f6103982
        foreign key (sub_lecture_id) references sub_lectures (id),
    constraint FK_dd1a41ef36a5bbd8c4ab9c77ded
        foreign key (member_id) references members (id)
);

create table if not exists quizzes
(
    id          int auto_increment
        primary key,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    instruction varchar(255)                             not null,
    commentary  varchar(500)                             not null,
    quiz_set_id int                                      null,
    popup_time  int                                      not null,
    constraint FK_e976656d4fae312ef2666183758
        foreign key (quiz_set_id) references quiz_sets (id)
);

create table if not exists choices
(
    id         int auto_increment
        primary key,
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    content    varchar(255)                             not null,
    is_answer  tinyint                                  not null,
    quiz_id    int                                      null,
    constraint FK_ac46dea8a094791c3277d493d47
        foreign key (quiz_id) references quizzes (id)
);

create table if not exists quiz_results
(
    id                   int auto_increment
        primary key,
    created_at           datetime(6) default CURRENT_TIMESTAMP(6) not null,
    is_correct           tinyint                                  not null,
    solved_duration      int                                      not null,
    quiz_id              int                                      null,
    choice_id            int                                      null,
    lecture_histories_id int                                      null,
    constraint idx_quiz_lecture_history
        unique (quiz_id, lecture_histories_id),
    constraint FK_a5e1e00cb1e36eec2dfa2c21065
        foreign key (quiz_id) references quizzes (id),
    constraint FK_f0e98e2c158a25252720f8857ac
        foreign key (lecture_histories_id) references lecture_histories (id)
);

create table if not exists recommendations
(
    id          int auto_increment
        primary key,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    member_id   int                                      null,
    quiz_set_id int                                      null,
    constraint FK_497c65cf0dc617350c05741a6e1
        foreign key (member_id) references members (id),
    constraint FK_f440e93c6ecb2e61ee674bc41bf
        foreign key (quiz_set_id) references quiz_sets (id)
);

create table if not exists video_analytics_histories
(
    id                   int auto_increment
        primary key,
    created_at           datetime(6) default CURRENT_TIMESTAMP(6) not null,
    started_at           datetime                                 not null,
    ended_at             datetime                                 not null,
    analysis_type        int                                      not null,
    lecture_histories_id int                                      null,
    constraint FK_bd290f022bbb7eec808ebbd646a
        foreign key (lecture_histories_id) references lecture_histories (id)
);

