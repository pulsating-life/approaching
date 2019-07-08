var path = require('path');

module.exports = {
    extensions: ['*', '.ts', '.js', '.json'],
    alias: {
      'antd-css': path.join(__dirname,'node_modules/antd/dist/antd.css'),
      'antd-less': path.join(__dirname,'node_modules/antd/dist/antd.less'),
      '@': path.join(__dirname, 'docs')
    }
};
