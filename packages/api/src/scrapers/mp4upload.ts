export default function(window: any) {
    return new Promise(resolve =>
        window.webContents.on("dom-ready", () => {
            window.webContents
                .executeJavaScript(
                    `
                        const ele = document.querySelector('#container > div.plyr.plyr--full-ui.plyr--video.plyr--html5.plyr--paused.plyr--stopped.plyr--pip-supported.plyr--fullscreen-enabled > div.plyr__video-wrapper > video > source')
                        ele 
                            ? ele.src 
                            : eval("(" + eval(document.querySelector('body > script:nth-child(3)').innerText.substring(4)).split(";")[0].substring(14) + ")").sources[0].src
                    `
                )
                .then(resolve)
                .catch(console.log);
        })
    );
}