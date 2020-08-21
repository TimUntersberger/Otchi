import ky from "ky";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_SERVER = (window as any).API_SERVER as string;

export interface Episode {
  number: number;
}

export interface Anime {
  id: string;
  title: string;
  slug: string;
  cover: string;
  episodes: Episode[];
  description: string;
}

export default {
  anime: {
    search(text: string, page = 1) {
      return ky
        .get(
          `${API_SERVER}/anime/search?text=${encodeURIComponent(
            text
          )}&page=${page}`
        )
        .json<Anime[]>();
    },
    download(anime: string, episode: number) {
      return ky.get(`${API_SERVER}/anime/${anime}/${episode}`).json<{
        video: string;
      }>();
    },
    async getEpisodes(anime: Anime): Promise<Episode[]> {
      const j = await ky.get(`${API_SERVER}/anime/${anime.id}`).json<Anime>();
      return j.episodes;
    }
  }
};
