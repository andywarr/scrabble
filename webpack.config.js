const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  entry: {
    index: "./client/src/js/index.js",
    game: "./client/src/js/game.js"
  },
  output: {
    path: path.join(__dirname, 'client/dist/js'),
    filename: "[name].js",
    publicPath: '/static/js'
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ['index'],
      filename: "../index.html",
      template: "./client/src/template.html"
    }),
    new HtmlWebPackPlugin({
      chunks: ['game'],
      filename: "../game.html",
      template: "./client/src/template.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
