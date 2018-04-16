const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webcell = require('webpack-organic-webcell-configurator')
const path = require('path')

// css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssImport = require('postcss-import')
const stylelint = require('stylelint')
const postcssReporter = require('postcss-reporter')
const postcssCssnext = require('postcss-cssnext')

module.exports = webcell({
  dnaSourcePaths: [
    path.resolve(__dirname, './dna'),
    path.resolve(__dirname, '../dna')
  ]
}, {
  entry: './index.js',
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 8080,
    stats: {
      children: false
    }
  },
  'resolve': {
    'extensions': ['.webpack.js', '.web.js', '.tag', '.js'],
    'modules': ['web_modules', 'node_modules', path.resolve(__dirname, './node_modules')]
  },
  'plugins': [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new webpack.ProvidePlugin({
      'oval': 'organic-oval'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  'module': {
    'rules': [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
              plugins: () => [
                postcssImport(),
                stylelint(),
                postcssReporter(),
                postcssCssnext()
              ]
            }
          }
        ]
      },
      {
        test: /\.js$|.tag$/,
        include: /node_modules\/organic-oval/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [require.resolve('babel-preset-es2015')]
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
              [
                require.resolve('babel-plugin-transform-react-jsx'),
                { pragma: 'createElement' }
              ]
            ],
            presets: [require.resolve('babel-preset-es2015')]
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
