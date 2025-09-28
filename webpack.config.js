const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        background: './background.js',
        content: './content.js',
        popup: './popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js', // produces background.js, content.js, popup.js
        clean: true,
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: '.' },
                { from: 'popup.html', to: '.' },
                { from: 'options.html', to: '.' },
                { from: 'icon.png', to: '.' },
                { from: 'styles.css', to: '.' },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                },
            },
        ],
    },
};
