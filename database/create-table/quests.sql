CREATE TABLE IF NOT EXISTS "public"."quests" (
    "id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" BIGINT NOT NULL,
    "participant_count" BIGINT NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."quests" OWNER TO "postgres";

ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."quests" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."quests" TO "anon";
GRANT ALL ON TABLE "public"."quests" TO "authenticated";
GRANT ALL ON TABLE "public"."quests" TO "service_role";
