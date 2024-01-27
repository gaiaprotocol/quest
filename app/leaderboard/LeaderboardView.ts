import { el, View } from "@common-module/app";
import Layout from "../layout/Layout.js";
import Leaderboard from "./Leaderboard.js";

export default class LeaderboardView extends View {
  constructor() {
    super();
    Layout.append(
      this.container = el(
        ".leaderboard-view",
        new Leaderboard(),
      ),
    );
  }
}
