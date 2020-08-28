import { BrowserWindow } from "electron";
import { Page, Browser } from "puppeteer";

export interface ScrapeClient {
    streamtape: () => Promise<string>;
    mp4upload: () => Promise<string>;
    goto: (url: string) => Promise<void>;
}

export class ElectronScrapeClient implements ScrapeClient {
    window: BrowserWindow;

    constructor(window: BrowserWindow) {
        this.window = window;
    }

    streamtape(): Promise<string> {
        return new Promise((resolve, reject) =>
            this.window.webContents.once("dom-ready", () => {
                this.window.webContents
                    .executeJavaScript(
                        `
                    document
                        .querySelector(
                            "body > div.plyr-container > div.plyr-overlay"
                        )
                        .click();

                    document
                        .querySelector("video#mainvideo")
                        .getAttribute("src")
                        .replace("//", "https://")
                `
                    )
                    .then(resolve)
                    .catch(reject);
            })
        );
    }

    mp4upload(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.window.webContents.once("dom-ready", () => {
                this.window.webContents
                    .executeJavaScript(
                        `
                    const ele = document.querySelector('#container > div.plyr.plyr--full-ui.plyr--video.plyr--html5.plyr--paused.plyr--stopped.plyr--pip-supported.plyr--fullscreen-enabled > div.plyr__video-wrapper > video > source')
                    ele 
                        ? ele.src 
                        : eval("(" + eval(document.querySelector('body > script:nth-child(3)').innerText.substring(4)).split(";")[0].substring(14) + ")").sources[0].src
                `
                    )
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    goto(url: string): Promise<void> {
        return this.window.loadURL(url);
    }
}

export class PuppeteerScrapeClient implements ScrapeClient {
    page!: Page;

    constructor(browser: Browser) {
        browser.newPage().then((p) => (this.page = p));
    }

    streamtape(): Promise<string> {
        return this.page.evaluate(() => {
            document
                .querySelector<HTMLVideoElement>(
                    "body > div.plyr-container > div.plyr-overlay"
                )!
                .click();

            return document
                .querySelector("video#mainvideo")!
                .getAttribute("src")!
                .replace("//", "https://");
        });
    }

    mp4upload(): Promise<string> {
        return this.page.evaluate(() => {
            const ele = document.querySelector<HTMLSourceElement>(
                "#container > div.plyr.plyr--full-ui.plyr--video.plyr--html5.plyr--paused.plyr--stopped.plyr--pip-supported.plyr--fullscreen-enabled > div.plyr__video-wrapper > video > source"
            );

            return ele
                ? ele.src
                : eval(
                      "(" +
                          eval(
                              document
                                  .querySelector<HTMLScriptElement>(
                                      "body > script:nth-child(3)"
                                  )!
                                  .innerText.substring(4)
                          )
                              .split(";")[0]
                              .substring(14) +
                          ")"
                  ).sources[0].src;
        });
    }

    async goto(url: string): Promise<void> {
        const x = await this.page.goto(url, {
            waitUntil: "domcontentloaded",
        });
    }
}
