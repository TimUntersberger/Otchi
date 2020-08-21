import { init } from "./index"
import { PuppeteerScrapeClient } from "./scrapers/client";
import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-stealth";

async function main() {
    puppeteer.use(Stealth());
    puppeteer.use(AdBlocker());
    const browser = await puppeteer.launch({
        headless: true
    });

    init(new PuppeteerScrapeClient(browser) ,8080);
}

main();