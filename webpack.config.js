// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/server.ts',
  target: 'node',
  externalsPresets: { node: true },
  externals: {
    express: 'commonjs express',
    puppeteer: 'commonjs puppeteer',
  },
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      'pg-native': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
