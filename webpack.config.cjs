const path = require('path');

module.exports = [
  {
    mode: 'development',
    devtool: 'source-map',
    entry: './dist/index.js',
    output: {
      filename: 'index.mjs',
      path: path.resolve(__dirname, 'dist/esm'),
      library: { type: 'module' }
    },
    experiments: { outputModule: true }
  }, {
    mode: 'development',
    devtool: 'source-map',
    entry: './dist/index.js',
    output: {
      filename: 'index.cjs',
      path: path.resolve(__dirname, 'dist/cjs'),
      library: { type: 'commonjs2' }
    }
  }, {
    mode: 'development',
    devtool: 'source-map',
    entry: './dist/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist/js'),
      library: {
        name: 'elUtilAction',
        type: 'var'
      }
    }
  }, {
    mode: 'production',
    entry: './dist/index.js',
    output: {
      filename: 'index.min.mjs',
      path: path.resolve(__dirname, 'dist/esm'),
      library: { type: 'module' }
    },
    experiments: { outputModule: true }
  }, {
    mode: 'production',
    entry: './dist/index.js',
    output: {
      filename: 'index.min.cjs',
      path: path.resolve(__dirname, 'dist/cjs'),
      library: { type: 'commonjs2' }
    }
  }, {
    mode: 'production',
    entry: './dist/index.js',
    output: {
      filename: 'index.min.js',
      path: path.resolve(__dirname, 'dist/js'),
      library: {
        name: 'elUtilAction',
        type: 'var'
      }
    }
  }
];