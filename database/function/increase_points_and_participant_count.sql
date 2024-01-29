CREATE OR REPLACE FUNCTION "public"."increase_points_and_participant_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update quests
  set
    participant_count = participant_count + 1
  where
    id = new.quest_id;
  update users_public
  set
    points = points + (select points from quests where id = new.quest_id)
  where
    user_id = new.user_id;
  return null;
end;$$;

ALTER FUNCTION "public"."increase_points_and_participant_count"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."increase_points_and_participant_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_points_and_participant_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_points_and_participant_count"() TO "service_role";
