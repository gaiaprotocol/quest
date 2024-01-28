import {
  AvatarUtil,
  BodyNode,
  Button,
  DomNode,
  el,
  LoadingSpinner,
  MaterialIcon,
  Store,
  StringUtil,
} from "@common-module/app";
import QuestSignedUserManager from "../user/QuestSignedUserManager.js";
import QuestUserService from "../user/QuestUserService.js";

export default class SidePanel extends DomNode {
  private store = new Store("rank-store");
  private rankDisplay: DomNode;

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
      el(
        "main",
        el(
          "section.discord",
          el("h3", "Discord"),
          QuestSignedUserManager.user?.discord_username
            ? el(".value", QuestSignedUserManager.user.discord_username)
            : new Button({
              title: "Link Discord",
              click: () => QuestSignedUserManager.linkDiscord(),
            }),
        ),
        el(
          "section.wallet-address",
          el("h3", "Wallet Address"),
          QuestSignedUserManager.user?.wallet_address
            ? el(
              "a.value",
              StringUtil.shortenEthereumAddress(
                QuestSignedUserManager.user.wallet_address,
              ),
              {
                href:
                  `https://etherscan.io/address/${QuestSignedUserManager.user.wallet_address}`,
                target: "_blank",
              },
            )
            : new Button({
              title: "Link Wallet",
              click: () => QuestSignedUserManager.linkWallet(),
            }),
        ),
      ),
      el(
        "main",
        el(
          "section.points",
          el("h3", "Your Points"),
          el(".value", String(QuestSignedUserManager.user?.points ?? 0)),
        ),
        el(
          "section.rank",
          el("h3", "Your Rank"),
          this.rankDisplay = el(
            ".value",
            this.store.get("rank")
              ? String(this.store.get("rank"))
              : new LoadingSpinner(),
          ),
        ),
      ),
      el(
        "footer",
        new Button({
          title: "Sign Out",
          click: () => {
            QuestSignedUserManager.signOut();
            this.delete();
          },
        }),
      ),
    ));

    this.onDom("click", (event: MouseEvent) => {
      if (event.target === this.domElement) {
        this.delete();
      }
    });
    BodyNode.append(this);

    this.fetchRank();
  }

  async fetchRank() {
    const rank = QuestSignedUserManager.user
      ? await QuestUserService.fetchRank(QuestSignedUserManager.user.user_id)
      : 0;
    this.store.set("rank", rank);
    this.rankDisplay.text = String(rank);
  }
}
