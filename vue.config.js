const path = require("path");

module.exports = {
  runtimeCompiler: true,

  devServer: {
    open: true,
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

      "/entry/rating": {
        target: "https://tjournal.ru",
        changeOrigin: true,
        pathRewrite: {
          "^/entry/rating": "",
        },
      },

      "/entry/reposts": {
        target: "https://tjournal.ru",
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
