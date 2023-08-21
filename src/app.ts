import { Intents } from "discord.js";
import { Client } from "discordx";
import config from "../config.json";
import logger from "./utils/logger";
import { registerEvents } from "./abstract/event";
import axios from "axios";
import { cacheFactions, updater } from "./factions";

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
    registerEvents();

    logger.info("Bot | Successfully started.");

    cacheFactions();
    updater();
});

client.login(config.bot.token);
