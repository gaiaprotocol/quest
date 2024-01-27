import { UserPublic } from "@common-module/app";

export default interface QuestUserPublic extends UserPublic {
  wallet_address?: string;
  x_username?: string;
}
