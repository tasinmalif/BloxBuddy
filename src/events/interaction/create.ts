import {
  Events,
  CommandInteraction,
  InteractionResponse,
  ButtonInteraction,
  EmbedBuilder,
  ChannelType,
} from "discord.js";
import { iEvent, iCommand } from "../../interface";
import { checkCooldown, sendError, setCooldown } from "../../util/functions";

import Bot from "../../client";

const Event: iEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(
    client: Bot,
    interaction: CommandInteraction | ButtonInteraction
  ): Promise<void | InteractionResponse<boolean>> {
    if (interaction.isChatInputCommand()) {
      const command = client.commands
        .filter((cmd: iCommand) => cmd.slash)
        .get(interaction.commandName);
      if (!command) return;
      const now = Date.now();
      const cooldownAmount = (command.cooldown ?? 3) * 1000;
      const remainingCooldown = await checkCooldown(
        command.name,
        interaction.user.id
      );
      if (remainingCooldown > 0) {
        const expiredTimestamp = Math.round((now + remainingCooldown) / 1000);
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `❌ | Please wait, you are on a cooldown for </${interaction.commandName}:${interaction.commandId}> command. You can use this command again <t:${expiredTimestamp}:R>.`
              )
              .setColor("#ff0000"),
          ],
          ephemeral: true,
        });
      }
      await setCooldown(command.name, interaction.user.id, cooldownAmount);
      try {
        command.execute(client, interaction);
      } catch (err) {
        const channel = await client.channels
          .fetch(client.config.secrets.log)
          .catch(console.error);
        if (channel && channel.type == ChannelType.GuildText) {
          await sendError(
            channel,
            err.message ??
              `Something went wrong, could not execute the ${command.name} command.`
          );
        }
        client.logger.error(err, "client");
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try {
        button.execute(client, interaction);
      } catch (err) {
        const channel = await client.channels
          .fetch(client.config.secrets.log)
          .catch(console.error);
        if (channel && channel.type == ChannelType.GuildText) {
          await sendError(
            channel,
            err.message ??
              `Something went wrong, could not execute the \`${button.id}\` button.`
          );
        }
        client.logger.error(err, "client");
      }
    }
  },
};

export default Event;
