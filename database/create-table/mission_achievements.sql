CREATE TABLE IF NOT EXISTS "public"."mission_achievements" (
    "mission_id" int8 NOT NULL,
    "user_id" uuid NOT NULL,
    "achieved_at" timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("mission_id", "user_id")
);

ALTER TABLE "public"."mission_achievements"
    ADD CONSTRAINT "mission_achievements_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id");

ALTER TABLE "public"."mission_achievements"
    ADD CONSTRAINT "mission_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_public"("user_id");

ALTER TABLE "public"."mission_achievements" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."mission_achievements" TO "anon";
GRANT ALL ON TABLE "public"."mission_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."mission_achievements" TO "service_role";
