
CREATE TRIGGER "set_users_public_updated_at" BEFORE UPDATE ON "public"."users_public" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "increase_points_and_participant_count" AFTER INSERT ON "public"."quest_achievements" FOR EACH ROW EXECUTE FUNCTION "public"."increase_points_and_participant_count"();