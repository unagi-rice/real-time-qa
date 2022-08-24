# Real-Time-QA （课堂实时问答插件）

## 项目简介

**本项目是一个提供了课堂实时问答的白板插件，内置了教师编辑题目、学生作答、统计作答情况、作答流程控制等功能。
**

## 安装部署指南

下载
'''
git clone https://github.com/unagi-rice/real-time-qa/
'''

安装部署
'''
npm install // 安装依赖
npm start // 本地安装部署
'''

## 功能简介

+ 编辑题目：通过markdown语法编辑题目，提供包括单选、多选、填空等多种题型支持。
+ 作答控制：教师控制Quiz流程，控制课堂节奏。
+ 学生作答：学生实时进行作答，作答结果实时同步到插件内。
+ 作答统计：提供作答统计看板，作答答案分布，单个学生作答结果统计，自动批改等。

## 技术栈

本插件依赖于以下工具：

- typescript - 主要语言
- vue3 - 主要前端框架
- element plus - 提供各种UI组件
- 声网white-board-sdk - 与房间中其他成员进行互动
- milkdown - 以Markdown的方式编辑题目
- micromark - 渲染Markdown
- ApexChart.js - 统计数据渲染

## 项目效果

<!--TODO: 测试图例-->

编辑题目 [图]

学生作答 [图]

作答统计 [图]

## 许可协议

以 `MIT`开源协议对外开源。
