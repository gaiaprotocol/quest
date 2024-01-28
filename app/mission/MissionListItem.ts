import { Button, DomNode, el, MaterialIcon } from "@common-module/app";
import Mission, { MissionType } from "../database-interface/Mission.js";
import QuestSignedUserManager from "../user/QuestSignedUserManager.js";

export default class MissionListItem extends DomNode {
  constructor(mission: Mission) {
    super(".mission-list-item");

    let icon;
    let actionButton;
    if (mission.type === MissionType.FOLLOW_X) {
      icon = el("img", { src: "/images/social/x.svg" });
      actionButton = QuestSignedUserManager.signed
        ? new Button({
          icon: new MaterialIcon("person_add"),
          title: "Follow",
          href: `https://x.com/${mission.criteria.target_x_username}`,
        })
        : new Button({
          title: "Sign in",
          click: () => QuestSignedUserManager.signIn(),
        });
    } else if (mission.type === MissionType.JOIN_DISCORD) {
      icon = el("img", { src: "/images/social/discord.svg" });
      if (QuestSignedUserManager.signed) {
        actionButton = QuestSignedUserManager.user?.discord_username
          ? new Button({
            icon: new MaterialIcon("login"),
            title: "Join",
            href: mission.criteria.target_discord_url,
          })
          : new Button({
            title: "Link Discord Account",
            //click: () => QuestSignedUserManager.linkDiscord(),
          });
      }
    }

    this.append(
      el(
        "header",
        el("h2", icon, mission.title),
        actionButton,
      ),
      el("p", mission.description),
    );
  }
}
