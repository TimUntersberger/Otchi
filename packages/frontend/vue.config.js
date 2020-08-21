module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Otchi",
            },
            nodeModulesPath: ["../api/node_modules", "./node_modules"],
        },
        configureWebpack: {
            resolve: {
                symlinks: true,
            },
            options: {
                appendTsSuffixTo: [/.vue$/]
            }
        },
        quasar: {
            importStrategy: "kebab",
            rtlSupport: false,
        },
    },
    transpileDependencies: ["quasar"],
};
