import cheerio from "cheerio";
import ky from "ky-universal";

export default async function scrape(url: string) {
    const response = await ky.get(url);
    const html = await response.text();
    return cheerio.load(html);
}