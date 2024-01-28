import { Supabase, SupabaseService } from "@common-module/app";
import Quest from "../database-interface/Quest.js";

class QuestService extends SupabaseService<Quest> {
  constructor() {
    super("quests", "*", 50);
  }

  public async fetchQuests(userId?: string, lastCreatedAt?: string) {
    const { data, error } = await Supabase.client.rpc(
      "get_quests",
      {
        p_user_id: userId,
        last_created_at: lastCreatedAt,
        max_count: this.fetchLimit,
      },
    );
    if (error) throw error;
    console.log(data);
    return Supabase.safeResult<Quest[]>(data ?? []);
  }
}

export default new QuestService();
