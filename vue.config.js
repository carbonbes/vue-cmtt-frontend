const path = require("path");

module.exports = {
  runtimeCompiler: true,

  css: {
    loaderOptions: {
      scss: {
        data: `@use "sass:color";@import "~@/variables.scss";@import "~@/mixins.scss";`,
      },
    },
  },

  devServer: {
    open: true,
    proxy: {
      "/v1.9": {
        target: "https://api.dtf.ru/v1.9",
        changeOrigin: true,
        pathRewrite: {
          "^/v1.9": "",
        },
      },

      "/v2.1": {
        target: "https://api.dtf.ru/v2.1",
        changeOrigin: true,
        pathRewrite: {
          "^/v2.1": "",
        },
      },

      "/v2.31": {
        target: "https://api.dtf.ru/v2.31",
        changeOrigin: true,
        pathRewrite: {
          "^/v2.31": "",
        },
      },

      "/entry/rating": {
        target: "https://dtf.ru",
        changeOrigin: true,
        pathRewrite: {
          "^/entry/rating": "",
        },
      },

      "/entry/reposts": {
        target: "https://dtf.ru",
        changeOrigin: true,
        pathRewrite: {
          "^/entry/reposts": "",
        },
      },
    },
  },

  chainWebpack: (config) => {
    config.plugin("copy").tap((args) => {
      args[0].push({
        from: path.resolve(__dirname, "src/other"),
        toType: "dir",
      });
      return args;
    });
  },
};
