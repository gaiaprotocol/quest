import { Confirm, EventContainer, msg, Supabase } from "@common-module/app";
import QuestUserPublic from "../database-interface/QuestUserPublic.js";
import Env from "../Env.js";
import WalletManager from "../wallet/WalletManager.js";
import QuestUserService from "./QuestUserService.js";

class QuestSignedUserManager extends EventContainer {
  public user: QuestUserPublic | undefined;
  public signedUserEmail: string | undefined;

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
      this.signedUserEmail = sessionUser.email;
    }
  }

  public get signed() {
    return this.user !== undefined;
  }

  public get walletLinked() {
    return this.user?.wallet_address !== undefined;
  }

  public async signIn(provider: "x" | "discord") {
    await Supabase.signIn(provider === "x" ? "twitter" : provider);
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

  public linkDiscordToX() {
    new Confirm({
      title: msg("account-linking-guide-popup-title"),
      message: msg("account-linking-guide-discord-to-x", {
        email: this.signedUserEmail,
      }),
      confirmTitle: msg("account-linking-guide-x-login-button"),
    }, () => this.signIn("x"));
  }

  public linkXToDiscord() {
    new Confirm({
      title: msg("account-linking-guide-popup-title"),
      message: msg("account-linking-guide-x-to-discord", {
        email: this.signedUserEmail,
      }),
      confirmTitle: msg("account-linking-guide-discord-login-button"),
    }, () => this.signIn("discord"));
  }

  public async signOut() {
    await Supabase.signOut();
    location.reload();
  }
}

export default new QuestSignedUserManager();
