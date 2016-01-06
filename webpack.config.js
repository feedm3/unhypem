/**
 * @author Fabian Dietenberger
 */

var path = require('path');

module.exports = {
    entry: './public/app/main.js',
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        inline: true,
        port: 3333,
        contentBase: 'public'
    },
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