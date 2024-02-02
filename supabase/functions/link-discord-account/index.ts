import { serveWithOptions } from "../_shared/cors.ts";
import supabase, { getSignedUser } from "../_shared/supabase.ts";

const DISCORD_CLIENT_ID = Deno.env.get("DISCORD_CLIENT_ID")!;
const DISCORD_REDIRECT_URI = Deno.env.get("DISCORD_REDIRECT_URI")!;
const DISCORD_SECRET = Deno.env.get("DISCORD_SECRET")!;

async function fetchDiscordUserByCode(
  code: string,
): Promise<{ id: string } | null> {
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      scope: "identify",
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: DISCORD_REDIRECT_URI,
      code,
      client_secret: DISCORD_SECRET,
    }),
  });
  if (tokenResponse.status !== 200) {
    throw new Error("Failed to fetch access token");
  }
  const tokenResult = await tokenResponse.json();

  const userResponse = await fetch(
    `https://discord.com/api/users/@me`,
    {
      headers: {
        Authorization: `Bearer ${tokenResult.access_token}`,
      },
    },
  );
  if (userResponse.status !== 200) throw new Error("Failed to fetch user");
  return userResponse.json();
}

serveWithOptions(async (req) => {
  const { code } = await req.json();
  if (!code) throw new Error("No code provided");

  const user = await getSignedUser(req);
  if (!user) throw new Error("Unauthorized");

  const discordUser = await fetchDiscordUserByCode(code);
  if (!discordUser) throw new Error("Failed to fetch discord user");

  const { error: deleteDiscordAccountError } = await supabase.from(
    "users_public",
  ).update(
    { discord_user_id: null },
  ).eq("discord_user_id", discordUser.id);
  if (deleteDiscordAccountError) throw deleteDiscordAccountError;

  const { error: setDiscordAccountError } = await supabase.from("users_public")
    .update({ discord_user_id: discordUser.id }).eq("user_id", user.id);
  if (setDiscordAccountError) throw setDiscordAccountError;
});
