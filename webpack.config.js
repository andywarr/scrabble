const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./client/src/game.html",
  filename: "../index.html",
});

module.exports = {
  entry: {
    game: "./client/src/js/game.js",
  },
  output: {
    path: path.join(__dirname, 'client/dist/js'),
    filename: "[name].js",
    publicPath: '/static/js'
  },
  plugins: [htmlPlugin],
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
