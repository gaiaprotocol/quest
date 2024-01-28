CREATE TABLE IF NOT EXISTS "public"."missions" (
    "id" BIGINT PRIMARY KEY,
    "quest_id" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "criteria" JSONB DEFAULT '{}'::JSONB NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "public"."missions" OWNER TO "postgres";

ALTER TABLE "public"."missions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."missions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."missions"
    ADD CONSTRAINT "missions_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id");

ALTER TABLE "public"."missions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view everyone" ON "public"."missions" FOR SELECT USING (true);

GRANT ALL ON TABLE "public"."missions" TO "anon";
GRANT ALL ON TABLE "public"."missions" TO "authenticated";
GRANT ALL ON TABLE "public"."missions" TO "service_role";