const webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
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
    mode: 'production',
    
    plugins: [
    	new CopyWebpackPlugin([{ from: './docs/public/static', to: 'assets' }]),
	    new webpack.optimize.OccurrenceOrderPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		
	    new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('./manifest.json'),
		}),
    ],
    
	module: {
	    rules: [
	      {
	        test: /\.json$/,
	        use: [
	          'json-loader?cacheDirectory'
	        ]
	      },
	      {
	        test: /\.ts$/,
	        use: [
	          'ts-loader'
	        ]
	      },
	      {
	        test: /\.(js|jsx)$/,
	        exclude: /node_modules/,
	        use: [
			    'babel-loader?cacheDirectory',
				 'eslint-loader'
			  ]
	      },
	      {
	        test: /\.(css|scss)$/,
	        include: /antd/,
	        use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader',
				'postcss-loader'
			]
	      },
	      {
	        test: /\.(css|scss)$/,
	        exclude: /antd/,
	        use: [
				'style-loader',
				'css-loader',
				'sass-loader',
				'postcss-loader'
			]
	      },
	      {
		    test: /\.less$/,
			use: [
				'style-loader',
				'css-loader',
				'less-loader'
			],
		  },
	      {
	      	test: /\.jpg$/,
	      	use: [
				"file-loader"
			]
	      },
	      {
	      	test: /\.(png|woff|woff2|eot|ttf|svg)$/,
	      	use: [
				'url-loader?limit=100000'
			]
	      }
	   ],
		noParse: [/moment-with-locales/]
	},
	optimization: {
        minimizer: [
            // js mini
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false // set to true if you want JS source maps
            }),
            // css mini
            new OptimizeCSSPlugin({})
        ]
    },
	devtool:false,
	resolve: require('./resolve.config.js'), // 沿用业务代码的resolve配置
};

