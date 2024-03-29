import { AvatarUtil, DomNode, el } from "@common-module/app";
import QuestUserPublic from "../../database-interface/QuestUserPublic.js";
import SidePanel from "../SidePanel.js";

export default class TitleBarUserDisplay extends DomNode {
  constructor(user: QuestUserPublic) {
    super(".title-bar-user-display");

    const avatar = el(".avatar");

    AvatarUtil.selectLoadable(avatar, [
      user.avatar_thumb,
      user.stored_avatar_thumb,
    ]);

    this.append(
      avatar,
      el(".name", user.display_name),
      el(".points", `${user.points} points`),
    );

    this.onDom("click", () => new SidePanel());
  }
}
