import { Button, DomNode, el, msg } from "@common-module/app";
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

    this.renderUserSection();
    this.onDelegate(
      QuestSignedUserManager,
      "walletLinked",
      () => this.renderUserSection(),
    );
  }

  private renderUserSection() {
    this.userSection.empty();

    if (!QuestSignedUserManager.signed) {
      this.userSection.append(
        new Button({
          tag: ".sign-in",
          title: "Sign in with 𝕏",
          click: () => QuestSignedUserManager.signIn(),
        }),
      );
    } else if (!QuestSignedUserManager.walletLinked) {
      this.userSection.append(
        new Button({
          tag: ".link-wallet",
          title: "Link wallet",
          click: () => QuestSignedUserManager.linkWallet(),
        }),
      );
    } else {
      this.userSection.append(
        new TitleBarUserDisplay(QuestSignedUserManager.user!),
      );
    }
  }

  public changeTitle(uri: string) {
    this.titleDisplay.text = msg(`title-${uri}`);
  }
}
