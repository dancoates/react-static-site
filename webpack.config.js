require('dotenv').config();
require('babel-register');

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const pkg = require('./package');
const proxyquire = require('proxyquire').noCallThru();
const reactRouterToArray = require('react-router-to-array');

// Check if watching so that prerendering can be disabled.
const watching = process.argv[1] && process.argv[1].indexOf('webpack-dev-server') !== -1;

let paths = ['/'];
if(process.env.NODE_ENV === 'production') {
    // Stub route handlers, we just need the route paths
    const routes = proxyquire('./src/client-only-template/routes', {'./routeHandlers': {}});
    // Get paths from routes
    paths = reactRouterToArray(routes);
}

/**
 *
 * Loaders
 *
 */

const JS_LOADER = {
    test: /\.jsx?$/,
    exclude: ['node_modules'],
    loaders: ['babel']
};

const JSON_LOADER = {
    test: /\.json$/,
    loader: 'json-loader'
};

const GRAPHQL_LOADER = {
    test: /\.graphql$/,
    loaders: ['raw-loader']
};

const FILE_LOADER = {
    test: /\.png$|\.svg$|\.jpg$|\.gif$|\.ttf$|\.woff$|\.woff2$|\.eot$|\.otf$/,
    loaders: ['file-loader'],
    loader: 'file?name=assets/[hash].[ext]'
};



const development = {
    devtool: 'source-map',
    entry: Object.assign({}, {
        [pkg.name]: './src/client-only-template/client.js'
    }, watching ? {} : { // Don't have prerender entry if watching
        __prerender: './src/client-only-template/prerender.js',
    }),
    output: {
        path: './dist',
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['', '.jsx', '.js'],
        modulesDirectories: ['src', 'node_modules']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
        }),
        // Don't run prerender if watching
        (watching ? null : new StaticSiteGeneratorPlugin('__prerender', paths))
    ].filter(plugin => !!plugin),
    module: {
        loaders: [
            JS_LOADER,
            JSON_LOADER,
            GRAPHQL_LOADER,
            FILE_LOADER,
            {
                test: /\.scss$/,
                loaders: ["style-loader?sourceMap", "css-loader?sourceMap", "postcss-loader?sourceMap", "sass-loader?sourceMap"]
            }
        ]
    },
    postcss : function() {
        return [autoprefixer({browsers : ['ie >= 9', 'last 2 versions']})]
    },
    devServer : {
        host: '0.0.0.0',
        publicPath : '/',
        port: process.env.PORT || 3000,
        historyApiFallback: true
    }
};


const production = Object.assign({}, development, {
    devtool: undefined,
    cache: false,
    output: Object.assign({}, development.output, {
        filename: '[name]-[hash].js'
    }),
    plugins: [
        new ExtractTextPlugin('client-only-template-[contenthash].css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ].concat(development.plugins),
    module: {
        loaders: [
            JS_LOADER,
            JSON_LOADER,
            GRAPHQL_LOADER,
            FILE_LOADER,
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("css-loader!postcss-loader!sass-loader")
            }
        ]
    },
});

module.exports = process.env.NODE_ENV === 'production' ? production : development;