module.exports = {
    // Existing configuration
    devtool: "source-map", // Ensure source maps are enabled for your code
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
          exclude: [
            /node_modules\/@walletconnect\/window-metadata/,
            /node_modules\/@walletconnect\/window-getters/,
          ],
        },
      ],
    },
  };