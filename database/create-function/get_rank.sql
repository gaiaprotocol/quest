CREATE OR REPLACE FUNCTION "public"."get_rank"("p_user_id" uuid) RETURNS integer
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

ALTER FUNCTION "public"."get_rank"("p_user_id" uuid) OWNER TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_rank"("p_user_id" uuid) TO "anon";
GRANT EXECUTE ON FUNCTION "public"."get_rank"("p_user_id" uuid) TO "authenticated";
GRANT EXECUTE ON FUNCTION "public"."get_rank"("p_user_id" uuid) TO "service_role";
