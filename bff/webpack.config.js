const path = require('path');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const slsw = require('serverless-webpack');

module.exports = {
  context: process.cwd(),
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
      useTypescriptIncrementalApi: true,
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: false,
    }),
  ],
  externals: ['aws-sdk'],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    // Make sure to have .mjs before .ts and .js, otherwise serverless-webpack will complain
    // https://github.com/graphql/graphql-js/issues/1272#issuecomment-377384574
    extensions: ['.tsx', '.mjs', '.ts', '.js', '.webpack.js', '.web.js', '.json'],
  },
  devtool: 'source-map',
};
