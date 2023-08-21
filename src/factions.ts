import axios from "axios";
import logger from "./utils/logger";
import config from "../config.json";

export let factions: { [index: string]: any } = {};

export function cacheFactions() {
    logger.info("Factions | Caching factions from remote...");
    axios
        .get(`${config.api.url}/api/factions`)
        .then((response) => {
            let data = response.data;
            factions = data;
            logger.info("Factions | Successfully cached factions.");
        })
        .catch((error) => catchError(error));
}

function catchError(error: any) {
    logger.error(error);
    factions = {};
}

export function updater() {
    setTimeout(() => {
        cacheFactions();
        updater();
    }, 30 * 1000);
}
