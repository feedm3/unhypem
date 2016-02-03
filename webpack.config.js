/**
 * @author Fabian Dietenberger
 */

'use strict';

require('dotenv').load();

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [];
plugins.push(new ExtractTextPlugin('styles.css', {
    publicPath: '/styles/',
    allChunks: true
}));
let devtool = 'eval-source-map';

if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, compress: {warnings: false}}));
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    devtool = 'source-map';
}

module.exports = {
    devtool: devtool,
    entry: [
        './public/app/main.js'
    ],
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        inline: true,
        port: 3333,
        contentBase: 'public'
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};
