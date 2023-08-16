import { Intents } from "discord.js";
import { Client } from "discordx";
import config from "../config.json";
import logger from "./utils/logger";

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
});

client.on("ready", async () => {
    await client.initApplicationCommands();

    logger.info("Bot successfully started.");
});

client.login(config.bot.token);
