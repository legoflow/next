# LegoFlow-Engine v3

<p>
  <a href="https://www.npmjs.com/package/legoflow">
    <img alt="Version" src="http://img.shields.io/npm/v/legoflow-engine" />
  </a>
</p>

## 安装

```sh
$ yarn add legoflow-engine --dev

# or

$ npm install legoflow-engine --save-dev
```

## 使用

```sh
# 开发
$ lf-engine dev

# 构建
$ lf-engine build

# 构建 [dll](https://webpack.docschina.org/plugins/dll-plugin/)
$ lf-engine dll -m <modules> -o <filename>
# 例子
$ lf-engine dll -m vue,vue-router,vuex -o vendor

# 参数
# 构建 base64 图片默认阀值为 1kb，修改最大阀值（kb）
$ lf-engine build --base64ImageMaxSize=10

# 禁止构建文件名带 hash 值
$ lf-engine build --disableFileNameHash=true
```

## 环境

```js
console.log(process.env.MODE)
// 开发 development
// 生产 production
```

## 扩展 Webpack 配置

若项目下存在 `legoflow.js` 文件，自动被加入作为 Webpack 配置的后置处理脚本，基本使用方式如下

```js
/**
 * legoflow.js 暴露方法
 *
 * 参数 [mode]
 * 可作为判断工作流处于 "development" 或 "production"
 *
 * 参数 [webpackConfig]
 * 1. 基于 webpack-chain 的 webpack 配置对象，修改该对象配置即可同步到工作流的 webpack 配置
 * 2. 若不习惯使用 webpack-chain 的配置方式，可通过 webpackConfig = webpackConfig.toConfig() 方式
 * 转换为熟悉的 JSON 配置，注意这个方式需要在函数内 retrun { webpackConfig }
 *
 * 参数 [webpackDevServerConfig]
 * webpack-dev-server 开发服务器配置，修改该参数需要在函数内 retrun { webpackDevServerConfig }
 * 构建阶段该对象为 undefined
 */
module.exports = async ({ mode, webpackConfig, webpackDevServerConfig }) => {
  // ...
}
```

## 插件化

当项目的 devDependencies 中含有 `legoflow-plugin-` 前缀的 NPM 模块时，engine 自动把该模块加入到工作流中。

可以把一些常用的 webpack 配置作为插件发布到 NPM 仓库（如 [legoflow-plugin-test](../plugin-test)）提供给项目使用。

## 更新日志

[CHANGELOG](./CHANGELOG.md)


## LICENSE

[MIT](./LICENSE)
