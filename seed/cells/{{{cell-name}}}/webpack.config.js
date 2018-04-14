const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const organicWebApp = require('./webpack-plugins/organic-webapp')
const path = require('path')

module.exports = organicWebApp({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  mode: 'development',
  'resolve': {
    'extensions': ['.webpack.js', '.web.js', '.tag', '.js'],
    'modules': ['web_modules', 'node_modules', 'ui', 'plasma']
  },
  'plugins': [
    new HtmlWebpackPlugin({ template: "index.html" }),
    new webpack.ProvidePlugin({
      'oval': 'organic-oval'
    })
  ],
  'module': {
    'rules': [
      {
        test: /\.js$|.tag$/,
        include: /node_modules\/organic-oval/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['transform-react-jsx', { pragma: 'createElement' }]
            ],
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        use: [
          {loader: 'organic-oval/webpack/oval-loader'},
          {loader: 'organic-oval/webpack/oval-control-statements-loader'}
        ]
      }
    ]
  }
})
