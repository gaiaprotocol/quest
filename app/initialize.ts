import {
  AppInitializer,
  AuthUtil,
  el,
  MaterialIconSystem,
  Router,
  SplashLoader,
} from "@common-module/app";
import Config from "./Config.js";
import Env from "./Env.js";
import Layout from "./layout/Layout.js";
import QuestSignedUserManager from "./user/QuestSignedUserManager.js";
import WalletManager from "./wallet/WalletManager.js";

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.dev = config.dev;
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

  AuthUtil.checkEmailAccess();
}
