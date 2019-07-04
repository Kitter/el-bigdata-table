# el-bigdata-table

用来实现el-table展示大数据

流畅渲染万级数据并不会影响到el-table的原有功能

element版本兼容：目前测试能兼容的element-ui的版本为 2.3.9 - 2.8.2

注：暂不支持在使用element按需加载的时候使用

[点击查看在线demo](https://code-farmer-i.github.io/el-bigdata-table/dist/)

## Install
```shell
npm install el-bigdata-table -S
```

## 如果你使用的是vue-cli 2.x 需添加以下webpack配置
# webpack.base.conf.js
``` javascript
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
// 此处为添加的配置
const fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

//此处为添加的配置
let dirsName = fs.readdirSync(resolve('node_modules')).filter(dirName => /el-bigdata-table/.test(dirName))
const includesDirs = dirsName.map(dir => resolve(`node_modules/${dir}/src`))

module.exports = {
  ... //省略的代码 
  module: {
    rules: [
      // 省略代码...
      // 此处有添加babel-loader配置 ‘...includesDirs‘
      {
        test: /.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client'), ...includesDirs]
      },
      {
        test: /.(png|jpe?g|gif|svg)(?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
```

## 如果你使用的是vue-cli 3.x 需添加以下webpack配置
# vue.config.js (vue-cli 3.x)
``` javascript
'use strict'
const path = require('path')
const fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let dirsName = fs.readdirSync(resolve('node_modules')).filter(dirName => /el-bigdata-table/.test(dirName))

module.exports = {
  transpileDependencies: [...dirsName] ,
  ...//其他代码
}
```

## Quick Start
``` javascript
// main.js
// 注：需要在Vue.use(ElementUi) 之前引入
import 'el-bigdata-table'
```

### 基础用法
```html
<template>
  <!-- 使用 useVirtual 属性开启虚拟滚动 使用虚拟滚动时，必须要固定表格高度和行高 -->
  <el-table
    :data="tableData"
    height="400"
    useVirtual
  >
    <el-table-column
      type="index"
      width="100"
      fixed
    ></el-table-column>
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: Array.from({length: 10000}, () => ({
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }))
      }
    }
  }
</script>
```

## API

### 新增 Props:

属性  |  说明  |  类型  |  默认值
:-------: | -------  |  :-------:  |  :-------:
useVirtual  |  是否开启虚拟滚动  |  Boolean  |  false
rowHeight  |  行高(必须要设置正确的行高，否则会导致表格计算不正确)  |  Number  |  48

作者wx: ckang1229

