import { Button, DomNode, el } from "@common-module/app";
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
          title: "Sign in with 𝕏",
          click: () => QuestSignedUserManager.signIn(),
        }),
      );
    } else {
      this.userSection.append(
        new TitleBarUserDisplay(QuestSignedUserManager.user!),
      );
    }
  }

  public changeTitle(uri: string) {
    this.titleDisplay.text = uri;
  }
}
