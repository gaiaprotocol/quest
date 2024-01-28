import { DomNode, ListLoadingBar, Store } from "@common-module/app";
import Mission from "../database-interface/Mission.js";
import QuestSignedUserManager from "../user/QuestSignedUserManager.js";
import MissionListItem from "./MissionListItem.js";
import MissionService from "./MissionService.js";

export default class MissionList extends DomNode {
  private store = new Store("mission-list");
  private lastCreatedAt: string | undefined;

  constructor(private questId: number) {
    super(".mission-list");

    const cachedMissions = this.store.get<Mission[]>("cached-missions");
    if (cachedMissions && cachedMissions.length > 0) {
      for (const mission of cachedMissions) {
        this.append(new MissionListItem(mission));
      }
    }

    this.refresh();
  }

  private async refresh() {
    this.append(new ListLoadingBar());

    const missions = await MissionService.fetchMissions(
      this.questId,
      QuestSignedUserManager.user?.user_id,
      this.lastCreatedAt,
    );

    this.store.set("cached-missions", missions, true);

    if (!this.deleted) {
      this.empty();
      for (const mission of missions) {
        this.append(new MissionListItem(mission));
      }
      this.lastCreatedAt = missions[missions.length - 1]?.created_at;
    }
  }
}
