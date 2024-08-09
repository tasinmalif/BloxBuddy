import { ButtonInteraction, InteractionResponse } from "discord.js";
import Bot from "../client";

export default interface Button {
  id: string;
  execute?(
    client: Bot,
    interaction?: ButtonInteraction
  ): Promise<InteractionResponse<boolean> | void> | void;
}
