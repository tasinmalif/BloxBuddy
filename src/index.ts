import "dotenv/config";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import Bimo from "./client";

new Bimo({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
  presence: {
    status: "dnd",
    activities: [
      {
        name: "OVER FRUIT STOCKS",
        type: ActivityType.Watching,
        state: "BEING COOCKED BY ALIF!",
      },
    ],
  },
  allowedMentions: {
    repliedUser: false,
  },
}).start();
