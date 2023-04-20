create table message (
    "id" bigserial not null,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "body"  VARCHAR(140)

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
)