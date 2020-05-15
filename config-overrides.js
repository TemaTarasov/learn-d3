const {
  override,
  fixBabelImports,
  addWebpackAlias,
  addLessLoader
} = require('customize-cra');
const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');
const rewireUglifyjs = require('react-app-rewire-uglifyjs');

const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@font-family': '"Roboto", sans-serif',
        '@border-radius-base': '4px'
      }
    }
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  rewireUglifyjs,
  rewireCompressionPlugin
);
