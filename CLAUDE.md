# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本（tsc + vite build）
pnpm lint     # ESLint 检查
pnpm preview  # 预览构建产物
```

## 项目概述

这是一个**设计模式文档仓库**，记录了 UI 组件同时支持鼠标、键盘和触摸输入模式时的交互设计方案。

核心问题：悬停显示的菜单在触屏设备上无法访问。解决方案是针对不同输入模式采用不同交互策略，使用 `pointerType` 运行时检测区分输入类型。

## 技术要点

- 使用 Pointer Events API（`pointerdown`、`pointerup`）统一处理多种输入
- 通过 `e.pointerType` 区分 `"mouse"` 和 `"touch"`
- 触摸交互追踪"首次点击聚焦"状态：
  - `useRef` 作为 `pointerdown` → `focus` 的同步标志
  - `useState` 保持状态到 `pointerup`
- CSS 使用 `:focus-within` 在子元素获得焦点时保持菜单可见
- 支持 Escape 键关闭菜单/取消编辑（WCAG 建议）

## 技术栈

- React 19 + TypeScript + Vite
- Mantine UI 8
- proto 管理 Node/pnpm 版本（见 .prototools）
- GitHub Actions 自动部署到 GitHub Pages

## 文档语言

主文档为中文（README.md）。
