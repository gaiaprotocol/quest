import initialize from "./initialize.js";
await initialize({
  //dev: true,
  dev: false,

  supabaseUrl: "https://puzqwmqigcbgmzzpqlws.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1enF3bXFpZ2NiZ216enBxbHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYyNzE4NDAsImV4cCI6MjAyMTg0Nzg0MH0.wzrq8FNyI_USiM-gFpdk7hQFhs56LbY_gDD7j0cpBVY",

  discordAuthUrl:
    "https://discord.com/api/oauth2/authorize?client_id=1202603223752376320&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8413&scope=guilds.members.read+identify",

  walletConnectProjectId: "943c60f6f763eb9cac10467c34336eaa",
  messageForWalletLinking: "Link Wallet to Gaia Quest",
});
