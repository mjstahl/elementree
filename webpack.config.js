const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'elementree.js',
    library: 'elementree',
    libraryTarget: 'umd'
  }
};