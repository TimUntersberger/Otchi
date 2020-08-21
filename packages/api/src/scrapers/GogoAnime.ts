import ky from "ky-universal";
import Anime from "../entities/anime/anime";
import scrape from "./scrape";
import Episode from "../entities/anime/episode";
import cheerio from "cheerio";
import { ScrapeClient } from "./client";

export default class GogoAnime {
    async search(text: string, page = 1) {
        const url = `https://gogoanime.pro/search?keyword=${encodeURIComponent(
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
    async load(anime: Anime) {
        const url = `https://www10.gogoanime.pro/ajax/film/servers/${anime.id}?ep=&episode=`;
        //console.log(url);
        let response = await ky.get(url);
        
        if (response.status == 301) {
            //console.log("Domain was moved");
            const newUrl = response.headers.get("location");
            //console.log(`new url: ${newUrl}`);
            if (newUrl) {
                response = await ky.get(newUrl);
            }
        }

        const html = await response.json().then((x) => x.html);
        const $ = cheerio.load(html);
        anime.episodes = $("ul li a")
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
        return anime;
    }
    async download(anime: Anime, episode: Episode, scrapeClient: ScrapeClient) {
        await this.load(anime);

        const results = await Promise.allSettled(
            ["35", "40"]
                .map((p) => ({
                    id: p,
                    url: `https://www10.gogoanime.pro/ajax/episode/info?filmId=${
                        anime.id
                    }&server=${p}&episode=${anime.episode(episode.number)!.id}`,
                }))
                .map(async (x) => ({
                    ...x,
                    json: await ky.get(x.url).json<any>(),
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

        console.log(results)

        if (results.length == 0) {
            throw new Error("Couldn't find a valid provider");
        }

        const provider = results[0];

        console.log(provider);

        await scrapeClient.goto(provider.json.target);

        let video = "";

        if (provider.id == "35") {
            video = await scrapeClient.mp4upload();
        } else if (provider.id == "40") {
            video = await scrapeClient.streamtape();
        }

        return {
            video,
        };
    }
}
