var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var paths = [
  '/'
];

module.exports = [
//    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([{ from: './docs/public/static', to: 'assets' }]),
    new webpack.optimize.OccurrenceOrderPlugin(),
//    new StaticSiteGeneratorPlugin('main', paths, {}),
	new MiniCssExtractPlugin({
		filename: '[name].css'
	}),
	
    new webpack.DllReferencePlugin({
      context: __dirname, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
      manifest: require('./manifest.json'), // 指定manifest.json
   }),
];

