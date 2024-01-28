import { DateUtil, DomNode, el } from "@common-module/app";
import Quest from "../database-interface/Quest.js";

export default class QuestListItem extends DomNode {
  constructor(quest: Quest) {
    super(".quest-list-item");

    const formattedStartDate = quest.start_date
      ? DateUtil.format(quest.start_date)
      : "Starts anytime";
    const formattedEndDate = quest.end_date
      ? DateUtil.format(quest.end_date)
      : "Indefinite";
    const durationText = `${formattedStartDate} - ${formattedEndDate}`;

    this.append(
      el(".points", `${quest.points} points`),
      el(".title", quest.title),
      el(".participant-count", `${quest.participant_count} participants`),
      el(".duration", durationText),
      el(".archived", quest.is_achieved ? "Archived" : "Active"),
    );
  }
}
