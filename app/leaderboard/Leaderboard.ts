import { DomNode, el, ListLoadingBar, Store } from "@common-module/app";
import QuestUserPublic from "../database-interface/QuestUserPublic.js";
import QuestUserService from "../user/QuestUserService.js";
import LeaderboardItem from "./LeaderboardItem.js";

export default class Leaderboard extends DomNode {
  private store = new Store("leaderboard");

  private tbody: DomNode;

  constructor() {
    super("table.leaderboard");

    this.append(
      el(
        "thead",
        el(
          "tr",
          el("th.rank", "Rank"),
          el("th.user", "User"),
          el("th.points", "Points"),
          el("th.x", "𝕏"),
          el("th.discord", "Discord"),
        ),
      ),
      this.tbody = el("tbody"),
    );

    const cachedUsers = this.store.get<QuestUserPublic[]>("cached-users");
    if (cachedUsers && cachedUsers.length > 0) {
      for (const [index, user] of cachedUsers.entries()) {
        this.tbody.append(new LeaderboardItem(index + 1, user));
      }
    }

    this.refresh();
  }

  private async refresh() {
    this.tbody.append(new ListLoadingBar());

    const users = await QuestUserService.fetchLeaderboard();

    this.store.set("cached-users", users, true);

    if (!this.deleted) {
      this.tbody.empty();
      for (const [index, user] of users.entries()) {
        this.tbody.append(new LeaderboardItem(index + 1, user));
      }
    }
  }
}
