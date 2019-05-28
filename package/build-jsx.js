'use strict'
const path = require('path')
const webpack = require('webpack')

const webpackConfig = {
  entry: {
    'virtual-table-body-render' : path.resolve(__dirname, 'src/virtual-table-body-render-jsx.js')
  },
  output: {
    //根据CommonJs的规范进行打包
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, 'src'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}

webpack(webpackConfig, error => {
  if(error) throw error
})
