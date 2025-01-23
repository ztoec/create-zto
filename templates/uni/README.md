# app-mp

纷享生活小程序

## 技术栈

- 框架：uni-app + Vue 3
- 开发语言：TypeScript
- 构建工具：Vite
- 状态管理：Pinia
- 样式方案：UnoCSS
- 代码规范：ESLint
- Git提交规范：Commitizen

项目是cli方式创建的，也可以使用HbuilderX面板运行，或者使用vscode 中使用命令运行


## 包管理工具

  `pnpm`

## node版本

`>=18.0.0`


## 项目目录结构

```
├── dist 打包输出目录
├── src 源码目录
    ├── api 接口
    ├── hooks 自定义hooks
    ├── components 组件
    ├── pages 页面
        ├── main 主包
        ├── express 快递之家分包
        ├── proceeds 散单收款分包
        ├── promotion 推广助手分包
    ├── store 状态管理
    ├── static 静态资源
    ├── utils 工具函数
    ├── App.vue 入口文件
    ├── main.ts 入口文件
    ├── manifest.json 项目配置
    ├── pages.json 页面配置
    ├── uni.scss 全局样式
├── types 类型文件
├── commitlintrc 提交规范
├── .env.development 开发环境变量
├── .env.production 生产环境变量
├── .env.staging 测试环境变量
├── package.json 项目配置
├── tsconfig.json 类型脚本配置
├── cz.config.js commitizen 配置
├── eslint.config.js eslint 配置
├── unocss.config.ts unocss 配置
├── vite.config.ts vite 配置

```
