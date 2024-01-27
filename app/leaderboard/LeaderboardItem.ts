import {
  AvatarUtil,
  DomNode,
  DropdownMenu,
  el,
  Snackbar,
  StringUtil,
} from "@common-module/app";
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
      el(
        "td.user",
        el("a.user", avatar, el("span.name", user.display_name), {
          click: (event, dom) => {
            event.stopPropagation();
            const rect = dom.rect;
            const items: {
              icon?: DomNode;
              title: string;
              click: () => void;
            }[] = [];
            if (user.x_username) {
              items.push({
                title: "𝕏",
                click: () =>
                  window.open(`https://x.com/${user.x_username}`, "_blank"),
              });
            }
            if (user.discord_username) {
              items.push({
                title: "Discord",
                click: () => {
                  navigator.clipboard.writeText(user.discord_username!);
                  new Snackbar({ message: "Copied to clipboard" });
                },
              });
            }
            new DropdownMenu({
              left: rect.left,
              top: rect.bottom,
              items,
            });
          },
        }),
      ),
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
