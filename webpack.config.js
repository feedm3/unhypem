/**
 * @author Fabian Dietenberger
 */

const path = require('path');
// const webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
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
    // plugins: [ // uncomment to minimize
    //    new webpack.optimize.UglifyJsPlugin({minimize: true})
    // ],
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
