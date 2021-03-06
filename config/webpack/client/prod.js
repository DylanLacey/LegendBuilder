var helpers = require('../../../helpers');
var settings = require('../../settings').settings;
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'production';

const METADATA = webpackMerge(commonConfig.metadata, {
  host: settings.httpServer.host || 'localhost',
  port: settings.httpServer.port || 8080,
  ENV: ENV
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  devtool: 'source-map',
  debug: false,

  entry: {
    'main': [
      helpers.root('src/client/polyfills.ts'), helpers.root('src/client/vendor.ts'),
      helpers.root('src/client/boot.ts')
    ]
  },

  output: {
    path: helpers.root('build/dist/client'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {'compilerOptions': {'removeComments': true}},
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.css$/,
        loader:
            ExtractTextPlugin.extract({notExtractLoader: 'style-loader', loader: 'css-loader'})
      }
    ]
  },

  plugins: [
    new ForkCheckerPlugin(), new WebpackMd5Hash(), new DedupePlugin(),
    new CopyWebpackPlugin([{from: 'src/assets/images', to: 'assets/images'}]),
    new HtmlWebpackPlugin({template: 'src/client/index.html', chunksSortMode: 'none'}),
    new DefinePlugin({'ENV': JSON.stringify(ENV)}),
    new UglifyJsPlugin({beautify: false, mangle: {keep_fnames: true}, comments: false}),
    new CompressionPlugin(
        {algorithm: 'gzip', regExp: /\.css$|\.html$|\.js$|\.map$/, threshold: 2 * 1024}),
    new ExtractTextPlugin('style.css')
  ]
});
