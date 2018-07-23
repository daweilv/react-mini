const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "build"),
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: new RegExp(`/`), to: "/index.html" }]
    },
    port: 5000,
    disableHostCheck: true,
    host: "0.0.0.0",
    useLocalIp: true
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});
