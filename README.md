# 多输入交互演示

本演示展示了 UI 组件同时支持鼠标、键盘和触摸输入模式时的交互设计模式。

**在线演示**: https://ipoly.github.io/multi-input-interaction-demo/

## 问题背景

许多 UI 组件通过鼠标悬停来显示附加控件（如操作菜单）。但如果菜单仅在悬停时显示，触屏设备将无法访问这些控件。

## 解决方案

针对不同输入模式采用不同的交互策略：

| 输入模式 | 交互行为 |
| -------- | -------- |
| 鼠标 | 悬停时显示附加控件，点击立即触发操作 |
| 触摸 | 首次点击聚焦并显示控件，再次点击触发操作 |
| 键盘 | Tab 导航配合 Enter/Escape 激活/取消 |

## 交互规则

### 鼠标

| 操作 | 结果 |
| ---- | ---- |
| 悬停 Container | 显示 MenuTrigger |
| 点击 Label | 进入编辑模式 |
| 点击 MenuTrigger | 打开菜单 |
| 鼠标移出 | 隐藏菜单 |

### 键盘

| 操作 | 结果 |
| ---- | ---- |
| Tab 到 Container | 聚焦 + 显示 MenuTrigger |
| 在 Container 上按 Enter | 进入编辑模式 |
| 从 Container 按 Tab | 焦点移至 MenuTrigger |
| 在 MenuTrigger 上按 Enter/Space | 打开菜单 |
| 按 Escape | 关闭菜单/取消编辑 |

### 触摸

| 操作 | 结果 |
| ---- | ---- |
| 首次点击 Container（未聚焦） | 聚焦 + 显示 MenuTrigger |
| 再次点击 Container（已聚焦） | 进入编辑模式 |
| 点击 MenuTrigger | 打开菜单 |
| 点击其他区域 | 取消聚焦 |

## 组件结构

### 默认状态

```
┌─────────────────────────────────────────┐
│  Container (div, 可聚焦)                 │
│  ┌─────────────────────┬──────────┐     │
│  │  Label (span)       │  菜单 ⋮  │     │
│  │  "分类名称"          │  触发器  │     │
│  └─────────────────────┴──────────┘     │
└─────────────────────────────────────────┘
```

### 编辑状态

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

### 交互元素

| 元素 | 描述 | 可聚焦 |
| ---- | ---- | ------ |
| Container | 外层包装 `div` | 是 |
| Label | 显示名称的文本 `span` | 否 |
| MenuTrigger | 三点图标按钮 | 是 |

## 设计要点

1. **触摸需要两步操作** — 首次点击仅聚焦，再次点击才执行操作，避免误触
2. **点击外部关闭** — 触摸聚焦后或编辑态时，点击组件外部会退出当前状态
3. **Escape 键关闭** — WCAG 建议用户可通过 Escape 键关闭弹出内容
4. **焦点可见性** — 键盘导航时显示清晰的焦点环
5. **区分高亮与焦点环** — 高亮（背景变灰）表示"正在交互"，焦点环（蓝色边框）标识键盘焦点位置，两者是独立的视觉层

## 相关模式

以下 UI 模式都面临"悬停显示内容在触屏上无法访问"的问题，可以应用本文档的多输入交互方案：

### 折叠/展开组件（Disclosure Widgets）

如 Accordion、Collapsible Panel。常见问题：展开按钮仅在悬停时显示。

**应用方案**：
- 鼠标：悬停显示展开图标
- 触摸：首次点击显示图标，再次点击展开/折叠
- 键盘：聚焦时显示图标，Enter 切换状态

### 带键盘支持的下拉菜单

如导航菜单、筛选下拉框。常见问题：子菜单仅在悬停时展开。

**应用方案**：
- 鼠标：悬停展开子菜单
- 触摸：点击展开（而非悬停），再次点击选择项目
- 键盘：方向键导航，Enter 选择，Escape 关闭

### 可编辑列表项

本 Demo 展示的模式。如文件管理器、任务列表、标签管理。

**核心交互**：
- 显示模式 → 编辑模式的切换
- 操作菜单（重命名、删除等）的触发

### 滑动操作（Swipe Actions）

如邮件列表左滑删除、右滑归档。常见问题：操作按钮仅在滑动后显示，鼠标用户无法访问。

