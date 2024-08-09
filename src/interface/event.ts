import { InteractionResponse, Message } from "discord.js";

export default interface Event {
  name: string;
  once?: boolean;
  execute(
    ...args: any[]
  ): void | Promise<void | InteractionResponse<boolean> | Message<boolean>>;
}
