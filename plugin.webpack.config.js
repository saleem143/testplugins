const path = require('path');

module.exports = {
  entry: './src/plugin.js',
  output: {
    filename: 'plugin.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.html$/, use: 'html-loader' },
    ],
  },
};