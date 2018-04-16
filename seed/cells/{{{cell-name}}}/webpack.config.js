const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webcell = require('webpack-organic-webcell-configurator')
const path = require('path')

module.exports = webcell({
  dnaSourcePaths: [
    path.resolve(__dirname, './dna'),
    path.resolve(__dirname, '../dna')
  ]
}, {
  entry: './index.js',
  mode: 'development',
  'resolve': {
    'extensions': ['.webpack.js', '.web.js', '.tag', '.js'],
    'modules': ['web_modules', 'node_modules', 'ui']
  },
  'plugins': [
    new HtmlWebpackPlugin({ template: 'index.html' }),
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
