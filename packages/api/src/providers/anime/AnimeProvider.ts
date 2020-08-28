import { AnilistAnime } from "../../anilist";

export default interface AnimeProvider {
    animeToProviderId(anime: AnilistAnime): Promise<string>;
    episodeToProviderId(anime: AnilistAnime, number: number): Promise<string>;
    getVideoUrl(animeId: string, episodeId: string): Promise<string>;
}