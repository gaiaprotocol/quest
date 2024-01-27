import { SupabaseService } from "@common-module/app";
import Mission from "../database-interface/Mission.js";

class MissionService extends SupabaseService<Mission> {
  constructor() {
    super("missions", "*", 50);
  }
}

export default new MissionService();
