import { Message } from "discord.js";

export function parseInvoice(message: Message) {
    let embeds = message.embeds;
    if (embeds.length == 0) {
        return {
            error: "Faktura nemá žádný embed.",
        };
    }
    let embed = embeds[0];
    let description = embed.description;
    if (description == undefined) {
        return {
            error: "Embed faktury nemá popis.",
        };
    }
    const match = description.match(
        /Zaměstnanec: (.*)\nCena: (\d+)\$\nHráči: <@(.*?)> \[(.*?)\]\nPopis: (.*)/
    );
    if (!match) {
        return {
            error: "Faktura není ve správném formátu.",
        };
    }

    const employee = match[1];
    const price = parseInt(match[2]);
    const targetDiscordId = match[3];
    const player = match[4];
    const text = match[5];

    return {
        employee: employee,
        price: price,
        targetDiscordId: targetDiscordId,
        player: player,
        text: text,
    };
}
