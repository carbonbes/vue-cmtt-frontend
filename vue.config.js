module.exports = {
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
    },
  },
};
