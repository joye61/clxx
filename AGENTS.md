# AGENTS.md

本仓库是面向移动端 H5 的基础组件库 `clxx`（React 19 + TypeScript + @emotion/react），以下规则对所有 AI Agent 在本工程内的工作均有效。

## 1. 沟通约定

- 所有回复使用中文。
- 不主动 push 到远程；除非用户显式要求，否则只做本地改动。
- 任务执行完成后，需自检产物：不允许遗留报错（编译 / 类型 / Lint），除非用户主动要求保留。

## 2. 项目结构

- `src/`：组件库源码，按 PascalCase 目录组织，每个组件一个目录（如 `Toast/`、`MapLocationSelection/`）。
  - 目录内常见文件：`index.tsx`（导出入口）、`style.ts`（emotion 样式）、子组件 `*.tsx`。
  - `src/Effect/` 存放自定义 hooks，`src/utils/` 存放无 React 依赖的工具函数。
  - 对外导出统一在 `src/index.ts` 维护。
- `test/`：基于 Vite 的本地预览工程，**只用于演示与人工验证 `src/` 下的组件**，不得承载业务逻辑。
  - 子目录使用 kebab-case（如 `map-location-selection/`），与 `src` 下的 PascalCase 目录一一对应。

## 3. 代码规范

- **一个文件只允许导出一个 React 组件**；同一文件内的辅助子组件必须拆分到独立文件。
- 组件文件使用 `.tsx`，纯逻辑 / 类型 / 工具使用 `.ts`。
- 样式优先使用 `@emotion/react`，写在同目录的 `style.ts` 中；避免引入新的 CSS-in-JS 方案。
- 公共依赖：`react@^19`、`@emotion/react`、`dayjs`、`lodash`、`history`；新增第三方依赖前先确认是否已有等价能力。
- TypeScript 严格类型：禁止用 `any` 屏蔽类型问题；导出的 props/类型放在组件文件顶部并显式 `export`。
- 注释只解释「为什么」与不易看出的约束，禁止逐行翻译代码。

## 4. Container 约束（强制）

本库所有组件的 `rem` 自适应、最大宽度居中、CSS 变量 `--clxx-max-width` 等能力均由 `src/Container` 提供。

- 任何使用本库的页面 / Demo / 测试入口，**必须把 `Container` 作为根组件**包裹其它组件，否则尺寸会失真。
- 修改 `Container` 时需同时验证 `Overlay`、`Fixed`、弹窗类组件（`Dialog`、`Toast`、`Alert`、`Loading`、`*Picker` 等）在 PC 端居中与最大宽度限制下的表现。

## 5. 测试与本地运行

- `test/` 工程：`cd test && npm run dev` 启动本地预览。
- 库本身：`npm run dev`（tsc watch）/ `npm run build`（清理后产出到 `build/`）。
- 新增 / 修改组件时，应在 `test/src/<对应目录>/` 下补充或更新最小可运行 Demo。
- 临时为调试创建、与正常逻辑无关的测试文件 / 代码，**任务完成前必须删除**。

## 6. 质量门禁

- 任何修改完成后，先自检：
  1. 是否引入新 bug 或破坏既有用例；如有，**必须修复**。
  2. 是否影响公共导出（`src/index.ts`）的兼容性。
  3. 是否在 `Container` 之外破坏了自适应行为。
- 涉及 `peerDependencies`（React/ReactDOM）相关 API 的改动，需确保仍兼容 React 19。
