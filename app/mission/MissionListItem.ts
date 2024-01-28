import { DomNode } from "@common-module/app";
import Mission from "../database-interface/Mission.js";

export default class MissionListItem extends DomNode {
  constructor(mission: Mission) {
    super(".mission-list-item");
    this.append(mission.title);
  }
}
