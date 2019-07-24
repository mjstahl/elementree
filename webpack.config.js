const path = require('path')
const ESMWebpackPlugin = require('@purtuga/esm-webpack-plugin')

const base = {
  mode: 'production',
  target: 'web',
  entry: './lib/elementree.js'
}

const outputBase = {
  path: path.resolve(__dirname, './dist'),
  library: 'elementree'
}

const esm = Object.assign({}, base, {
  output: Object.assign({}, outputBase, {
    filename: 'esm.js',
    libraryTarget: 'var'
  }),
  plugins: [
    new ESMWebpackPlugin()
  ]
})

module.exports = [esm]
