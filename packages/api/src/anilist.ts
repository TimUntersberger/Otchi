import { GraphQLClient, gql } from "graphql-request";
import { Variables } from "graphql-request/dist/types";

export interface AnilistAnime {
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

function mediaToAnilistAnime(x: any): AnilistAnime {
    return {
        id: x.id,
        title: x.title.english,
        romajiTitle: x.title.romaji,
        cover: x.coverImage.large,
        description: x.description,
        status: x.status,
        episodeCount: x.episodes,
        duration: x.duration,
        genres: x.genres,
        nextEpisodeEta: x.nextAiringEpisode?.timeUntilAiring,
        nextEpisodeNumber: x.nextAiringEpisode?.episode
    };
}

const mediaFields = `
    id
    title {
        english
        romaji
    }
    coverImage {
        large
    }
    description
    status
    episodes
    duration
    genres
    nextAiringEpisode {
        timeUntilAiring
        episode
    }
`;

const client = new GraphQLClient("https://graphql.anilist.co");
let fuck = false;

function request<T>(graphql: string, variables: Variables = {}): Promise<T> {
    return new Promise(async (resolve, reject) => {
        if (fuck) {
            reject(new Error("Already hit rate limit"));
        } else {
            try {
                const res = await client.rawRequest(graphql, variables);

                if (res.errors) {
                    reject(res.errors);
                    return;
                }

                const remainingRequests = Number(
                    res.headers.get("X-RateLimit-Remaining")
                );

                if (remainingRequests == 0) {
                    fuck = true;
                }

                resolve(res.data);
            } catch (error) {
                reject(error);
            }
        }
    });
}

export async function getById(
    type: "ANIME" | "MANGA",
    id: number
): Promise<AnilistAnime> {
    const result = await request<any>(
        gql`
            query($id: Int, $type: MediaType) {
                Media(
                    id: $id
                    sort: [POPULARITY_DESC, SCORE_DESC]
                    type: $type
                    isAdult: false
                ) {
                    ${mediaFields}
                }
            }
        `,
        {
            type,
            id
        }
    );

    return mediaToAnilistAnime(result.Media);
}

export async function getByIds(
    type: "ANIME" | "MANGA",
    ids: number[]
): Promise<AnilistAnime> {
    const result = await request<any>(
        gql`
            query($type: MediaType, $length: Int, $ids: [Int]) {
                Page(page: 1, perPage: $length) {
                    media(
                        sort: [POPULARITY_DESC, SCORE_DESC]
                        type: $type
                        id_in: $ids
                        isAdult: false
                    ) {
                        ${mediaFields}
                    }
                }
            }
        `,
        {
            type,
            ids,
            length: ids.length
        }
    );

    return result.Page.media.map(mediaToAnilistAnime);
}

export async function search(
    type: "ANIME" | "MANGA",
    text: string,
    page = 1
): Promise<AnilistAnime[]> {
    const variables: any = {
        page,
        type,
    };

    if (text != "") {
        variables.search = text;
    }

    const result = await request<any>(
        gql`
            query($page: Int, $search: String, $type: MediaType) {
                Page(page: $page, perPage: 20) {
                    media(
                        sort: [POPULARITY_DESC, SCORE_DESC]
                        type: $type
                        search: $search
                        isAdult: false
                    ) {
                        ${mediaFields}
                    }
                }
            }
        `,
        variables
    );

    const animes = result.Page.media.map(mediaToAnilistAnime);

    return animes;
}
