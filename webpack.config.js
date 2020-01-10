
const path = require('path')

const config = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'distinct-colors',
    libraryTarget: 'umd',
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
