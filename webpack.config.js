/**
 * @author Fabian Dietenberger
 */

'use strict';

require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SvgStore = require('webpack-svgstore-plugin');

const plugins = [];
let devtool = 'eval-source-map';

plugins.push(new ExtractTextPlugin('styles.css', {
    publicPath: '/styles/',
    allChunks: true
}));
plugins.push(new SvgStore(
    path.join(__dirname, '/public/assets', '**/*.svg'), // input path
    '', // output path
    {
        name: '[hash].sprite.svg',
        chunk: 'main',
        prefix: '',
        svgoOptions: {}
    }
));

if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, compress: {warnings: false}}));
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}));
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
                test: /\.(png|woff|woff2|eot|ttf)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};
