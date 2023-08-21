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
        /Zaměstnanec: <@(.*?)> \[(.*?)\]\nCena: (\d+)\$\nHráči: <@(.*?)> \[(.*?)\]\nPopis: (.*)/
    );
    if (!match) {
        return {
            error: "Faktura není ve správném formátu.",
        };
    }

    const employeeId = match[1];
    const employee = match[2];
    const price = parseInt(match[3]);
    const targetId = match[4];
    const target = match[5];
    const text = match[6];

    return {
        employee: employee,
        employee_id: employeeId,
        price: price,
        target: target,
        target_id: targetId,
        description: text,
    };
}

export function parseCrafting(message: Message) {
    let embeds = message.embeds;
    if (embeds.length == 0) {
        return {
            error: "Crafting nemá žádný embed.",
        };
    }
    let embed = embeds[0];
    let description = embed.description;
    if (description == undefined) {
        return {
            error: "Embed craftingu nemá popis.",
        };
    }
    const match = description.match(
        /`IC Jméno:` (.*)\n`OOC Jméno:` (.*)\n`CharID:` (.*)\n`Steam HEX:` (.*)\n`Item:` (.*)\n`Peníze:` (\d+)\n`Součástky:` (\d+)/
    );
    if (!match) {
        return {
            error: "Crafting není ve správném formátu.",
        };
    }

    const icName = match[1];
    const oocName = match[2];
    const charId = match[3];
    const steamHex = match[4];
    const item = match[5];
    const money = parseInt(match[6]);
    const components = parseInt(match[7]);

    return {
        ic_name: icName,
        ooc_name: oocName,
        charid: charId,
        steam_hex: steamHex,
        item: item,
        price: money,
        weapon_pieces: components,
    };
}

export function parseShop(message: Message) {
    let embeds = message.embeds;
    if (embeds.length == 0) {
        return {
            error: "Samoobsluha nemá žádný embed.",
        };
    }
    let embed = embeds[0];
    let description = embed.description;
    if (description == undefined) {
        return {
            error: "Embed samoobsluhy nemá popis.",
        };
    }
    const match = description.match(
        /Peníze do kasy: (\d+)\nItem: (.*)\nPočet: (\d+)\nCharID: (.*)\nOOC Jméno: (.*)\nIC Jméno: (.*)/
    );
    if (!match) {
        return {
            error: "Samoobsluha není ve správném formátu.",
        };
    }

    const money = parseInt(match[1]);
    const item = match[2];
    const count = parseInt(match[3]);
    const charId = match[4];
    const oocName = match[5];
    const icName = match[6];

    return {
        ic_name: icName,
        ooc_name: oocName,
        charid: charId,
        item: item,
        price: money,
        count: count,
    };
}
