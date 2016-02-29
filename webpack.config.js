var webpack = require('webpack');
var path = require('path');
const NODE_ENV = process.env.NODE_ENV || "development";
const DEBUG = process.env.DEBUG ? true : false;
const DEVELOPMENT = NODE_ENV == 'development';
const PRODUCTION = NODE_ENV == 'production';

var config = {
    devtool: DEVELOPMENT ? 'cheap-module-source-map' : null,
    entry: {
        app: './src/app'
    },
    output: {
        path: path.join(__dirname, DEVELOPMENT ? 'public' : 'dist'),
        filename: 'ru-upfinder-silk.js'
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            DEVELOPMENT: DEVELOPMENT,
            DEBUG: DEBUG,
            'PRODUCTION': PRODUCTION
        })
        //new webpack.ProvidePlugin({
        //    '_': 'lodash',
        //    'babel-polyfill': 'babel-polyfill'
        //})
    ],
    resolve: {
        extensions: ['', '.js']
    },

    watch: DEVELOPMENT,

    watchOptions: {
      aggregateTimeout: 100
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015'],
                    cacheDirectory: true
                }
            }
        ]
    },

    node: {
      fs: "empty"
    }
};

uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
});

if (!DEVELOPMENT) {
    config.plugins.push(uglifyPlugin);
}

module.exports = config;