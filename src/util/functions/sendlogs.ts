import { TextChannel, EmbedBuilder } from "discord.js";

export async function sendError(channel: TextChannel, message: string) {
  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("Error")
    .setDescription(message)
    .setTimestamp();

  await channel.send({
    embeds: [embed],
  });
}
