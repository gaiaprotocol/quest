import {
  Alert,
  AppInitializer,
  AuthUtil,
  el,
  MaterialIconSystem,
  msg,
  Router,
  SplashLoader,
} from "@common-module/app";
import messages_en from "../locales/en.yml";
import messages_ja from "../locales/ja.yml";
import messages_zh from "../locales/zh.yml";
import messages_zh_HK from "../locales/zh_HK.yml";
import messages_zh_TW from "../locales/zh_TW.yml";
import Config from "./Config.js";
import Env from "./Env.js";
import Layout from "./layout/Layout.js";
import LeaderboardView from "./leaderboard/LeaderboardView.js";
import QuestsView from "./quest/QuestsView.js";
import QuestView from "./quest/QuestView.js";
import QuestSignedUserManager from "./user/QuestSignedUserManager.js";
import WalletManager from "./wallet/WalletManager.js";

msg.setMessages({
  en: messages_en,
  zh: messages_zh,
  "zh-tw": messages_zh_TW,
  "zh-hk": messages_zh_HK,
  ja: messages_ja,
});

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.dev = config.dev;
  Env.discordAuthUrl = config.discordAuthUrl;
  Env.messageForWalletLinking = config.messageForWalletLinking;

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  WalletManager.init(config.walletConnectProjectId);

  await SplashLoader.load(
    el("img", { src: "/images/logo.png" }),
    [QuestSignedUserManager.fetchUserOnInit()],
  );

  Router.route("**", Layout);
  Router.route(["", "quests"], QuestsView);
  Router.route("quest/{questId}", QuestView);
  Router.route("leaderboard", LeaderboardView);

  AuthUtil.checkEmailAccess();

  if (QuestSignedUserManager.signed) {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      await QuestSignedUserManager.linkDiscordAccount(code);
      new Alert({
        title: "Discord Account Linked",
        message: "Your Discord account has been linked.",
      });
    }
  }
}
