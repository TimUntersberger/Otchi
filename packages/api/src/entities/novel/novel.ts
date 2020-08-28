import Chapter from "./chapter";
import scrape from "../../scrapers/scrape";

export default class Novel {
    title: string;
    slug: string;
    description: string;
    cover: string;
    _chapters: Chapter[];

    constructor() {
        this.title = "";
        this.slug = "";
        this.description = "";
        this._chapters = [];
        this.cover = "";
    }

    chapter(number: number) {
        return this._chapters.find((c) => c.number == number);
    }

    async load() {
        const $ = await scrape(`https://www.wuxiaworld.co/${this.slug}/`);
        this.title = $(".book-name").text()!.trim();
        this.cover = $(".book-img img").attr("src")!;
        this.description = $(".desc").text();
        this._chapters = $(".chapter-list a")
            .toArray()
            .map((e) => {
                const $$ = $(e);
                const chapter = new Chapter();
                chapter.id = $$.attr("href")!
                    .split("/")
                    .pop()!
                    .split(".")
                    .shift()!;
                const tokens = $$.find("div p").text().split(" ");
                if (!isNaN(Number(tokens[0]))) {
                    chapter.number = Number(tokens.shift());
                }
                chapter.title = tokens.join(" ");
                return chapter;
            });
    }

    async chapters() {
        if (this.chapters.length == 0) {
            await this.load();
        }

        return this._chapters;
    }
}