export default interface Config {
  dev: boolean;

  supabaseUrl: string;
  supabaseAnonKey: string;

  discordAuthUrl: string;

  walletConnectProjectId: string;
  messageForWalletLinking: string;
}
