import { Supabase, UserService } from "@common-module/app";
import QuestUserPublic from "../database-interface/QuestUserPublic.js";

class QuestUserService extends UserService<QuestUserPublic> {
  constructor() {
    super("users_public", "*", 50);
  }

  public async fetchByXUsername(
    xUsername: string,
  ): Promise<QuestUserPublic | undefined> {
    return await this.safeSelectSingle((b) => b.eq("x_username", xUsername));
  }

  public async fetchByWalletAddress(
    walletAddress: string,
  ): Promise<QuestUserPublic | undefined> {
    return await this.safeSelectSingle((b) =>
      b.eq("wallet_address", walletAddress)
    );
  }

  public async fetchRank(userId: string): Promise<number> {
    const { data, error } = await Supabase.client.rpc(
      "get_rank",
      { p_user_id: userId },
    );
    if (error) throw error;
    return data ?? 0;
  }

  public async fetchLeaderboard() {
    const data = await Supabase.safeFetch<QuestUserPublic[]>(
      this.tableName,
      (b) =>
        b.select(this.selectQuery).order("points", { ascending: false }).limit(
          100,
        ),
    );
    return data ?? [];
  }
}

export default new QuestUserService();