**应用方案**：
- 触摸：滑动显示操作按钮
- 鼠标：悬停显示操作按钮（替代滑动）
- 键盘：聚焦时显示操作按钮，快捷键触发

### 工具提示与信息气泡（Tooltips）

常见问题：提示仅在悬停时显示，触屏无法触发。

**应用方案**：
- 鼠标：悬停显示
- 触摸：长按显示，或在元素旁添加 ⓘ 信息图标
- 键盘：聚焦时显示

### 图片/卡片悬浮操作

如图片库的编辑/删除按钮、卡片的快捷操作。常见问题：操作按钮仅在悬停时浮现。

**应用方案**：
- 鼠标：悬停显示操作层
- 触摸：首次点击显示操作层，再次点击执行操作（或点击图片本身进入详情）
- 键盘：聚焦时显示操作层

---

## 技术实现

以下是面向开发者的技术细节。

### Mantine 提供的无障碍支持

本 Demo 使用 [Mantine](https://mantine.dev/) 组件库，它内置了许多无障碍功能：

| 功能 | Mantine 处理 | 我们实现 |
| ---- | ----------- | ------- |
| Menu 键盘导航（↑↓选择、Enter 确认） | ✅ | |
| Escape 关闭菜单 | ✅ | |
| 关闭后焦点返回触发器 | ✅ | |
| ActionIcon 的 `aria-label` 支持 | ✅ | |
| Tooltip 键盘聚焦显示 | ✅ | |
| 触摸两步交互 | | ✅ |
| 点击外部取消 touchFocused / 退出编辑态 | | ✅ |
| Container 整体聚焦/hover 显示菜单 | | ✅ |
| pointerType 区分输入模式 | | ✅ |
| 编辑模式退出后焦点恢复（`useFocusReturn`） | ✅ | ✅ |

Mantine 的 Menu 组件底层使用 [Floating UI](https://floating-ui.com/) + 自己实现的 WAI-ARIA 规范，省去了大量键盘导航代码。我们只需处理"悬停显示菜单按钮"和"触摸两步交互"这两个 Mantine 没覆盖的场景。

### 触摸交互实现

#### 核心挑战

触摸事件序列：

```
pointerdown → pointerup → click
```

一次触摸会触发多个事件。我们需要追踪这是否是"首次点击"（应仅聚焦）还是"再次点击"（应执行操作）。

#### 为什么使用运行时检测

CSS `@media (hover: hover)` 可以检测设备是否支持悬停，但对于 2 合 1 设备（同时支持触摸和鼠标），用户可能随时切换输入方式。运行时的 `pointerType` 检测能正确处理混合设备场景。

#### 解决方案：触摸聚焦状态追踪

```tsx
const [touchFocused, setTouchFocused] = useState(false);
const justTouchedRef = useRef(false);

// 1. 在 pointerdown 时标记触摸开始
const handlePointerDown = (e: React.PointerEvent) => {
  if (e.pointerType === "touch") {
    justTouchedRef.current = true;
  }
};

// 2. 在 pointerup 时根据状态决定行为
const handlePointerUp = (e: React.PointerEvent) => {
  if (e.pointerType === "touch") {
    if (justTouchedRef.current) {
      justTouchedRef.current = false;
      if (!touchFocused) {
        setTouchFocused(true);
        return; // 首次点击：仅获取焦点
      }
    }
  }
  onEnterEditing(); // 再次点击或鼠标点击：进入编辑模式
};

// 3. 点击外部时取消聚焦
useEffect(() => {
  if (!touchFocused) return;

  const handleDocumentPointerDown = (e: PointerEvent) => {
    if (!containerRef.current?.contains(e.target as Node)) {
      setTouchFocused(false);
    }
  };

  document.addEventListener("pointerdown", handleDocumentPointerDown);
  return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
}, [touchFocused]);
```

**为什么使用 `useRef` + `useState`？**

- `justTouchedRef` (useRef)：在 `pointerdown` 和 `pointerup` 之间的同步标志。Ref 同步更新且不会导致重新渲染。
- `touchFocused` (useState)：持续的触摸聚焦状态，用于控制 UI 显示和点击外部取消。

#### 场景验证

| 场景 | touchFocused | pointerType | 结果 |
| ---- | ------------ | ----------- | ---- |
| 鼠标点击 | - | mouse | 进入编辑 |
| 首次触摸（未聚焦） | false → true | touch | 仅聚焦 |
| 再次触摸（已聚焦） | true | touch | 进入编辑 |
| 触摸后点击外部 | true → false | touch | 取消聚焦 |
| 键盘 Tab 聚焦 | - | - | 仅聚焦 |

### 编辑模式焦点恢复

键盘用户退出编辑模式后，焦点应返回之前聚焦的元素。我们借用 Mantine 的 `useFocusReturn` hook：

```tsx
const returnFocus = useFocusReturn({
  opened: isEditing,
  shouldReturnFocus: true,
});

const confirmEditing = () => {
  setIsEditing(false);
  returnFocus(); // 恢复焦点到进入编辑前的元素
};
```

**要点**：
- hook 在 `isEditing` 变为 true 时自动记录当前焦点
- 只在主动退出（Escape/确认/取消）时调用 `returnFocus()`
- blur 导致的被动退出不恢复焦点，避免干扰用户意图

### CSS 实现

高亮与焦点环的触发场景：

| 场景 | 高亮 | 焦点环 |
| ---- | ---- | ------ |
| 鼠标 hover | ✅ | ❌ |
| Container 自身 focus | ✅ | ✅ |
| MenuTrigger focus（非编辑态） | ✅ | ❌ |
| 编辑态，input focus | ✅ | ✅ |
| 编辑态，确认/取消按钮 focus | ✅ | ✅ |
| touchFocused | ✅ | ❌ |

#### MenuTrigger 可见性

以下情况显示 MenuTrigger：

1. 鼠标悬停 Container
2. Container 或子元素拥有焦点
3. 触摸聚焦状态

```css
/* 默认：隐藏 */
.menu {
  visibility: hidden;
  opacity: 0;
}

/* 鼠标悬停时显示 */
.container:hover .menu {
  visibility: visible;
  opacity: 1;
}

/* 键盘焦点时显示 */
.container:focus-within .menu {
  visibility: visible;
  opacity: 1;
}

/* 触摸聚焦时显示（通过 data 属性） */
.menu[data-visible] {
  visibility: visible;
  opacity: 1;
}
```

#### 焦点环

```css
/* Container 自身获得焦点，或编辑态下子元素获得焦点 */
.container:focus-visible,
.container[data-editing]:has(:focus-visible) {
  outline: 2px solid var(--mantine-color-blue-5);
  outline-offset: -2px;
}
```

这样避免了非编辑态下 MenuTrigger 获得焦点时 Container 也显示焦点环的问题。

### 注意事项

#### 嵌套交互元素

本组件的 Container（`tabIndex={0}`）内嵌套了 MenuTrigger（button），这在 WCAG 4.1.2 中被视为需要注意的模式：交互控件不应包含可聚焦的子元素，否则屏幕阅读器可能忽略或异常处理嵌套控件。

**业界实践**：许多主流组件库（如 Mantine 的 Table、Ant Design 的 List）都采用了类似的嵌套模式。这是实用性与严格无障碍合规之间的权衡——严格遵循 WCAG 需要用 CSS 绝对定位实现视觉嵌套但 DOM 不嵌套，会增加实现复杂度。

本 Demo 保留嵌套结构以展示常见的实现方式，实际项目中可根据无障碍要求评估是否需要调整。

#### iPadOS Safari Tab 导航

iPadOS 上的 Safari 默认只允许 Tab 键在表单元素（input、select 等）之间导航，会跳过 button 元素。这与桌面版 Safari 和其他浏览器的行为不同。

**解决方案**：为 button 元素显式添加 `tabIndex={0}`，强制将其纳入 Tab 序列。

```tsx
<ActionIcon tabIndex={0}>⋮</ActionIcon>
```

这是 iPadOS Safari 的特有行为，桌面版 Safari 和 Chrome/Firefox 均不需要此修复。

## 参考资料

- [WCAG 1.4.13: Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html)
- [Use hover and focus best practices](https://www.accessguide.io/guide/hover-and-focus)
- [CSS Hover Media Queries: Touch vs Mouse](https://codelucky.com/css-hover-media-queries-touch-mouse/)
