const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webcell = require('webpack-organic-webcell-configurator')
const path = require('path')

// css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssImport = require('postcss-import')
const postcssReporter = require('postcss-reporter')
const postcssCssnext = require('postcss-cssnext')

const REPODIR = require('lib/full-repo-path')
const repoModules = ['web_modules', 'node_modules', 'cells/node_modules'].map((v) => {
  return path.join(REPODIR, v)
})
const packageModules = ['web_modules', 'node_modules'].map((v) => {
  return path.join(__dirname, v)
})
const allModuleDirectories = repoModules.concat(packageModules)

module.exports = webcell({
  dnaSourcePaths: [require('lib/full-dna-path')],
  selectBranch: '{{{cell-branch}}}'
}, function (rootDNA) {
  return {
    entry: './index.js',
    mode: 'development',
    output: {
      publicPath: rootDNA['cell-mountpoints']['{{{cell-name}}}']
    },
    devServer: {
      port: rootDNA['cell-ports']['{{{cell-name}}}']
    },
    'resolve': {
      'extensions': ['.webpack.js', '.web.js', '.tag', '.js'],
      'modules': allModuleDirectories
    },
    'plugins': [
      new HtmlWebpackPlugin({ template: 'index.html' }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new CopyWebpackPlugin([{
        from: path.join(REPODIR, 'cells/node_modules/lib/client/public/'),
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
                    addModulesDirectories: allModuleDirectories
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
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [ require.resolve('babel-plugin-transform-react-jsx') ]
            }
          }
        },
        {
          test: /\.tag$/,
          use: [
            { loader: 'organic-oval/webpack/oval-loader' }
          ]
        }
      ]
    }
  }
})
