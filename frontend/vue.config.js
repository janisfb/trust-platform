module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/base.scss";',
      },
    },
  },
  devServer: {
    // should not be used in production
    proxy: {
      "^/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "^/logs-*": {
        target: "http://localhost:9200",
        changeOrigin: true,
      },
    },
  },
};
