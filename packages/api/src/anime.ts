import express from "express";
import GogoAnime from "./scrapers/GogoAnime";
import Anime from "./entities/anime/anime";
import Episode from "./entities/anime/episode";
import { ScrapeClient } from "./scrapers/client";

const ga = new GogoAnime();

export default (scrapeClient: ScrapeClient) => express.Router()
    .get("/search", async (req, res) => {
        const text = decodeURIComponent(req.query.text as string);
        const page = Number(req.query.page || 0);
        const result = await ga.search(text, page);

        res.json(result);
    })
    .get("/:id", async (req, res) => {
        const anime = new Anime();
        anime.id = req.params.id;
        await ga.load(anime);
        res.json(anime);
    })
    .get("/:id/:episode", async (req, res) => {
        const anime = new Anime();
        const episode = new Episode();
        anime.id = req.params.id;
        episode.number = Number(req.params.episode);
        try {
            const urls = await ga.download(anime, episode, scrapeClient);
            res.json(urls);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error.message
            });
        }
    })