import { Message, MessageEmbed, TextChannel } from "discord.js";
import config from "../../config.json";
import { onEvent } from "../abstract/event";
import { client } from "../app";
import { Faction } from "../types";
import logger from "../utils/logger";
import { parseInvoice } from "../utils/parseInvoice";
import axios from "axios";

function sendErrorLog(title: string, content: string, faction: Faction) {
    let guild = client.guilds.resolve(faction.guild);
    console.log(guild);
    if (guild == undefined) return;
    console.log(faction.errorlog);
    let channel = guild.channels.resolve(faction.errorlog);
    console.log(channel);
    if (channel == undefined) return;
    console.log(channel instanceof TextChannel);
    if (!(channel instanceof TextChannel)) return;

    const errorEmbed = new MessageEmbed()
        .setTitle(
            `${title} (${new Date().toLocaleString()}) - ${faction.title}`
        )
        .setDescription(content)
        .setColor("#ff0000");

    channel.send({ embeds: [errorEmbed] });
}

export const event = onEvent("messageCreate", (message) => {
    let guild = message.guildId;
    if (guild == undefined) return;
    let channel = message.channelId;
    let factions: { [index: string]: any } = config.factions;
    let faction = undefined;
    for (const factionId in factions) {
        let tempFaction: Faction = factions[factionId];
        if (tempFaction.guild != guild) {
            continue;
        }
        faction = tempFaction;
    }
    if (faction == undefined) return;
    if (faction.crafting == channel) {
        logger.info("Crafting channel");
    } else if (faction.invoices.includes(channel)) {
        logger.info("Invoice channel");
        let invoice = parseInvoice(message);
        if (invoice.error != undefined) {
            sendErrorLog(
                "Chyba při zpracování faktury",
                invoice.error,
                faction
            );
            return;
        }
        const res = axios({
            method: "post",
            url: config.api.url + "/invoice",
            headers: {
                "Content-Type": "application/json",
                Authorization: config.api.token,
            },
        });
        console.log(res);
    } else if (faction.shop == channel) {
        logger.info("Shop channel");
    }
});
