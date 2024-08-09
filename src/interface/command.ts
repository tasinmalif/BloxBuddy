import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  AutocompleteInteraction,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  PermissionResolvable,
} from "discord.js";
import Bot from "../client";

export default interface Command {
  name: string;
  description: string;
  cooldown: number;
  ownerCmd?: boolean;
  devCmd?: boolean;
  guildCmd?: boolean;
  dmCmd?: boolean;
  prefix?: boolean;
  slash?: boolean;
  secret?: boolean;
  category?: string;
  aliases?: string[];
  type?: ApplicationCommandType;
  options?: Object[] | ApplicationCommandOptionData[];
  permissions?: {
    bot?: PermissionResolvable | PermissionResolvable[];
    member?: PermissionResolvable | PermissionResolvable[];
  };
  autocomplete?(
    client: Bot,
    interaction: AutocompleteInteraction
  ): Promise<void>;
  execute?(
    client: Bot,
    interaction?: CommandInteraction | any,
    args?: CommandInteractionOptionResolver
  ): Promise<void>;
  run?(client: Bot, message: Message, args?: string[]): Promise<Message | void>;
}
