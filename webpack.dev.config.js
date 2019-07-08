var path = require('path');
var webpack = require('webpack');
var env = process.env.WEBPACK_BUILD || 'development';
var nginx = "http://10.10.10.201:8082";
// var nginx = "http://222.191.231.250:8740/";
var nginx_ws = "ws://10.10.10.201:8082";
var nginx3 = "http://127.0.0.1:10800";

var config = [{
	devtool: 'source-map',
	devServer: {
		contentBase: './build',
		historyApiFallback: true,
		stats: {
			chunks: false
		},
		proxy: {
			"/auth_s": {
				target: nginx,
				changeOrigin: true
			},
			"/param_s": {
				target: nginx,
				changeOrigin: true
			},
			"/reactDemo_s": {
				target: nginx,
				changeOrigin: true
			},
		},
	},
	entry: {
		main: './docs/main/app',
		auth: './docs/auth/main/app',
		uman: './docs/auth/umain/app',
		reactDemo: './docs/reactDemo/main/app',
	},
	node: {
		fs: 'empty'
	},
	output: {
		path: __dirname+'/build',
		filename: '[name].js',
	},
    mode: 'development',

	plugins: require('./plugin.config.js'),
	module: require('./module.config.js'),
	resolve: require('./resolve.config.js')
}];

module.exports = config;

