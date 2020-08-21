import express from "express";
import cors from "cors";
import http from "http";
import anime from "./anime";
import { ScrapeClient, ElectronScrapeClient } from "./scrapers/client";

export function init(scrapeClient: ScrapeClient, port?: number): Promise<http.Server> {
    return new Promise(async (resolve) => {
        const app = express();

        app.use(cors());
        app.use("/anime", anime(scrapeClient));

        app.get("/health", (req, res) => {
            res.status(200).end();
        });

        const server = http.createServer(app);
        server.listen(port, () => {
            resolve(server);
        });
    });
}

export { ScrapeClient, ElectronScrapeClient };
