const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
// webpack --progress --colors --config ./ddl.config.js

const vendors = [
    'react',
    'react-dom',
    'react-router-dom',
    'react-helmet',
    'reflux',
    'jquery',
    'antd',
    'promise',
    'holderjs',
	'echarts',
	'zrender',
    'antd-less'
];

module.exports = {
	node: {
		fs: 'empty'
	},
    output: {
        path: __dirname+'/build',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        react_lz_2: vendors,
    },
    mode: 'production',
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
	    new webpack.optimize.OccurrenceOrderPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
    ],
	module: {
	    rules: [
	      {
	        test: /\.json$/,
	        exclude: /node_modules/,
	        type: 'javascript/auto',
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
	          'babel-loader?cacheDirectory'
	        ]
	      },
	      {
	        test: /\.(css|scss)$/,
	        use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader',
				'postcss-loader'
			]
	      },
	      {
		    test: /\.less$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						modifyVars: {
							'primary-color': '#1DA57A',
							'link-color': '#1DA57A',
							'border-radius-base': '2px',
							'modal-header-bg': '#0F1F2F',
							'font-size-base': '12px',
							'font-size-lg': '14px',
							'font-size-sm': '10px'
						},
						javascriptEnabled: true,
					},
				},{
					loader: 'css-loader',
				},{
					loader: 'postcss-loader',
				},{
					loader: 'less-loader', // compiles Less to CSS
					options: {
						modifyVars: {
							'primary-color': '#1DA57A',
							'link-color': '#1DA57A',
							'border-radius-base': '2px',
							'modal-header-bg': '#001529',
							'font-size-base': '12px',
							'font-size-lg': '14px',
							'font-size-sm': '10px'
						},
						javascriptEnabled: true,
					},
				}
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
	   ]
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
	resolve: require('./resolve.config.js'), // 沿用业务代码的resolve配置
};


