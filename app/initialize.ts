import {
  AppInitializer,
  AuthUtil,
  el,
  MaterialIconSystem,
  SplashLoader,
} from "@common-module/app";
import Config from "./Config.js";
import Env from "./Env.js";

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.dev = config.dev;

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  await SplashLoader.load(
    el("img", { src: "/images/logo-transparent.png" }),
    [],
  );

  AuthUtil.checkEmailAccess();
}
