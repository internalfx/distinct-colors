
const path = require('path')

const config = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'distinct-colors.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [],
  resolve: {}
}

module.exports = config
