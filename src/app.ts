import { Intents, TextChannel } from "discord.js";
import { Client } from "discordx";
import config from "../config.json";
import logger from "./utils/logger";
import { registerEvents } from "./abstract/event";
import axios from "axios";
import { cacheFactions, factions, updater } from "./factions";
import { parseCrafting, parseInvoice } from "./utils/parser";
import { sendErrorLog } from "./events/messageEvent";

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

    // setTimeout(() => {
    //     let guild = client.guilds.resolve("975469293728849920");
    //     let channel = guild?.channels.resolve("975483118150647838");
    //     if (channel instanceof TextChannel) {
    //         channel.messages
    //             .fetch({ after: "1141366160621834270" })
    //             .then((messages) => {
    //                 messages.forEach((message) => {
    //                     let crafting = parseCrafting(message);
    //                     if (crafting.error != undefined) {
    //                         console.log(crafting.error);
    //                         return;
    //                     }
    //                     const res = axios.post(
    //                         `${config.api.url}/api/faction/weapon/crafting`,
    //                         crafting,
    //                         {
    //                             headers: {
    //                                 "Content-Type": "application/json",
    //                                 authorization: config.api.token,
    //                             },
    //                         }
    //                     );
    //                     res.then((response) => {
    //                         if (response.status == 200) {
    //                             message.react("👌");
    //                             console.log("Crafting success");
    //                         }
    //                     });
    //                     res.catch((error) => {
    //                         console.log(error);
    //                     });
    //                 });
    //                 let last = messages.last();
    //                 if (channel instanceof TextChannel) {
    //                     channel.messages
    //                         .fetch({ after: last?.id })
    //                         .then((messages) => {
    //                             messages.forEach((message) => {
    //                                 let crafting = parseCrafting(message);
    //                                 if (crafting.error != undefined) {
    //                                     console.log(crafting.error);
    //                                     return;
    //                                 }
    //                                 const res = axios.post(
    //                                     `${config.api.url}/api/faction/weapon/crafting`,
    //                                     crafting,
    //                                     {
    //                                         headers: {
    //                                             "Content-Type":
    //                                                 "application/json",
    //                                             authorization: config.api.token,
    //                                         },
    //                                     }
    //                                 );
    //                                 res.then((response) => {
    //                                     if (response.status == 200) {
    //                                         message.react("👌");
    //                                         console.log("Crafting success");
    //                                     }
    //                                 });
    //                                 res.catch((error) => {
    //                                     console.log(error);
    //                                 });
    //                             });
    //                         });
    //                 }
    //             });
    //     }
    // }, 2000);
});

client.login(config.bot.token);
