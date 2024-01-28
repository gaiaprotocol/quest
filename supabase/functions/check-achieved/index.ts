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
  const { questId } = await req.json();
  if (!questId) throw new Error("Missing questId");

  const { data: missionData, error: missionError } = await supabase.from(
    "missions",
  ).select().eq(
    "quest_id",
    questId,
  );
  if (missionError) throw missionError;
  if (!missionData) throw new Error("Mission not found");

  const user = await getSignedUser(req);
  if (!user) throw new Error("Unauthorized");

  const { data: usersPublicData, error: usersPublicError } = await supabase
    .from("users_public").select("wallet_address, discord_user_id").eq(
      "user_id",
      user.id,
    );
  if (usersPublicError) throw usersPublicError;
  const walletAddress = usersPublicData?.[0]?.wallet_address;
  const discordUserId = usersPublicData?.[0]?.discord_user_id;

  let achieved = true;
  for (const mission of missionData) {
    if (!mission.is_achieved) {
      if (mission.type === "join_discord") { // check if user has joined the discord server
        try {
          const guildMember = await fetchGuildMember(
            mission.criteria.target_discord_guild_id,
            discordUserId,
          );
          if (guildMember) {
            const { error } = await supabase.from("mission_achievements")
              .insert({
                mission_id: mission.id,
                user_id: user.id,
                wallet_address: walletAddress,
              });
            if (error) throw error;
          } else {
            achieved = false;
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      achieved = false;
    }
  }

  if (achieved) {
    const { error } = await supabase.from("quest_achievements").insert({
      quest_id: questId,
      user_id: user.id,
      wallet_address: walletAddress,
    });
    if (error) throw error;
  }

  return response({ achieved });
});
