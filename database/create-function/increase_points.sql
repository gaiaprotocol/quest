CREATE OR REPLACE FUNCTION "public"."increase_points"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update users_public
  set
    points = points + (select points from missions where id = new.mission_id)
  where
    user_id = new.user_id;
  return null;
end;$$;

ALTER FUNCTION "public"."increase_points"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."increase_points"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_points"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_points"() TO "service_role";
