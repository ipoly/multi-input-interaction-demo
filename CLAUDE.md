# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
pnpm dev           # 启动开发服务器
pnpm dev --host    # 启动开发服务器（局域网可访问，用于移动端测试）
pnpm build         # 构建生产版本（tsc + vite build）
pnpm lint          # ESLint 检查
pnpm preview       # 预览构建产物
```

## 项目概述

这是一个**多输入模式交互 Demo**，演示 UI 组件同时支持鼠标、键盘和触摸输入模式的交互设计方案。

核心问题：悬停显示的菜单在触屏设备上无法访问。解决方案是针对不同输入模式采用不同交互策略，使用 `pointerType` 运行时检测区分输入类型。

## 组件结构

```
src/components/
├── CategoryItem.tsx           # 核心交互组件（多输入模式支持）
├── CategoryItem.module.css    # 分类项样式
├── CategoryList.tsx           # 多列分类列表容器
├── CategoryList.module.css    # Grid 3 列布局样式
└── EditActions.tsx            # 编辑确认/取消按钮组（可复用）
```

## 技术要点

- 使用 Pointer Events API（`pointerdown`、`pointerup`）统一处理多种输入
- 通过 `e.pointerType` 区分 `"mouse"` 和 `"touch"`
- 触摸交互追踪"首次点击聚焦"状态：
  - `useRef` 作为 `pointerdown` → `pointerup` 的同步标志
  - `useState` 保持触摸聚焦状态
- CSS 使用 `:focus-within` 在子元素获得焦点时保持菜单可见
- 支持 Escape 键关闭菜单/取消编辑（WCAG 建议）
- 键盘 Enter 事件需检查 `e.target === e.currentTarget` 避免子元素事件冒泡
- 编辑模式退出后使用 `useFocusReturn` hook 恢复焦点（仅限 Escape/确认/取消，点击外部不恢复）
- 点击外部退出编辑态需要 document 级 `pointerdown` 监听（移动端触摸不触发 blur）
- 类型导出使用 `import type` 语法避免 Vite ESM 热更新问题
- 焦点环仅在 Container 自身获焦或编辑态时显示（用 `:focus-visible` + `[data-editing]:has(:focus-visible)`）
- 高亮（背景变灰）与焦点环（蓝色边框）是独立的视觉层，详见 README 设计要点
- Container 内嵌套 MenuTrigger 是 WCAG 4.1.2 需注意的模式，但业界组件库普遍采用（实用性权衡）
- iPadOS Safari Tab 导航会跳过 button 元素，需显式添加 `tabIndex={0}`（桌面版 Safari 无此问题）

## 技术栈

- React 19 + TypeScript + Vite
- Mantine UI 8
- proto 管理 Node/pnpm 版本（见 .prototools）
- GitHub Actions 自动部署到 GitHub Pages

## 文档语言

主文档为中文（README.md）。
