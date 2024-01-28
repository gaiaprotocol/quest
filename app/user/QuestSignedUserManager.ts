import { EventContainer, Supabase } from "@common-module/app";
import Env from "../Env.js";
import QuestUserPublic from "../database-interface/QuestUserPublic.js";
import WalletManager from "../wallet/WalletManager.js";
import QuestUserService from "./QuestUserService.js";

class QuestSignedUserManager extends EventContainer {
  public user: QuestUserPublic | undefined;

  constructor() {
    super();
    this.addAllowedEvents("walletLinked");
  }

  public async fetchUserOnInit() {
    const { data, error } = await Supabase.client.auth.getSession();
    if (error) throw error;
    const sessionUser = data?.session?.user;
    if (sessionUser) {
      this.user = await QuestUserService.fetchUser(sessionUser.id);
    }
  }

  public get signed() {
    return this.user !== undefined;
  }

  public get walletLinked() {
    return this.user?.wallet_address !== undefined;
  }

  public async signIn() {
    await Supabase.signIn("twitter");
  }

  public async linkDiscord() {
    await Supabase.signIn("discord");
  }

  public async linkWallet() {
    if (!WalletManager.connected) await WalletManager.connect();

    const walletAddress = WalletManager.address;
    if (!walletAddress) throw new Error("Wallet is not connected");

    const { data: nonceData, error: nonceError } = await Supabase.client
      .functions.invoke("new-wallet-linking-nonce", {
        body: { walletAddress },
      });
    if (nonceError) throw nonceError;

    const signedMessage = await WalletManager.signMessage(
      `${Env.messageForWalletLinking}\n\nNonce: ${nonceData.nonce}`,
    );

    const { error: linkError } = await Supabase.client.functions
      .invoke(
        "link-wallet-to-user",
        { body: { walletAddress, signedMessage } },
      );
    if (linkError) throw linkError;

    if (this.user) {
      this.user.wallet_address = walletAddress;
      this.fireEvent("walletLinked");
    }
  }

  public async signOut() {
    await Supabase.signOut();
    location.reload();
  }
}

export default new QuestSignedUserManager();
