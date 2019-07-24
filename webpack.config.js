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

const cjs = Object.assign({}, base, {
  output: Object.assign({}, outputBase, {
    filename: 'elementree.cjs.js',
    libraryTarget: 'commonjs'
  })
})

const umd = Object.assign({}, base, {
  output: Object.assign({}, outputBase, {
    filename: 'elementree.umd.js',
    libraryTarget: 'umd'
  })
})

const esm = Object.assign({}, base, {
  output: Object.assign({}, outputBase, {
    filename: 'elementree.esm.js',
    libraryTarget: 'var'
  }),
  plugins: [
    new ESMWebpackPlugin()
  ]
})


module.exports = [cjs, esm, umd]
