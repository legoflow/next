# LegoFlow v3

<p>
  <a href="https://www.npmjs.com/package/legoflow">
    <img alt="Version" src="http://img.shields.io/npm/v/create-lf-app" />
  </a>
</p>

## 创建项目

```sh
# yarn 方式
$ yarn create lf-app [name]
# npm 方式
$ npm init lf-app [name]

# 创建以路径文件夹为名称的项目
$ cd demo
$ yarn create lf-app

# 拉取指定 **远程项目模板** 创建项目
$ yarn create lf-app [name] --remote <NPM Repo Name/Git Repo URL>

# 例如
$ yarn create lf-app demo --remote vue
$ yarn create lf-app demo --remote vue-next
$ yarn create lf-app demo --remote react
$ yarn create lf-app demo --remote jquery

# 例如，我提交了一个 npm 仓库名为 legoflow-project-test
# 若没有指定 --remote，创建项目时模板会自动出现在候选列表中
$ yarn create lf-app demo
# 也可直接指定 --remote
$ yarn create lf-app demo --remote test

# 例子，直接拉取远程 Git Repo URL 模板
$ yarn create lf-app demo --remote https://github.com/lijialiang/legoflow-project-react.git
```

## 规范化

默认项目类型 Vue，远程项目类型 jQuery、React 均支持 ESLint（[Standard](https://standardjs.com/readme-zhcn.html)）、Git Commit Log（[Angular](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)） 等规范化配置。

以 **VSCode** 为例，安装 `ESLint` 插件后，打开创建后的项目即可。

```json
// vscode eslint 常用配置
// 保存时自动格式化
"eslint.codeActionsOnSave": true,
// 验证哪些语言格式文件
"eslint.validate": [
  "vue",
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
]
```

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)

