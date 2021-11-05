const path = require('path');
const VersionFile = require('webpack-version-file');

module.exports = {
  mode: 'development',
  //mode: 'production',

  entry: './src/main.ts',

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src')
    ]    
  },
  plugins: [
    new VersionFile({
      output: './dist/version.js',
      template: './version.ejs'
    })
  ]
};