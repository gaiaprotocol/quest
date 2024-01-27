enum MissionType {
  FOLLOW_X = "follow_x",
  JOIN_DISCORD = "join_discord",
}

export default interface Mission {
  quest_id: number;
  type: MissionType;
  criteria: {};
  title: string;
  description: string;
  created_at: string;
  updated_at?: string;
}
