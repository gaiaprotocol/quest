import { SupabaseService } from "@common-module/app";
import Quest from "../database-interface/Quest.js";

class QuestService extends SupabaseService<Quest> {
  constructor() {
    super("quests", "*", 50);
  }
}

export default new QuestService();
