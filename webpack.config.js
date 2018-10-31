module.exports = {
    entry: ["babel-polyfill", './src/js/main.js'],
    output: {
      filename: 'scripts.js'
    },
    externals: {
      jquery: '$'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          }
        }
      ]
    }
  };