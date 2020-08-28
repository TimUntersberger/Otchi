import AnimeProvider from "./AnimeProvider";
import { AnilistAnime } from "../../anilist";
import GogoAnime from "../../scrapers/GogoAnime";
import { scrapeClient } from "../..";

const ga = new GogoAnime();

const animeIdCache: any = {};
const episodeIdCache: any = {};

class GogoAnimeProvider implements AnimeProvider {
    async animeToProviderId(anime: AnilistAnime): Promise<string> {
        const cacheKey = anime.romajiTitle;
        const cacheResult = animeIdCache[cacheKey];
        if (cacheResult) {
            return cacheResult;
        }
        const results = await ga.search(anime.title);
        let result = results[0];
        if (result.slug.endsWith("-dub")) {
            result = results[1];
        }
        animeIdCache[cacheKey] = result.id;
        return result.id;
    }
    async episodeToProviderId(anime: AnilistAnime, number: number): Promise<string> {
        const cacheKey = anime.romajiTitle + "-" + number;
        const cacheResult = episodeIdCache[cacheKey];
        if (cacheResult) {
            return cacheResult;
        }
        const id = animeIdCache[anime.romajiTitle];
        const episodes = await ga.getEpisodes(id);
        const episode = episodes.find(e => e.number == number)?.id!;
        episodeIdCache[cacheKey] = episode;
        return episode;
    }
    async getVideoUrl(animeId: string, episodeId: string): Promise<string> {
        const result = await ga.download(animeId, episodeId, scrapeClient)
        return result.video;
    }
}

export default GogoAnimeProvider;