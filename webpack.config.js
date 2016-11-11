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


// Stub route handlers, we just need the route paths
const routes = proxyquire('./src/client-only-template/routes', {'./routeHandlers': {}});
// Determine whether this is a prerender build or not
const prerendering = process.argv[2] === '--prerender';
// Get paths from routes
const paths = reactRouterToArray(routes);

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
    entry: prerendering ? ({
        __prerender: './src/client-only-template/prerender.js'
    }) : ({
        [pkg.name]: './src/client-only-template/client.js'
    }),
    output: Object.assign({}, {
        path: './dist',
        filename: '[name].js',// @TODO add hashing
        publicPath: '/'
    }, (prerendering ? { // settings required for prerender to work
        library: true,
        libraryTarget: 'commonjs2'
    } : {})),
    resolve: {
        extensions: ['', '.jsx', '.js'],
        modulesDirectories: ['src', 'node_modules']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
        })
    ].concat(prerendering ? new StaticSiteGeneratorPlugin('__prerender', paths) : []),
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
    plugins: development.plugins.concat([
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ]),
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