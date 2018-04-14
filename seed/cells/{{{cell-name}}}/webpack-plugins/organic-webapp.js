const path = require('path')
const loadDNA = require('organic-dna-loader')
const InjectPlugin = require('webpack-inject-plugin').default
const resolveModule = require('resolve')

const resolveModulePath = async function (modulepath) {
  return new Promise((resolve, reject) => {
    resolveModule(modulepath, {
      basedir: process.cwd()
    }, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

const renderDNA = async function (dna) {
  let dnaImpl = JSON.stringify(dna)
  for (let key in dna.build) {
    let value = `"${dna.build[key].source}"`
    let fullpath = await resolveModulePath(dna.build[key].source)
    let replacement = `require('${fullpath}')`
    dnaImpl = dnaImpl.replace(value, replacement)
  }
  return `(function () {window.DNA = ${dnaImpl}})()`
}

module.exports = async function (webpackConfig) {
  return new Promise((resolve, reject) => {
    loadDNA({
      dnaSourcePaths: [
        path.resolve(__dirname, '../dna'),
        path.resolve(__dirname, '../../../dna')
      ],
      dnaMode: process.env.CELL_MODE
    }, async (err, dna) => {
      if (err) return reject(err)

      let result = await renderDNA(dna)
      webpackConfig.plugins.push(new InjectPlugin(function () {
        return result
      }))
      resolve(webpackConfig)
    })
  })
}
