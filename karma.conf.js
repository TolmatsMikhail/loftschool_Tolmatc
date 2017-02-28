module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            'hw6/test/**/*.js'
        ],
        preprocessors: {
            'hw6/test/**/*.js': ['webpack', 'sourcemap'],
        },
        webpack: require('./webpack.config.test'),
        webpackMiddleware: {
            stats: 'errors-only'
        },
        reporters: ['mocha'],
        port: 9876,
        browsers: ['Firefox'],
        captureTimeout: 60000,
        singleRun: true,
        plugins: [
            require('karma-mocha'),
            require('karma-webpack'),
            require('karma-mocha-reporter'),
            require('karma-firefox-launcher'),
            require('karma-sourcemap-loader')
        ]
    });
};
