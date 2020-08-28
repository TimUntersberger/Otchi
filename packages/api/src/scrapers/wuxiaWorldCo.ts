import scrape from "./scrape";
import Novel from "../entities/novel/Novel";
import Chapter from "../entities/novel/chapter";

export default class WuxiaWorldCo {
    async search(text: string, page = 1) {
        const $ = await scrape(
            `https://www.wuxiaworld.co/search/${encodeURIComponent(
                text
            )}/${page}`
        );
        return $(".result-container_2 > ul:nth-child(2) > li")
            .map((_, e) => {
                const $$ = $(e);
                const novel = new Novel();
                novel.cover = $$.find("img.item-img").attr("src")!;
                novel.title = $$.find("img.item-img").attr("alt")!;
                novel.slug = $$.find("a.book-name").attr("href")!.slice(1, -1);
                return novel;
            })
            .toArray();
    }

    async content(novel: Novel, chapter: Chapter) {
        const $ = await scrape(`https://www.wuxiaworld.co/${novel.slug}/${chapter.id}.html`);

        const paragraphs = $(".chapter-entity").contents().toArray().filter(e => e.type == "text").map(e => e.data!);

        return paragraphs;
    }
}

module.exports = WuxiaWorldCo;
