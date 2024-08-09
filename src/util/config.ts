import { iConfig } from "../interface";

const config: iConfig = {
  secrets: {
    prefix: "b.",
    id: process.env.BOT_ID,
    guild: process.env.BOT_GUILD,
    token: process.env.BOT_TOKEN,
    mode: process.env.BOT_MODE,
    owner: process.env.BOT_OWNER,
    log: process.env.LOG_CHANNEL,
    devs: ["757912235908661299", "1223073273022124187"],
  },
  colors: {
    red: 0xfc0303,
    pink: 0xff9191,
    green: 0x03fc0f,
    yellow: 0xfcf803,
    primary: 0x031cfc,
  },
  settings: {
    dashboard: false,
  },
};

export default config;
