import cheerio from "cheerio";
import got from "got";
import logger from "../logger";

export default async function scrape(url: string) {
    logger.debug(`Fetching ${url}`);
    const response = await got.get(url);
    logger.debug(`Loading HTML`);
    return cheerio.load(response.body);
}