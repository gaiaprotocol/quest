CREATE OR REPLACE FUNCTION "public"."increase_participant_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update quests
  set
    participant_count = participant_count + 1
  where
    id = new.quest_id;
  return null;
end;$$;

ALTER FUNCTION "public"."increase_participant_count"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."increase_participant_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_participant_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_participant_count"() TO "service_role";
