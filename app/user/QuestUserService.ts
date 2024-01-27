import { UserService } from "@common-module/app";
import QuestUserPublic from "../database-interface/QuestUserPublic.js";

class QuestUserService extends UserService<QuestUserPublic> {
  constructor() {
    super("users_public", "*", 50);
  }

  public async fetchByXUsername(xUsername: string): Promise<QuestUserPublic | undefined> {
    return await this.safeSelectSingle((b) => b.eq("x_username", xUsername));
  }

  public async fetchByWalletAddress(
    walletAddress: string,
  ): Promise<QuestUserPublic | undefined> {
    return await this.safeSelectSingle((b) =>
      b.eq("wallet_address", walletAddress)
    );
  }
}

export default new QuestUserService();
