# 多输入交互演示

本演示展示了 UI 组件同时支持鼠标、键盘和触摸输入模式时的交互设计模式。

### 组件结构

**默认状态**

```
┌─────────────────────────────────────────┐
│  Container (div, 可聚焦)                 │
│  ┌─────────────────────┬──────────┐     │
│  │  Label (span)       │  菜单 ⋮  │     │
│  │  "分类名称"          │  触发器  │     │
│  └─────────────────────┴──────────┘     │
└─────────────────────────────────────────┘
```

**编辑状态**

```
┌─────────────────────────────────────────┐
│  Container (div)                        │
│  ┌─────────────────────────────────┐    │
│  │  Input (input, 自动聚焦)         │    │
│  │  "分类名称"                      │    │
│  └─────────────────────────────────┘    │
│                          ┌────┬────┐    │
│                          │ ✕  │ ✓  │    │
│                          │取消│确认│    │
│                          └────┴────┘    │
└─────────────────────────────────────────┘
```

## 问题背景

许多 UI 组件通过鼠标悬停来显示附加控件（如操作菜单）。但如果菜单仅在悬停时显示，触屏设备将无法访问这些控件。

### 解决方案

针对不同输入模式采用不同的交互策略：

- **鼠标**：悬停时显示附加控件，点击立即触发操作
- **触摸**：首次点击聚焦并显示控件，再次点击触发操作
- **键盘**（可选增强）：Tab 导航配合 Enter/Space 激活

### 交互元素

| 元素        | 描述                  | 可聚焦 |
| ----------- | --------------------- | ------ |
| Container   | 外层包装 `div`        | 是     |
| Label       | 显示名称的文本 `span` | 否     |
| MenuTrigger | 三点图标按钮          | 是     |

## 交互规则

### 鼠标

| 操作             | 结果             |
| ---------------- | ---------------- |
| 悬停 Container   | 显示 MenuTrigger |
| 点击 Label       | 进入编辑模式     |
| 点击 MenuTrigger | 打开菜单         |
| 鼠标移出         | 隐藏菜单         |

### 键盘

| 操作                            | 结果                    |
| ------------------------------- | ----------------------- |
| Tab 到 Container                | 聚焦 + 显示 MenuTrigger |
| 在 Container 上按 Enter         | 进入编辑模式            |
| 从 Container 按 Tab             | 焦点移至 MenuTrigger    |
| 在 MenuTrigger 上按 Enter/Space | 打开菜单                |
| 按 Escape                       | 关闭菜单/取消编辑       |

### 触摸

| 操作                         | 结果                    |
| ---------------------------- | ----------------------- |
| 首次点击 Container（未聚焦） | 聚焦 + 显示 MenuTrigger |
| 再次点击 Container（已聚焦） | 进入编辑模式            |
| 点击 MenuTrigger             | 打开菜单                |

## 技术方案

### 核心挑战

触摸事件序列：

```
pointerdown → focus → pointerup → click
```

一次触摸会同时触发 `focus` 和 `click`。我们需要追踪焦点是否刚刚由这次触摸触发。

### 为什么使用运行时检测

CSS `@media (hover: hover)` 可以检测设备是否支持悬停，但对于 2 合 1 设备（同时支持触摸和鼠标），用户可能随时切换输入方式。运行时的 `pointerType` 检测能正确处理混合设备场景。

### 解决方案：触摸触发焦点追踪

```tsx
const pendingTouchFocus = useRef(false);
const [justFocused, setJustFocused] = useState(false);

// 1. 在 pointerdown 时标记待处理的触摸焦点
const handlePointerDown = (e: React.PointerEvent) => {
  if (e.pointerType === "touch") {
    pendingTouchFocus.current = true;
  }
};

// 2. 仅当焦点由触摸触发时设置 justFocused
const handleFocus = () => {
  if (pendingTouchFocus.current) {
    setJustFocused(true);
    pendingTouchFocus.current = false;
  }
};

// 3. 根据输入类型和焦点状态决定行为
const handlePointerUp = (e: React.PointerEvent) => {
  // 仅处理 Label 上的点击，不处理 MenuTrigger
  if (!contentRef.current?.contains(e.target as Node)) {
    return;
  }

  if (e.pointerType === "touch") {
    if (justFocused) {
      setJustFocused(false);
      return; // 首次点击：仅获取焦点
    }
    onEnterEditing(); // 再次点击：进入编辑模式
  } else if (e.pointerType === "mouse") {
    onEnterEditing(); // 鼠标点击：直接进入编辑模式
  }
};

// 4. 失焦时重置状态
const handleBlur = () => {
  setJustFocused(false);
  pendingTouchFocus.current = false;
};
```

### 为什么使用 `useRef` + `useState`？

- `pendingTouchFocus` (useRef)：在 `pointerdown` 中设置、在 `focus` 中立即读取的同步标志。Ref 同步更新且不会导致重新渲染。
- `justFocused` (useState)：持续到 `pointerup` 的状态。需要在 `focus` 和 `pointerup` 之间的微任务中保持存在。

### 场景验证

| 场景               | 触发焦点 | justFocused | pointerType | 结果     |
| ------------------ | -------- | ----------- | ----------- | -------- |
| 鼠标点击（未聚焦） | 是       | false       | mouse       | 进入编辑 |
| 鼠标点击（已聚焦） | 否       | false       | mouse       | 进入编辑 |
| 首次触摸（未聚焦） | 是       | true        | touch       | 仅聚焦   |
| 再次触摸（已聚焦） | 否       | false       | touch       | 进入编辑 |
| 键盘 Tab 聚焦      | 是       | false       | -           | 仅聚焦   |
| Tab 聚焦后触摸     | 否       | false       | touch       | 进入编辑 |

## CSS 实现

### MenuTrigger 可见性

以下情况显示 MenuTrigger：

1. 鼠标悬停 Container（原生 hover）
2. Container 拥有焦点
3. MenuTrigger 拥有焦点

```css
/* 默认：隐藏 */
.menu-trigger {
  visibility: hidden;
  opacity: 0;
}

/* 原生 hover 时显示（不包括触摸） */
.container:hover .menu-trigger {
  visibility: visible;
  opacity: 1;
}

/* 任意子元素获得焦点时显示 */
.container:focus-within .menu-trigger {
  visibility: visible;
  opacity: 1;
}
```

### 焦点视觉反馈

```css
.container:focus {
  background-color: var(--focus-bg);
  outline: none; /* 使用自定义视觉效果替代 outline */
}
```

## 要点总结

1. **使用 `pointerType`** 区分鼠标和触摸交互
2. **追踪触摸触发的焦点**：在 `pointerdown` 中设置 ref 标志，在 `focus` 中消费
3. **使用 `focus-within`** 在子元素获得焦点时保持菜单可见
4. **区分原生 hover 和触摸 hover**，避免在触摸设备上产生误判
5. **始终在失焦时重置状态**，确保下次交互时状态干净
6. **支持 Escape 键关闭**：WCAG 建议用户可通过 Escape 键关闭弹出内容

## 相关模式

- 折叠/展开组件（Disclosure widgets）
- 带键盘支持的下拉菜单
- 可编辑列表项
- 移动端友好的操作按钮

## 参考资料

- [WCAG 1.4.13: Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html)
- [Use hover and focus best practices](https://www.accessguide.io/guide/hover-and-focus)
- [CSS Hover Media Queries: Touch vs Mouse](https://codelucky.com/css-hover-media-queries-touch-mouse/)
