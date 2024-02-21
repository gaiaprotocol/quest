import { response, serveWithOptions } from "../_shared/cors.ts";
import supabase, { getSignedUser } from "../_shared/supabase.ts";

async function fetchGuildMember(guildId: string, userId: string) {
  const response = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bot ${Deno.env.get("DISCORD_BOT_TOKEN")}`,
      },
    },
  );
  if (response.status !== 200) {
    throw new Error(`Failed to fetch for user ${userId}`);
  }
  return response.json();
}

serveWithOptions(async (req) => {
  const { questId, targetDiscordUserId } = await req.json();
  if (!questId) throw new Error("Missing questId");

  const { data: questData, error: questError } = await supabase.from("quests")
    .select().eq(
      "id",
      questId,
    )
    .single();
  if (questError) throw questError;
  if (questData.start_date && new Date(questData.start_date) > new Date()) {
    throw new Error("Mission not started");
  }
  if (questData.end_date && new Date(questData.end_date) < new Date()) {
    throw new Error("Mission ended");
  }

  const { data: missionData, error: missionError } = await supabase.from(
    "missions",
  ).select().eq(
    "quest_id",
    questId,
  );
  if (missionError) throw missionError;
  if (!missionData) throw new Error("Mission not found");

  const user = targetDiscordUserId ? undefined : await getSignedUser(req);
  if (!targetDiscordUserId && !user) throw new Error("Unauthorized");

  const { data: usersPublicData, error: usersPublicError } = targetDiscordUserId
    ? await supabase
      .from("users_public").select("user_id, wallet_address, discord_user_id")
      .eq(
        "discord_user_id",
        targetDiscordUserId,
      )
    : await supabase
      .from("users_public").select("user_id, wallet_address, discord_user_id")
      .eq(
        "user_id",
        user?.id,
      );
  if (usersPublicError) throw usersPublicError;

  const userPublic = usersPublicData?.[0];
  const walletAddress = userPublic.wallet_address;
  const discordUserId = userPublic.discord_user_id;

  const { data: missionAchievementsData, error: missionAchievementsError } =
    await supabase
      .from("mission_achievements").select(
        "mission_id",
      ).in(
        "mission_id",
        missionData.map((mission) => mission.id),
      ).eq(
        "user_id",
        userPublic.user_id,
      );
  if (missionAchievementsError) throw missionAchievementsError;

  let achieved = true;
  for (const mission of missionData) {
    const missionAchievement = missionAchievementsData?.find((achievement) =>
      achievement.mission_id === mission.id
    );
    if (!missionAchievement) {
      if (mission.type === "join_discord") { // check if user has joined the discord server
        try {
          const guildMember = await fetchGuildMember(
            mission.criteria.target_discord_guild_id,
            discordUserId,
          );
          console.log(guildMember);
          if (guildMember) {
            const { error } = await supabase.from("mission_achievements")
              .insert({
                mission_id: mission.id,
                user_id: userPublic.user_id,
                discord_user_id: discordUserId,
                wallet_address: walletAddress,
              });
            if (error) throw error;
          } else {
            achieved = false;
          }
        } catch (error) {
          console.log(error);
          achieved = false;
        }
      } else {
        achieved = false;
      }
    }
  }

  if (achieved) {
    const { error } = await supabase.from("quest_achievements").insert({
      quest_id: questId,
      user_id: userPublic.user_id,
      discord_user_id: discordUserId,
      wallet_address: walletAddress,
    });
    if (error) throw error;
  }

  return response({ achieved });
});
