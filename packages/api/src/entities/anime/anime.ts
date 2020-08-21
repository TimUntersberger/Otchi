import Episode from "./episode";

/**
 * @property id String
 * @property title String
 * @property slug String
 * @property cover String
 * @property episodes Episode[]
 * @property description String
 */
export default class Anime {
    id: string;
    title: string;
    slug: string;
    cover: string;
    description: string;
    episodes: Episode[];

    constructor() {
        this.id = "";
        this.title = "";
        this.slug = "";
        this.cover = "";
        this.episodes = [];
        this.description = "";
    }

    episode(number: number): Episode | undefined {
        return this.episodes.find((e) => e.number == number);
    }
}
