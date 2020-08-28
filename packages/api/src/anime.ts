import express from "express";
import { ScrapeClient } from "./scrapers/client";
import * as Anilist from "./anilist";
import logger from "./logger";
import AnimeProvider from "./providers/anime/AnimeProvider";
import GogoAnimeProvider from "./providers/anime/GogoAnime";

const provider: AnimeProvider = new GogoAnimeProvider();

export default () =>
    express
        .Router()
        .get("/search", async (req, res) => {
            const text = decodeURIComponent(req.query.text as string) ?? "";
            const page = Number(req.query.page || 0);
            logger.debug(`Searching for ${text} page ${page}`);
            const result = await Anilist.search("ANIME", text, page);

            res.status(200).json(result);
        })
        .get("/byId", async (req, res) => {
            const ids = String(req.query.ids).split(",").map(x => Number(x));
            const result = await Anilist.getByIds("ANIME", ids);
            res.status(200).json(result);
        })
        .get("/:id", async (req, res) => {
            const id = Number(req.params.id);
            const result = await Anilist.getById("ANIME", id);
            res.status(200).json(result);
        })
        .get("/:id/:episode", async (req, res) => {
            const id = Number(req.params.id);
            const episode = Number(req.params.episode);
            try {
                const anime = await Anilist.getById("ANIME", id);
                logger.debug(`Trying to find '${anime.romajiTitle}'`);
                const animeId = await provider.animeToProviderId(anime);
                logger.debug(`Found anime: ${animeId}`);
                const episodeId = await provider.episodeToProviderId(
                    anime,
                    episode
                );
                logger.debug(`Found episode: ${episodeId}`);
                const videoUrl = await provider.getVideoUrl(animeId, episodeId);
                logger.debug(`Found videoUrl ${videoUrl}`);
                res.status(200).json({
                    video: videoUrl,
                });
            } catch (error) {
                logger.error(error.message);
                res.status(500).json({
                    error: error.message,
                });
            }
        });
