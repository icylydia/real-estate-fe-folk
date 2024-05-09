# 不动产管理系统前端

![main workflow](https://github.com/alpha-techs/real-estate-fe/actions/workflows/02_build_chuwa.yml/badge.svg)


基于[Quasar](https://quasar.dev/)搭建。使用Vue3和Vite。

## 开发环境

### 系统要求

- Node.js 20.x
- Yarn 1.22.x
- nvm 0.39.x (可选，推荐使用nvm管理Node.js版本)

### 安装依赖

```bash
nvm use # 如果使用nvm
```

```bash
corepack enable # 首次使用需要启用corepack
yarn set version 1.22.19 # 指定使用yarn 1.22.19，Quasar暂时不支持yarn 2及以上版本
```

```bash
yarn install # 安装依赖
```

### 启动开发服务器

```bash
yarn dev
```

### 打包代码

```bash
yarn build-wt # 打包wt测试版本
yarn build-chuwa # 打包仲和生产版本
```
