export default function(window: any) {
    return new Promise(resolve =>
        window.webContents.on("dom-ready", () => {
            window.webContents
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
                .catch(console.log);
        })
    );
}
