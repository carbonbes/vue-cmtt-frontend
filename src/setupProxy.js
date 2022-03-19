const { createProxyMiddleware } = require("http-proxy-middleware");

export default function (app) {
  app.use(
    "/v1.9",
    createProxyMiddleware({
      target:
        process.env.NODE_ENV == "production"
          ? "https://happy-yonath-c3d5de.netlify.app/v1.9"
          : "https://api.tjournal.ru/v1.9",
      changeOrigin: true,
      pathRewrite: {
        "^/v1.9": "",
      },
    })
  );

  app.use(
    "/v2.1",
    createProxyMiddleware({
      target:
        process.env.NODE_ENV == "production"
          ? "https://happy-yonath-c3d5de.netlify.app/v1.9"
          : "https://api.tjournal.ru/v2.1",
      changeOrigin: true,
      pathRewrite: {
        "^/v2.1": "",
      },
    })
  );
}
