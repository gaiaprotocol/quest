import {
  BodyNode,
  DomNode,
  el,
  MaterialIcon,
  msg,
  NavBar,
  View,
  ViewParams,
} from "@common-module/app";
import TitleBar from "./TitleBar.js";

export default class Layout extends View {
  private static current: Layout;

  public static append(node: DomNode): void {
    Layout.current.content.append(node);
  }

  private navBar: NavBar;
  private titleBar: TitleBar;
  private content: DomNode;

  constructor(params: ViewParams, uri: string) {
    super();
    Layout.current = this;

    BodyNode.append(
      this.container = el(
        ".layout",
        this.navBar = new NavBar({
          logo: el("img", { src: "/images/logo-nav.png" }),
          menu: [
            {
              id: "quests",
              icon: new MaterialIcon("local_activity"),
              title: "Quests",
              uri: "/quests",
            },
            {
              id: "leaderboard",
              icon: new MaterialIcon("leaderboard"),
              title: "Leaderboard",
              uri: "/leaderboard",
            },
          ],
        }),
        el(
          "main",
          this.titleBar = new TitleBar(),
          this.content = el("section.content"),
        ),
      ),
    );

    this.changeUri(uri);
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.changeUri(uri);
  }

  private changeUri(uri: string): void {
    if (uri === "") uri = "quests";

    uri = uri.substring(
      0,
      uri.indexOf("/") === -1 ? uri.length : uri.indexOf("/"),
    );

    this.navBar.active(uri);
    this.titleBar.changeTitle(uri);
  }
}
