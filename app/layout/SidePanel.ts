import {
  AvatarUtil,
  BodyNode,
  Button,
  DomNode,
  el,
  MaterialIcon,
  Router,
} from "@common-module/app";
import QuestSignedUserManager from "../user/QuestSignedUserManager.js";

export default class SidePanel extends DomNode {
  constructor() {
    super(".side-panel");

    const avatar = el(".avatar");

    if (QuestSignedUserManager.user) {
      AvatarUtil.selectLoadable(avatar, [
        QuestSignedUserManager.user.avatar_thumb,
        QuestSignedUserManager.user.stored_avatar_thumb,
      ]);
    }

    this.append(el(
      "main",
      el(
        "header",
        QuestSignedUserManager.user
          ? el(
            ".signed-user",
            avatar,
            el(
              ".info",
              el(".name", QuestSignedUserManager.user.display_name),
              el(".x-username", `@${QuestSignedUserManager.user.x_username}`),
            ),
          )
          : undefined,
        new Button({
          tag: ".close",
          icon: new MaterialIcon("close"),
          click: () => this.delete(),
        }),
      ),
      new Button({
        title: "Sign Out",
        click: () => {
          QuestSignedUserManager.signOut();
          this.delete();
        },
      }),
    ));

    this.onDom("click", (event: MouseEvent) => {
      if (event.target === this.domElement) {
        this.delete();
      }
    });
    BodyNode.append(this);
  }
}
