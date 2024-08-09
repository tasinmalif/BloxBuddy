import { Events } from "discord.js";
import Bot from "../../client";
import { iEvent } from "../../interface";

const Event: iEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: Bot) {
    client.logger.put(`${client.user?.tag} is ready`, "client");
  },
};

export default Event;
