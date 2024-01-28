import { DomNode, el, View, ViewParams } from "@common-module/app";
import Quest from "../database-interface/Quest.js";
import Layout from "../layout/Layout.js";
import MissionList from "../mission/MissionList.js";
import QuestService from "./QuestService.js";

export default class QuestView extends View {
  private questDisplay: DomNode;
  private missionDisplay: DomNode;

  constructor(params: ViewParams, uri: string, data?: any) {
    super();
    Layout.append(
      this.container = el(
        ".quest-view",
        this.questDisplay = el(".quest-display"),
        this.missionDisplay = el(".mission-display"),
      ),
    );
    this.render(parseInt(params.questId!), data);
  }

  public changeParams(params: ViewParams, uri: string, data?: any): void {
    this.render(parseInt(params.questId!), data);
  }

  private async render(questId: number, quest?: Quest) {
    this.questDisplay.empty();
    quest ? this.renderQuest(quest) : this.fetchQuest(questId);
    this.missionDisplay.empty().append(new MissionList(questId));
  }

  private async fetchQuest(questId: number) {
    const quest = await QuestService.fetchQuest(questId);
    if (quest) this.renderQuest(quest);
  }

  private async renderQuest(quest: Quest) {
    console.log(quest);
  }
}
