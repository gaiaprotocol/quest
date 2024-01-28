import { DateUtil, DomNode, el, View, ViewParams } from "@common-module/app";
import Quest from "../database-interface/Quest.js";
import Layout from "../layout/Layout.js";
import MissionList from "../mission/MissionList.js";
import QuestService from "./QuestService.js";

export default class QuestView extends View {
  private currentQuestId: number | undefined;
  private questInfo: DomNode;
  private missionContainer: DomNode;

  constructor(params: ViewParams, uri: string, data?: any) {
    super();

    Layout.append(
      this.container = el(
        ".quest-view",
        this.questInfo = el(".quest-info"),
        this.missionContainer = el(".mission-container"),
      ),
    );

    this.render(parseInt(params.questId!), data);
    this.container.onWindow("visibilitychange", () => this.checkAchievements());
  }

  public changeParams(params: ViewParams, uri: string, data?: any): void {
    this.render(parseInt(params.questId!), data);
  }

  private async render(questId: number, quest?: Quest) {
    this.currentQuestId = questId;
    this.questInfo.empty();
    quest ? this.renderQuest(quest) : this.fetchQuest(questId);
    this.missionContainer.empty().append(new MissionList(questId));
    this.checkAchievements();
  }

  private async fetchQuest(questId: number) {
    const quest = await QuestService.fetchQuest(questId);
    if (quest) this.renderQuest(quest);
  }

  private async renderQuest(quest: Quest) {
    const formattedStartDate = quest.start_date
      ? DateUtil.format(quest.start_date)
      : "Starts anytime";
    const formattedEndDate = quest.end_date
      ? DateUtil.format(quest.end_date)
      : "Indefinite";
    const durationText = `${formattedStartDate} - ${formattedEndDate}`;

    this.questInfo.empty().append(
      el(
        "header",
        el("h1", quest.title),
        quest.is_achieved
          ? el(".achieved", "Achieved!")
          : el(".not-achieved", "Not achieved"),
      ),
      el("p", quest.description),
      el(
        ".details",
        el(".participant-count", `${quest.participant_count} participants`),
        el(".duration", durationText),
      ),
    );
  }

  private async checkAchievements() {
    if (document.visibilityState !== "visible") return;
    console.log(this.currentQuestId);
    //TODO: check achievements
  }
}
