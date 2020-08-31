import got from "got";
import Anime from "../entities/anime/anime";
import scrape from "./scrape";
import Episode from "../entities/anime/episode";
import cheerio from "cheerio";
import { ScrapeClient } from "./client";
import logger from "../logger";

export default class GogoAnime {
    async search(text: string, page = 1) {
        const url = `https://gogoanime.pro/filter?language[]=subbed&keyword=${encodeURIComponent(
            text
        )}&page=${page}`;
        const $ = await scrape(url);
        return $(".items li")
            .toArray()
            .map((e) => {
                const $$ = $(e);
                const cover = $$.find("div.img > a > img").attr("data-src")!;
                const title = $$.find("p.name a").attr("title")!;
                const href = $$.find("p.name a").attr("href")!;
                const tokens = href.split("/").pop()!.split("-");
                const id = tokens.pop()!;
                const slug = tokens.join("-");
                const anime = new Anime();

                anime.title = title;
                anime.cover = cover;
                anime.id = id;
                anime.slug = slug;

                return anime;
            });
    }
    async getEpisodes(id: string) {
        const url = `https://www2.gogoanime.pro/ajax/film/servers/${id}?ep=&episode=`;
        console.log(url);
        let response = await got.get<any>(url, {
            responseType: "json",
        });

        if (response.statusCode == 301) {
            //console.log("Domain was moved");
            const newUrl = response.headers.location;
            //console.log(`new url: ${newUrl}`);
            if (newUrl) {
                response = await got.get(newUrl, {
                    responseType: "json",
                });
            }
        }

        const html = response.body.html;
        const $ = cheerio.load(html);
        return $("#episodes ul li a")
            .toArray()
            .map((e) => ({
                id: e.attribs["data-name"],
                number: e.attribs["data-name-normalized"].replace(/\D/g, ""),
            }))
            .map((x) => {
                const episode = new Episode();
                episode.number = Number(x.number);
                episode.id = x.id;
                return episode;
            });
    }
    async download(
        animeId: string,
        episodeId: string,
        scrapeClient: ScrapeClient
    ) {
        const results = await Promise.allSettled(
            ["35", "40"]
                .map((p) => ({
                    id: p,
                    url: `https://www2.gogoanime.pro/ajax/episode/info?filmId=${animeId}&server=${p}&episode=${episodeId}`,
                }))
                .map(async (x) => ({
                    ...x,
                    json: await got.get(x.url).json<any>(),
                }))
        ).then((results) => {
            let x = [];

            for (const result of results) {
                if (result.status == "fulfilled" && !result.value.json.error) {
                    x.push(result.value);
                }
            }

            return x;
        });

        logger.debug(`Found ${results.length} valid providers`);

        if (results.length == 0) {
            throw new Error("Couldn't find a valid provider");
        }

        const provider = results[0];

        logger.debug(`Found iframeUrl ${provider.json.target}`);
        await scrapeClient.goto(provider.json.target);

        let video = "";

        if (provider.id == "35") {
            logger.debug(`Using mp4upload provider`);
            video = await scrapeClient.mp4upload();
        } else if (provider.id == "40") {
            logger.debug(`Using streamtape provider`);
            video = await scrapeClient.streamtape();
        }

        return {
            video,
        };
    }
}
