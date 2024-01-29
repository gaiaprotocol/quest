import { Button, DomNode, DropdownMenu, el } from "@common-module/app";
import QuestSignedUserManager from "../user/QuestSignedUserManager.js";
import TitleBarUserDisplay from "./title-bar/TitleBarUserDisplay.js";

export default class TitleBar extends DomNode {
  private titleDisplay: DomNode;
  private userSection: DomNode;

  constructor() {
    super(".title-bar");
    this.append(
      this.titleDisplay = el("h1"),
      this.userSection = el("section.user"),
    );

    if (!QuestSignedUserManager.signed) {
      this.userSection.append(
        new Button({
          tag: ".sign-in",
          title: "Sign in",
          click: (event, dom) => {
            event.stopPropagation();
            const rect = dom.rect;

            new DropdownMenu({
              left: rect.right - 150,
              top: rect.bottom,
              items: [{
                title: "Sign in with 𝕏",
                click: () => QuestSignedUserManager.signIn("x"),
              }, {
                title: "Sign in with Discord",
                click: () => QuestSignedUserManager.signIn("discord"),
              }],
            });
          },
        }),
      );
    } else {
      this.userSection.append(
        new TitleBarUserDisplay(QuestSignedUserManager.user!),
      );

      this.onDelegate(QuestSignedUserManager, "updatePoints", () => {
        this.userSection.empty().append(
          new TitleBarUserDisplay(QuestSignedUserManager.user!),
        );
      });
    }
  }

  public changeTitle(uri: string) {
    this.titleDisplay.text = uri;
  }
}
