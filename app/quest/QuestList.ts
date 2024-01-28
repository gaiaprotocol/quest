import { DomNode, ListLoadingBar, Store } from "@common-module/app";
import Quest from "../database-interface/Quest.js";
import QuestSignedUserManager from "../user/QuestSignedUserManager.js";
import QuestListItem from "./QuestListItem.js";
import QuestService from "./QuestService.js";

export default class QuestList extends DomNode {
  private store = new Store("quest-list");
  private lastCreatedAt: string | undefined;

  constructor() {
    super(".quest-list");

    const cachedQuests = this.store.get<Quest[]>("cached-quests");
    if (cachedQuests && cachedQuests.length > 0) {
      for (const quest of cachedQuests) {
        this.append(new QuestListItem(quest));
      }
    }

    this.refresh();
  }

  private async refresh() {
    this.append(new ListLoadingBar());

    const quests = await QuestService.fetchQuests(
      QuestSignedUserManager.user?.user_id,
      this.lastCreatedAt,
    );

    this.store.set("cached-quests", quests, true);

    if (!this.deleted) {
      this.empty();
      for (const quest of quests) {
        this.append(new QuestListItem(quest));
      }
      this.lastCreatedAt = quests[quests.length - 1]?.created_at;
    }
  }
}
