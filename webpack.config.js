const path = require('path');

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
};