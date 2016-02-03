/**
 * @author Fabian Dietenberger
 */

'use strict';

require('dotenv').load();

const path = require('path');
const webpack = require('webpack');

const plugins = [];
let devtool = 'eval-source-map';

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, compress: { warnings: false }}));
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    devtool = 'source-map';
}

module.exports = {
    devtool: devtool,
    entry: './public/app/main.js',
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
            }
        ]
    }
};
