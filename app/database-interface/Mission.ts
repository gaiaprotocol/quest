export enum MissionType {
  FOLLOW_X = "follow_x",
  JOIN_DISCORD = "join_discord",
}

export default interface Mission {
  id: number;
  quest_id: number;
  type: MissionType;
  criteria: {
    target_x_username?: string;
    target_discord_url?: string;
    target_discord_guild_id?: string;
  };
  title: string;
  description: string;
  points: number;
  created_at: string;
  updated_at?: string;

  is_achieved?: boolean;
}
