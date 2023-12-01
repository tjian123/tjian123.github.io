---
layout: default
title: Vite 基本用法
description: Vite 的基本用法
categories: 
   - 技术积累
tags: 
   - TypeScript
   - Vite
   - Frontend
---

> Vite 的背景、功能和基本用法。

<!-- more -->
* TOC
{:toc}

## 1. Vite 是什么

Vite 是一套前端开发工具链，用于解决传统前端项目打包过程缓慢，文件变更后服务重启过程缓慢等问题，集合了打包编译工具。

## 2. Vite 有哪些功能

### 2.1 NPM 依赖解析和预构建

### 2.2 模块热替换

## 3. Vite 的用法

### 3.1 创建一个 Vite 项目

可以使用不同的工具创建 Vite 项目：

* 使用 `npm`，`npm create vite@latest`
* 使用 `yarn`，`yarn create vite`
* 使用 `pnpm`，`pnpm create vite`

上述命令将进入交互模式，选择不同的前端开发框架，即可生成初始项目。

此外，也可以使用 `--template` 参数直接指定使用的模板创建项目，如 `pnpm create vite myapp --template vue-ts` 创建一个 基于vue 项目。