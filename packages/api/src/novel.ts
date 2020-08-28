import express from "express";
import Novel from "./entities/novel/novel";
import WuxiaWorldCo from "./scrapers/wuxiaWorldCo";
import Chapter from "./entities/novel/chapter";
import logger from "./logger";

const wwc = new WuxiaWorldCo();

export default () => express.Router()
    .get("/search", async (req, res) => {
        const text = decodeURIComponent(req.query.text as string);
        const page = Number(req.query.page || 1);
        logger.debug(`Searching for ${text} page ${page}`);
        const result = await wwc.search(text, page);
        logger.debug(`Found ${result.length} results`);

        res.status(200).json(result);
    })
    .get("/:id", async (req, res) => {
        const novel = new Novel();
        novel.slug = req.params.id;
        logger.debug(`Scraping chapters for ${novel.slug}`);
        await novel.chapters();
        logger.debug(`Found ${novel._chapters.length} chapters`);
        res.status(200).json(novel);
    })
    .get("/:id/:chapter", async (req, res) => {
        const novel = new Novel();
        novel.slug = req.params.id;
        const chapter = new Chapter();
        chapter.id = req.params.chapter;
        try {
            logger.debug(`Scraping novel ${novel.slug} chapter ${chapter.id} for content`);
            const content = await wwc.content(novel, chapter);
            logger.debug(`Found ${content.length} paragraphs`);
            res.status(200).json(content);
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({
                error: error.message
            });
        }
    })