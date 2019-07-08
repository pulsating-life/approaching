var ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
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
   ]
};

