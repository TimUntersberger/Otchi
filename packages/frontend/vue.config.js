module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Otchi",
            },
            preload: "src/preload.js",
            
            nodeModulesPath: ["../api/node_modules", "./node_modules"],
        },
        quasar: {
            importStrategy: "kebab",
            rtlSupport: false,
        },
    },
    devServer: {
        watchOptions: {
            poll: true
        }
    },
    pwa: {
        name: "Otchi"
    },
    lintOnSave: false,
    transpileDependencies: ["quasar"],
};
