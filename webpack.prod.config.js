var helpers = require('./helpers');

var webpack = require('webpack');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var httpServer = require('./src/server/.settings').httpServer;
var ENV = process.env.NODE_ENV = process.env.ENV = 'production';

var metadata = {
  title: 'Legend Builder',
  baseUrl: '/',
  host: httpServer.host || "localhost",
  port: httpServer.port || 8080,
  ENV: ENV
};

module.exports = {
  metadata: metadata,
  devtool: 'source-map',
  debug: false,

  entry: {
    //'main': ['./src/boot.ts', './src/vendor.ts', './src/polyfills.ts']
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main': './src/boot.ts'
  },

  output: {
    path: helpers.root('dist'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [
          helpers.root('node_modules')
        ]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ],
    loaders: [
      // Support Angular 2 async routes via .async.ts
      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          'compilerOptions': {
            'removeComments': true
          }
        },
        exclude: [helpers.root('src/tests')]
      }
    ],
    noParse: [
      helpers.root('zone.js', 'dist'),
      helpers.root('angular2', 'bundles')
    ]

  },

  plugins: [
    new ForkCheckerPlugin(),
    new WebpackMd5Hash(),
    new DedupePlugin(),
    new OccurenceOrderPlugin(true),
    new CommonsChunkPlugin({
      name: ['main', 'vendor', 'polyfills'],
      filename: '[name].bundle.js',
      minChunks: Infinity
    }),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    new HtmlWebpackPlugin({ template: 'src/index.html', chunksSortMode: 'none' }),
    new DefinePlugin({
      'ENV': JSON.stringify(metadata.ENV),
      'HMR': false
    }),
    new UglifyJsPlugin({
      // beautify: true,
      // mangle: false,
      // dead_code: false,
      // unused: false,
      // deadCode: false,
      // compress : { screw_ie8 : true, keep_fnames: true, drop_debugger: false, dead_code: false, unused: false, },
      // comments: true,

      beautify: false,
      mangle: {
        screw_ie8: true
      },
      compress: { screw_ie8: true },
      comments: false
    }),
    new CompressionPlugin({
      algorithm: helpers.gzipMaxLevel,
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    })
  ],

  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src',
  },

  //Needed to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
  htmlLoader: {
    minimize: true,
    removeAttributeQuotes: false,
    caseSensitive: true,
    customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
    customAttrAssign: [/\)?\]?=/]
  },

  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};