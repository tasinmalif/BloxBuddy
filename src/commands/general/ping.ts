import { ApplicationCommandType } from "discord.js";
import { iCommand } from "../../interface";

const Command: iCommand = {
  name: "ping",
  aliases: ["pong"],
  prefix: false,
  slash: true,
  category: "general",
  cooldown: 5,
  description: "replies with pong!",
  permissions: {
    member: ["SendMessages"],
  },
  type: ApplicationCommandType.ChatInput,
  async execute(client, interaction) {
    await interaction.reply("Pong!");
  },
};

export default Command;
