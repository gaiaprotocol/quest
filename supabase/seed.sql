
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_missions"("p_quest_id" bigint, "p_user_id" "uuid" DEFAULT NULL::"uuid", "last_created_at" timestamp with time zone DEFAULT NULL::timestamp with time zone, "max_count" integer DEFAULT 50) RETURNS TABLE("id" bigint, "quest_id" bigint, "type" "text", "criteria" "jsonb", "title" "text", "description" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "is_achieved" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.quest_id,
        m.type,
        m.criteria,
        m.title,
        m.description,
        m.created_at,
        m.updated_at,
        EXISTS (SELECT 1 FROM mission_achievements ma WHERE ma.mission_id = m.id AND ma.user_id = p_user_id) AS is_achieved
    FROM 
        missions m
    WHERE 
        m.quest_id = p_quest_id
        AND (last_created_at IS NULL OR m.created_at < last_created_at)
    ORDER BY 
        m.id ASC
    LIMIT 
        max_count;
END;
$$;

ALTER FUNCTION "public"."get_missions"("p_quest_id" bigint, "p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_quests"("p_user_id" "uuid" DEFAULT NULL::"uuid", "last_created_at" timestamp with time zone DEFAULT NULL::timestamp with time zone, "max_count" integer DEFAULT 50) RETURNS TABLE("id" bigint, "title" "text", "description" "text", "image" "text", "points" bigint, "participant_count" bigint, "start_date" timestamp with time zone, "end_date" timestamp with time zone, "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "is_achieved" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.title,
        q.description,
        q.image,
        q.points,
        q.participant_count,
        q.start_date,
        q.end_date,
        q.created_at,
        q.updated_at,
        EXISTS (SELECT 1 FROM quest_achievements qa WHERE qa.quest_id = q.id AND qa.user_id = p_user_id) AS is_achieved
    FROM 
        quests q
    WHERE 
        (last_created_at IS NULL OR q.created_at < last_created_at)
    ORDER BY 
        q.id DESC
    LIMIT 
        max_count;
END;
$$;

ALTER FUNCTION "public"."get_quests"("p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_rank"("p_user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    user_points integer;
    rank integer;
BEGIN
    SELECT points INTO user_points FROM "public"."users_public" WHERE "user_id" = "p_user_id";
    SELECT COUNT(*) INTO rank FROM "public"."users_public" WHERE points > user_points;
    RETURN rank + 1;
END;
$$;

ALTER FUNCTION "public"."get_rank"("p_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  new.updated_at := now();
  RETURN new;
END;$$;

ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_user_metadata_to_public"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if strpos(new.raw_user_meta_data ->> 'iss', 'twitter') > 0 then
    insert into public.users_public (user_id, display_name, avatar, avatar_thumb, avatar_stored, x_username)
    values (
      new.id,
      new.raw_user_meta_data ->> 'full_name',
      case 
        when strpos(new.raw_user_meta_data ->> 'avatar_url', '_normal') > 0 then
          replace(new.raw_user_meta_data ->> 'avatar_url', '_normal', '')
        else
          new.raw_user_meta_data ->> 'avatar_url'
      end,
      new.raw_user_meta_data ->> 'avatar_url',
      false,
      new.raw_user_meta_data ->> 'user_name'
    ) on conflict (user_id) do update
    set
      display_name = new.raw_user_meta_data ->> 'full_name',
      avatar = case 
        when strpos(new.raw_user_meta_data ->> 'avatar_url', '_normal') > 0 then
          replace(new.raw_user_meta_data ->> 'avatar_url', '_normal', '')
        else
          new.raw_user_meta_data ->> 'avatar_url'
      end,
      avatar_thumb = new.raw_user_meta_data ->> 'avatar_url',
      avatar_stored = false,
      x_username = new.raw_user_meta_data ->> 'user_name';
  elsif strpos(new.raw_user_meta_data ->> 'iss', 'discord') > 0 then
    insert into public.users_public (user_id, display_name, avatar, avatar_thumb, avatar_stored, discord_username, discord_user_id)
    values (
      new.id,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'id',
      false
    ) on conflict (user_id) do update
    set
      display_name = new.raw_user_meta_data ->> 'full_name',
      avatar = new.raw_user_meta_data ->> 'avatar_url',
      avatar_thumb = new.raw_user_meta_data ->> 'avatar_url',
      discord_username = new.raw_user_meta_data ->> 'full_name',
      discord_user_id = new.raw_user_meta_data ->> 'id',
      avatar_stored = false;
  else
    insert into public.users_public (user_id, display_name, avatar, avatar_thumb, avatar_stored)
    values (
      new.id,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'avatar_url',
      false
    ) on conflict (user_id) do update
    set
      display_name = new.raw_user_meta_data ->> 'full_name',
      avatar = new.raw_user_meta_data ->> 'avatar_url',
      avatar_thumb = new.raw_user_meta_data ->> 'avatar_url',
      avatar_stored = false;
  end if;
  return new;
end;
$$;

ALTER FUNCTION "public"."set_user_metadata_to_public"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."mission_achievements" (
    "mission_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achieved_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."mission_achievements" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."missions" (
    "id" bigint NOT NULL,
    "quest_id" bigint NOT NULL,
    "type" "text" NOT NULL,
    "criteria" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
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

CREATE TABLE IF NOT EXISTS "public"."quest_achievements" (
    "quest_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achieved_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."quest_achievements" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."quests" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "points" bigint NOT NULL,
    "participant_count" bigint DEFAULT '0'::bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "image" "text" NOT NULL
);

ALTER TABLE "public"."quests" OWNER TO "postgres";

ALTER TABLE "public"."quests" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users_public" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "wallet_address" "text",
    "display_name" "text",
    "avatar" "text",
    "avatar_thumb" "text",
    "avatar_stored" boolean DEFAULT false NOT NULL,
    "stored_avatar" "text",
    "stored_avatar_thumb" "text",
    "x_username" "text",
    "metadata" "jsonb",
    "blocked" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "points" integer DEFAULT 0 NOT NULL,
    "discord_username" "text",
    "discord_user_id" "text"
);

ALTER TABLE "public"."users_public" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."wallet_linking_nonces" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "wallet_address" "text" NOT NULL,
    "nonce" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."wallet_linking_nonces" OWNER TO "postgres";

ALTER TABLE ONLY "public"."mission_achievements"
    ADD CONSTRAINT "mission_achievements_pkey" PRIMARY KEY ("mission_id", "user_id");

ALTER TABLE ONLY "public"."missions"
    ADD CONSTRAINT "missions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."quest_achievements"
    ADD CONSTRAINT "quest_achievements_pkey" PRIMARY KEY ("quest_id", "user_id");

ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users_public"
    ADD CONSTRAINT "users_public_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."users_public"
    ADD CONSTRAINT "users_public_wallet_address_key" UNIQUE ("wallet_address");

ALTER TABLE ONLY "public"."wallet_linking_nonces"
    ADD CONSTRAINT "wallet_linking_nonces_pkey" PRIMARY KEY ("user_id");

CREATE OR REPLACE TRIGGER "set_users_public_updated_at" BEFORE UPDATE ON "public"."users_public" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

ALTER TABLE ONLY "public"."mission_achievements"
    ADD CONSTRAINT "mission_achievements_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id");

ALTER TABLE ONLY "public"."mission_achievements"
    ADD CONSTRAINT "mission_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_public"("user_id");

ALTER TABLE ONLY "public"."missions"
    ADD CONSTRAINT "missions_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id");

ALTER TABLE ONLY "public"."quest_achievements"
    ADD CONSTRAINT "quest_achievements_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id");

ALTER TABLE ONLY "public"."quest_achievements"
    ADD CONSTRAINT "quest_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_public"("user_id");

ALTER TABLE ONLY "public"."users_public"
    ADD CONSTRAINT "users_public_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE "public"."mission_achievements" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."missions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."quest_achievements" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."quests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users_public" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view everyone" ON "public"."missions" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."quests" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."users_public" FOR SELECT USING (true);

ALTER TABLE "public"."wallet_linking_nonces" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_missions"("p_quest_id" bigint, "p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_missions"("p_quest_id" bigint, "p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_missions"("p_quest_id" bigint, "p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_quests"("p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_quests"("p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_quests"("p_user_id" "uuid", "last_created_at" timestamp with time zone, "max_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_rank"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_rank"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_rank"("p_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_user_metadata_to_public"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_user_metadata_to_public"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_user_metadata_to_public"() TO "service_role";

GRANT ALL ON TABLE "public"."mission_achievements" TO "anon";
GRANT ALL ON TABLE "public"."mission_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."mission_achievements" TO "service_role";

GRANT ALL ON TABLE "public"."missions" TO "anon";
GRANT ALL ON TABLE "public"."missions" TO "authenticated";
GRANT ALL ON TABLE "public"."missions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."missions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."missions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."missions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."quest_achievements" TO "anon";
GRANT ALL ON TABLE "public"."quest_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."quest_achievements" TO "service_role";

GRANT ALL ON TABLE "public"."quests" TO "anon";
GRANT ALL ON TABLE "public"."quests" TO "authenticated";
GRANT ALL ON TABLE "public"."quests" TO "service_role";

GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users_public" TO "anon";
GRANT ALL ON TABLE "public"."users_public" TO "authenticated";
GRANT ALL ON TABLE "public"."users_public" TO "service_role";

GRANT ALL ON TABLE "public"."wallet_linking_nonces" TO "anon";
GRANT ALL ON TABLE "public"."wallet_linking_nonces" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_linking_nonces" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
