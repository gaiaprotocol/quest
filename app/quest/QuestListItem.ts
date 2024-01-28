import {
  Button,
  DateUtil,
  DomNode,
  el,
  MaterialIcon,
  Router,
} from "@common-module/app";
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
      el(".image", {
        style: {
          backgroundImage: `url(${quest.image})`,
        },
      }),
      el(
        "main",
        el(".points", new MaterialIcon("verified"), `${quest.points} points`),
        el(".title", quest.title),
        el(
          ".details",
          el(".duration", durationText),
          el(".participant-count", `${quest.participant_count} participants`),
        ),
        new Button({
          title: quest.is_achieved ? "Archived" : "Join",
          disabled: quest.is_achieved,
          icon: new MaterialIcon(quest.is_achieved ? "check" : "login"),
        }),
      ),
    );

    this.onDom("click", () => Router.go(`/quest/${quest.id}`));
  }
}
