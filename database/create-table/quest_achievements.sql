CREATE TABLE IF NOT EXISTS "public"."quest_achievements" (
    "quest_id" int8 NOT NULL,
    "user_id" uuid NOT NULL,
    "discord_user_id" text,
    "wallet_address" text,
    "achieved_at" timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("quest_id", "user_id")
);

ALTER TABLE "public"."quest_achievements"
    ADD CONSTRAINT "quest_achievements_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id");

ALTER TABLE "public"."quest_achievements"
    ADD CONSTRAINT "quest_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_public"("user_id");

ALTER TABLE "public"."quest_achievements" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view everyone" ON "public"."quest_achievements" FOR SELECT USING (true);

GRANT ALL ON TABLE "public"."quest_achievements" TO "anon";
GRANT ALL ON TABLE "public"."quest_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."quest_achievements" TO "service_role";
