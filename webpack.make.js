const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const makeConfig = (env, filename) => ({
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../../../dist'),
        filename: filename,
        library: "moduleLibrary",
        libraryTarget: "var"
    },
    plugins: [
        new EsmWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(env)
            }
        })
        // new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            ['@babel/plugin-proposal-pipeline-operator', {'proposal': 'minimal'}],
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    'collect-css-loader', 'css-loader', 'less-loader'
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false
        })]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    mode: env
})

module.exports = makeConfig
