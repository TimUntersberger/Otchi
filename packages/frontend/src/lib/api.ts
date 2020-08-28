import ky from "ky";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEFAULT_API_SERVER_URL =  process.env.VUE_APP_API_SERVER || (window as any).API_SERVER as string;
export let API_SERVER_URL = DEFAULT_API_SERVER_URL;

export function setApiServerUrl(url: string) {
    API_SERVER_URL = url;
}

export interface Anime {
    id: number;
    title: string;
    romajiTitle: string;
    cover: string;
    description: string;
    status: string;
    episodeCount: number | null;
    duration: number;
    genres: string[];
    nextEpisodeEta: number | null;
    nextEpisodeNumber: number | null;
}

export interface Chapter {
    id: string;
    number: number;
    title: string;
}


export interface Novel {
    title: string;
    slug: string;
    description: string;
    cover: string;
    _chapters: Chapter[];
}

export default {
    anime: {
        search(text: string, page = 1) {
            return ky.get(`${API_SERVER_URL}/anime/search?text=${encodeURIComponent(text)}&page=${page}`).json<Anime[]>()
        },
        getByIds(ids: number[]) {
            return ky.get(`${API_SERVER_URL}/anime/byId?ids=${ids.join(",")}`).json<Anime[]>()
        },
        getVideoUrl(animeId: number, episode: number) {
            return ky.get(`${API_SERVER_URL}/anime/${animeId}/${episode}`, {
                timeout: false
            }).json<{
                video: string
            }>()
        }
    },
    novel: {
        search(text: string, page = 1) {
            return ky.get(`${API_SERVER_URL}/novel/search?text=${encodeURIComponent(text)}&page=${page}`).json<Novel[]>()
        },
        async content(novel: string, chapter: string) {
            return ky.get(`${API_SERVER_URL}/novel/${novel}/${chapter}`, {
                timeout: false
            }).json<string[]>()
        },
        async getBySlug(slug: string): Promise<Novel> {
            return ky.get(`${API_SERVER_URL}/novel/${slug}`).json<Novel>();
        },
        async getChapters(novel: Novel): Promise<Chapter[]> {
            const j = await ky.get(`${API_SERVER_URL}/novel/${novel.slug}`).json<Novel>();
            return j._chapters;
        }
    }
}

