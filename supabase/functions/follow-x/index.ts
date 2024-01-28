import { serveWithOptions } from "../_shared/cors.ts";
import supabase, { getSignedUser } from "../_shared/supabase.ts";

serveWithOptions(async (req) => {
  const { missionId, targetXUsername } = await req.json();
  if (!missionId || !targetXUsername) {
    throw new Error("Missing missionId or targetXUsername");
  }

  const { data: missionData, error: missionError } = await supabase.from(
    "missions",
  ).select().eq(
    "id",
    missionId,
  )
    .single();
  if (missionError) throw missionError;
  if (!missionData) throw new Error("Mission not found");
  if (missionData.type !== "follow_x") {
    throw new Error("Mission is not follow_x");
  }
  if (missionData.criteria?.target_x_username !== targetXUsername) {
    throw new Error("Target X username does not match");
  }

  const user = await getSignedUser(req);
  if (!user) throw new Error("Unauthorized");

  const { data: usersPublicData, error: usersPublicError } = await supabase
    .from("users_public").select("wallet_address").eq("user_id", user.id);
  if (usersPublicError) throw usersPublicError;
  const walletAddress = usersPublicData?.[0]?.wallet_address;

  const { error } = await supabase.from("mission_achievements").insert({
    mission_id: missionId,
    user_id: user.id,
    wallet_address: walletAddress,
  });
  if (error) throw error;
});
