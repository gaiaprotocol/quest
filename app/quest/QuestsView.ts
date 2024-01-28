import { el, View } from "@common-module/app";
import Layout from "../layout/Layout.js";
import QuestList from "./QuestList.js";

export default class QuestsView extends View {
  constructor() {
    super();
    Layout.append(
      this.container = el(
        ".quests-view",
        new QuestList(),
      ),
    );
  }
}
