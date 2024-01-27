import { AvatarUtil, DomNode, StringUtil, el } from "@common-module/app";
import QuestUserPublic from "../database-interface/QuestUserPublic.js";

export default class LeaderboardItem extends DomNode {
  constructor(rank: number, user: QuestUserPublic) {
    super("tr.leaderboard-item");

    const avatar = el("td.avatar");

    AvatarUtil.selectLoadable(avatar, [
      user.avatar_thumb,
      user.stored_avatar_thumb,
    ]);

    this.append(
      el("td.rank", String(rank)),
      el("td.user", el(".user", avatar, el("span.name", user.display_name))),
      el("td.points", StringUtil.numberWithCommas(String(user.points))),
      el(
        "td.x",
        user.x_username
          ? el("a", {
            href: `https://x.com/${user.x_username}`,
            target: "_blank",
          }, `@${user.x_username}`)
          : "",
      ),
      el("td.discord", user.discord_username),
    );
  }
}
