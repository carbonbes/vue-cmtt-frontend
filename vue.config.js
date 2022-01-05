module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
  devServer: {
    proxy: {
      "/v1.9": {
        target: "https://api.tjournal.ru/v1.9",
        changeOrigin: true,
        pathRewrite: {
          "^/v1.9": "",
        },
      },
      "/v2.1": {
        target: "https://api.tjournal.ru/v2.1",
        changeOrigin: true,
        pathRewrite: {
          "^/v2.1": "",
        },
      },
    },
  },
};
