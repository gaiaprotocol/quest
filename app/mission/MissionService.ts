import { Supabase, SupabaseService } from "@common-module/app";
import Mission from "../database-interface/Mission.js";

class MissionService extends SupabaseService<Mission> {
  constructor() {
    super("missions", "*", 50);
  }

  public async fetchMissions(
    questId: number,
    userId?: string,
    lastCreatedAt?: string,
  ) {
    const { data, error } = await Supabase.client.rpc(
      "get_missions",
      {
        p_quest_id: questId,
        p_user_id: userId,
        last_created_at: lastCreatedAt,
        max_count: this.fetchLimit,
      },
    );
    if (error) throw error;
    return Supabase.safeResult<Mission[]>(data ?? []);
  }

  public async followX(missionId: number, targetXUsername: string) {
    const { error } = await Supabase.client.functions.invoke(
      "follow-x",
      { body: { missionId, targetXUsername } },
    );
    if (error) throw error;
  }
}

export default new MissionService();
