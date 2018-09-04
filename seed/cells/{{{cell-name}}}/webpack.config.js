const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webcell = require('webpack-organic-webcell-configurator')
const path = require('path')

// css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssImport = require('postcss-import')
const postcssReporter = require('postcss-reporter')
const postcssCssnext = require('postcss-cssnext')

const REPODIR = path.resolve(__dirname, '../../')
const repoModules = ['web_modules', 'node_modules', 'lib/client'].map((v) => {
  return path.join(REPODIR, v)
})
const packageModules = ['web_modules', 'node_modules'].map((v) => {
  return path.join(__dirname, v)
})

module.exports = webcell({
  dnaSourcePaths: [
    path.resolve(__dirname, '../../dna')
  ],
  selectBranch: 'cells.{{{cell-name}}}'
}, function (dna) {
  return {
    entry: './index.js',
    mode: 'development',
    output: {
      publicPath: dna['cell-mountpoints']['{{{cell-name}}}']
    },
    devServer: {
      port: dna['cell-ports']['{{{cell-name}}}']
    },
    'resolve': {
      'extensions': ['.webpack.js', '.web.js', '.tag', '.js'],
      'modules': repoModules.concat(packageModules)
    },
    'plugins': [
      new HtmlWebpackPlugin({ template: 'index.html' }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new CopyWebpackPlugin([{
        from: path.join(REPODIR, 'lib/client/public/'),
        to: 'public/'
      }])
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
                  postcssImport({
                    addModulesDirectories: repoModules.concat(packageModules)
                  }),
                  postcssReporter(),
                  postcssCssnext()
                ]
              }
            }
          ]
        },
        {
          test: /\.tag$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['babel-plugin-transform-react-jsx']
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
  }
})
