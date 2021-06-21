# {{ name }}

## 项目初始化安装依赖

```sh
$ yarn install
```

## 开发项目

```sh
$ yarn start
# 或者
$ yarn dev
```

## 构建项目

```sh
$ yarn build
```

## 发布项目

默认通过 [Gitlab CI](./.gitlab-ci.yml) 触发发布流程

* `test` 分支发布到 **测试环境**
* `master` 分支发布到 **生产环境**

## 相关文档

* [LegoFlow v3](https://legoflow.com/v3/)
* [rv-cli](https://git.duowan.com/opensource/ued/release-version-cli)
