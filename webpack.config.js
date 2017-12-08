const path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: [
          path.resolve(__dirname, "/node_modules/")
        ],
        loader: "babel-loader",
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
      ],
    extensions: [".js", ".json", ".jsx", ".css"]
  },
  watch: true
};
