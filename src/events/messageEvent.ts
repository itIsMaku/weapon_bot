import { Message, MessageEmbed, TextChannel } from "discord.js";
import config from "../../config.json";
import { onEvent } from "../abstract/event";
import { client } from "../app";
import { Faction } from "../types";
import logger from "../utils/logger";
import { parseCrafting, parseInvoice, parseShop } from "../utils/parser";
import axios from "axios";
import { factions } from "../factions";

export function sendErrorLog(title: string, content: string, faction: Faction) {
    let guild = client.guilds.resolve(faction.guild);
    // console.log(guild);
    if (guild == undefined) return;
    // console.log(faction.errorlog);
    let channel = guild.channels.resolve(faction.errorlog);
    // console.log(channel);
    if (channel == undefined) return;
    // console.log(channel instanceof TextChannel);
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
    let faction = undefined;
    for (const factionId in factions) {
        let tempFaction: Faction = factions[factionId];
        if (tempFaction.guild != guild) {
            logger.error("Faction guild is not the same as message guild.");
            continue;
        }
        faction = tempFaction;
        faction.id = factionId;
    }
    if (faction == undefined) return;
    if (faction.crafting == channel) {
        let crafting = parseCrafting(message);
        if (crafting.error != undefined) {
            sendErrorLog(
                "Chyba při zpracování Craftingu",
                crafting.error,
                faction
            );
            return;
        }
        const res = axios.post(
            `${config.api.url}/api/faction/${faction.id}/crafting`,
            crafting,
            {
                headers: {
                    "Content-Type": "application/json",
                    authorization: config.api.token,
                },
            }
        );
        res.catch((error) => {
            console.log(error);
        });
    } else if (faction.invoices.includes(channel)) {
        let invoice = parseInvoice(message);
        if (invoice.error != undefined) {
            sendErrorLog(
                "Chyba při zpracování Faktury",
                invoice.error,
                faction
            );
            return;
        }
        const res = axios.post(
            `${config.api.url}/api/faction/${faction.id}/invoices`,
            invoice,
            {
                headers: {
                    "Content-Type": "application/json",
                    authorization: config.api.token,
                },
            }
        );
        res.catch((error) => {
            console.log(error);
        });
    } else if (faction.shop == channel) {
        let shop = parseShop(message);
        if (shop.error != undefined) {
            sendErrorLog(
                "Chyba při zpracování Samoobsluhy",
                shop.error,
                faction
            );
            return;
        }
        const res = axios.post(
            `${config.api.url}/api/faction/${faction.id}/shop`,
            shop,
            {
                headers: {
                    "Content-Type": "application/json",
                    authorization: config.api.token,
                },
            }
        );
        res.catch((error) => {
            console.log(error);
        });
    }
});
