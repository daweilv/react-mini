const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

const publicPath = "";
// for cdn

module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: devMode ? "index.[hash:8].js" : "index.[chunkhash:8].js",
    path: path.resolve(__dirname, "build"),
    publicPath
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    new HtmlWebpackPlugin({
      title: "Output Management",
      template: "src/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("postcss-import"), require("autoprefixer")]
            }
          },
          "less-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "asset/image/[name].[hash:8].[ext]",
          publicPath
        }
      },
      {
        test: /\.(woff|woff2|eot|otf|webp|ttf)$/i,
        loader: "file-loader",
        options: {
          name: "asset/font/[name].[hash:8].[ext]",
          publicPath
        }
      }
    ]
  }
};
