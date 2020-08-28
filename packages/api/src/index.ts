import express from "express";
import logger from "./logger";
import cors from "cors";
import http from "http";
import anime from "./anime";
import { ScrapeClient, ElectronScrapeClient } from "./scrapers/client";
import novel from "./novel";

export let scrapeClient: ScrapeClient = null as any;

export function init(client: ScrapeClient, port?: number): Promise<http.Server> {
    return new Promise(async (resolve) => {
        scrapeClient = client;
        const app = express();

        app.use((req, res, next) => {
            res.status(404);
            const oldEnd = res.end.bind(res);
            res.end = function(chunk: any) {
                logger.info(`<- GET ${req.originalUrl} ${res.statusCode}`)
                oldEnd(chunk);
            };
            logger.info(`-> GET ${req.originalUrl}`)
            next();
        })
        app.use(cors());
        app.use("/anime", anime());
        app.use("/novel", novel());

        app.get("/health", (req, res) => {
            res.status(200).end();
        });

        const server = http.createServer(app);
        server.listen(port, "0.0.0.0", () => {
            logger.info(`Started listening on http://localhost:${(server.address() as any).port}`)
            resolve(server);
        });
    });
}

export { 
    ScrapeClient, ElectronScrapeClient 
};
