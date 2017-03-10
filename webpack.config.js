let webpack = require('webpack');
let HtmlPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let loaders = require('./webpack.config.loaders')();

loaders.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader'
    })
});

module.exports = {
    entry: {
        main: './hw8/src/index.js',
    },
    output: {
        filename: '[chunkhash].js',
        path: './dist'
    },
    devtool: 'source-map',
    module: {
        loaders
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                drop_debugger: false
            }
        }),
        new ExtractTextPlugin('styles.css'),
        new HtmlPlugin({
            title: 'friends editor',
            template: 'index.hbs',
            filename: 'index.html',
            chunks: ['main']
        }),
        // new HtmlPlugin({
        //     title: 'Cookie editor',
        //     template: 'cookie.hbs',
        //     filename: 'cookie.html',
        //     chunks: ['cookie']
//             title: 'Div Drag And Drop',
//             template: 'towns.hbs',
//             filename: 'towns.html',
//             chunks: ['towns']

        // }),

        new CleanWebpackPlugin(['dist'])
    ]
};
