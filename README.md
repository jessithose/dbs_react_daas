# dbs_react_daas — digiBank MFE Demo

A **digiBank-style multi-micro-frontend (MFE)** demo built with **Module Federation
2.0** on the modern **Rspack / Rsbuild** toolchain. It contains a **host** (shell)
that owns routing, auth and the shared global state, and **five remote MFEs**
(auth, dashboard, payments, digiWealth, accounts) that are mounted at runtime.
A `remote-template` folder serves as the starting point for adding more remotes.

一个 **digiBank 风格的多微前端（MFE）演示**，基于现代 **Rspack / Rsbuild**
工具链与 **Module Federation 2.0** 构建。项目包含一个 **host（壳）**，负责接管
路由、认证与共享全局状态，以及**五个 remote MFE**（auth、dashboard、payments、
digiWealth、accounts），它们在运行时被挂载。另有一个 `remote-template` 目录，
作为新增更多 remote 的起点。

---

## Tech stack / 技术栈

| Layer / 层 | Choice / 选型 |
|---|---|
| UI | React 18 (`^18.3.1`) |
| Micro-frontend / 微前端 | Module Federation 2.0 (`@module-federation/rsbuild-plugin`) |
| Build tool / 构建工具 | Rsbuild + Rspack (`@rsbuild/core`) |
| Routing / 路由 | React Router v7 (`react-router`, declarative mode) |
| State / 状态管理 | Zustand v5 |
| Styling / 样式 | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Language / 语言 | TypeScript |
| DBS platform / DBS 平台 | `@dbs/webstudio-hub-athena-daas` (optional, best-effort / 可选，尽力而为) |

---

## Repository layout / 目录结构

```
dbs_react_daas/
├─ package.json          # npm workspaces root (host + 5 remotes + template)
├─ README.md
└─ apps/
   ├─ host/              # port 3000 — CONSUMER / shell, owns routing & global store
   │  ├─ rsbuild.config.ts
   │  └─ src/
   │     ├─ router.tsx              # Host-owned react-router v7 routes
   │     ├─ AppLayout.tsx          # shell nav + header/footer + <Outlet/>
   │     ├─ bootstrap.tsx / index.ts
   │     ├─ components/
   │     │  ├─ createRemotePage.tsx        # generic MF lazy loader
   │     │  ├─ ErrorBoundary.tsx / NotFoundPage.tsx / RequireAuth.tsx
   │     │  └─ remotes/                    # per-remote host lazy wrappers
   │     │     ├─ LoginPageHost.tsx / DashboardPageHost.tsx
   │     │     └─ PaymentsPageHost.tsx / WealthPageHost.tsx / AccountsPageHost.tsx
   │     ├─ daas/initDbsSdk.tsx            # optional DBS SDK bootstrap
   │     ├─ stores/global.ts              # single source of truth (Zustand)
   │     └─ types/                        # remotes.d.ts, daas-sdk.d.ts
   ├─ remote-auth/      # port 3001 — exposes ./LoginPage        (login screen)
   ├─ remote-dashboard/ # port 3002 — exposes ./DashboardPage    (account overview)
   ├─ remote-payments/  # port 3003 — exposes ./PaymentsPage     (transfer / pay)
   ├─ remote-wealth/    # port 3004 — exposes ./WealthPage       (investments / holdings)
   ├─ remote-accounts/  # port 3005 — exposes ./AccountsPage     (accounts + transactions)
   └─ remote-template/  # port 3099 — TEMPLATE: copy me to add a new MFE
```

### Architecture notes / 架构说明

- **The host owns routing** (react-router v7, `createBrowserRouter`). Remotes export
  self-contained page/component modules only and **never mount their own router**.
  This follows the DBS platform guidance: *navigate() 属于 Host 的导航机制，MFE
  不应自行接管 Host 的 Router*.
  **Host 拥有路由**（react-router v7，`createBrowserRouter`）。Remotes 只导出
  自包含的页面/组件模块，**从不挂载自己的路由**。这遵循 DBS 平台指引：*navigate()
  属于 Host 的导航机制，MFE 不应自行接管 Host 的 Router*。
- Recom/react-dom/react-router/zustand are shared as **singletons** between host and
  remotes (a single copy at runtime, avoiding duplicated-React Hook errors).
  react/react-dom/react-router/zustand 在 host 与 remotes 之间作为**单例**共享
  （运行时只有一份副本，避免重复 React Hook 报错）。
- Remotes are resolved at runtime through each remote's **`mf-manifest.json`**
  (MF 2.0 runtime federation), generated with `manifest: true`.
  Remotes 在运行时通过各 remote 的 **`mf-manifest.json`** 解析（MF 2.0 运行时
  联邦），通过 `manifest: true` 生成。
- Remotes stay **self-contained**: host passes the data slices they need **via props**
  and receives mutations back **through callbacks** (e.g. after a payment the host
  "refreshes" balances — mirroring the documented `requestRemoteData` pattern).
  Remotes never touch the host store or router directly.
  Remotes 保持**自包含**：host 通过 **props** 传入它们所需的数据切片，并通过
  **回调**接收变更（例如支付完成后 host 会“刷新”余额——模拟文档里的
  `requestRemoteData` 模式）。Remotes 从不直接访问 host 的 store 或路由。

---

## Prerequisites / 环境要求

- **Node.js ≥ 20** (this machine has v26).
  **Node.js ≥ 20**（本机为 v26）。
- **npm**. If you hit an `EBADENGINE` / resolution error, upgrade first:
  **npm**。若遇到 `EBADENGINE` / 解析错误，请先升级：
  ```sh
  npm install -g npm@latest
  ```

---

## Install / 安装依赖

From the project root / 在项目根目录执行：

```sh
npm install
```

This installs all workspaces via npm workspaces (`apps/*`).
这会通过 npm workspaces（`apps/*`）安装所有工作区。

### ⚠️ DBS SDK — best-effort, non-blocking / 尽力而为，不阻塞

`@dbs/webstudio-hub-athena-daas` is an **internal DBS package that is not on the
public npm registry** (returns 404 unless a private registry is configured). It is an
**`optionalDependency`** of the host, so `npm install` **skips it with a warning and
still succeeds** — it never blocks the build.
`@dbs/webstudio-hub-athena-daas` 是**内部 DBS 包，不在公共 npm registry 上**
（除非配置了私有 registry，否则返回 404）。它是 host 的 **`optionalDependency`**，
因此 `npm install` 会**跳过它并给出警告但仍成功**——它从不阻塞构建。

- If the SDK is installed, the host initializes it at startup and the footer shows
  **"DBS SDK: loaded"**. If missing, it logs a `[daas]` warning, uses a passthrough
  provider and shows **"DBS SDK: stub (not installed)"** — the demo still runs.
  若安装了 SDK，host 会在启动时初始化它，页脚显示 **"DBS SDK: loaded"**；若缺失，
  则记录 `[daas]` 警告、使用透传 provider 并显示 **"DBS SDK: stub (not installed)"**
  —— 演示仍可运行。

Install it later once a registry is configured / 配置好 registry 后再安装：

```sh
npm run install:dbs
# or directly / 或直接:
npm install @dbs/webstudio-hub-athena-daas@latest --workspace @daas/host --save-optional
```

Toggles / 开关（可在 `rsbuild.config.ts` 的 `source.define` 中设置）：
- `DBS_DAAS_ENABLED=false` — disable SDK startup / 禁用 SDK 启动
- `DBS_DAAS_ENV=dev|sit|uat` — platform environment name / 平台环境名

---

## Run locally (development) / 本地开发运行

### Option A — all apps together (recommended) / 一次启动全部（推荐)

```sh
npm run dev
```

A lighter subset is also available / 也提供精简子集：
```sh
npm run dev:core   # host + auth + dashboard + payments + wealth (no accounts)
```

| App / 应用 | Port / 端口 | Standalone URL / 独立地址 |
|---|---|---|
| host | 3000 | http://localhost:3000 |
| remote-auth | 3001 | http://localhost:3001 |
| remote-dashboard | 3002 | http://localhost:3002 |
| remote-payments | 3003 | http://localhost:3003 |
| remote-wealth | 3004 | http://localhost:3004 |
| remote-accounts | 3005 | http://localhost:3005 |

Open the host and try the routes / 打开 host 并尝试路由：

| URL | What it shows / 内容 |
|---|---|
| `/` | → redirects to `/mfe/dashboard` / 重定向到 `/mfe/dashboard` |
| `/login` | Remote **auth** MFE — login screen / 远端 **auth** MFE — 登录页 |
| `/mfe/dashboard` | Remote **dashboard** MFE (account overview) / 远端 **dashboard** MFE（账户总览） |
| `/mfe/payments` | Remote **payments** MFE (transfer / pay) / 远端 **payments** MFE（转账/付款） |
| `/mfe/wealth` | Remote **wealth** MFE (digiWealth holdings) / 远端 **wealth** MFE（digiWealth 持仓） |
| `/mfe/accounts` | Remote **accounts** MFE (accounts + transactions) / 远端 **accounts** MFE（账户+交易） |

Notes / 说明：
- The remote MFE pages render into the host shell. Host ↔ remote communication flows
  over the singleton `zustand` dependency via props + callbacks — the remotes never
  touch the router.
  remote MFE 页面渲染进 host 壳内。Host ↔ remote 之间通过单例 `zustand` 依赖，
  以 props + 回调方式进行通信——remotes 从不触碰路由。
- DevTools Network will show each remote's `mf-manifest.json` and `remoteEntry.js`
  being fetched at runtime.
  在 DevTools Network 中可看到运行时拉取各 remote 的 `mf-manifest.json` 与
  `remoteEntry.js`。

### Option B — separately (start remotes first) / 分开启动（先起 remotes）

In multiple terminals / 在多个终端中：

```sh
cd apps/remote-auth      && npm run dev   # terminal 1 → port 3001
cd apps/remote-dashboard && npm run dev   # terminal 2 → port 3002
cd apps/remote-payments  && npm run dev   # terminal 3 → port 3003
cd apps/remote-wealth    && npm run dev   # terminal 4 → port 3004
cd apps/remote-accounts  && npm run dev   # terminal 5 → port 3005
cd apps/host             && npm run dev   # terminal 6 → port 3000
```

> Each remote's dev server has `dev.disableLiveReload: true` (or `dev.liveReload:
> false`) so the host does **not** force a full-page reload when you edit remote
> files (standard MF dev setup).
> 每个 remote 的开发服务器设置了 `dev.disableLiveReload: true`（或 `dev.liveReload:
> false`），这样编辑 remote 文件时 host 不会强制整页刷新（标准 MF 开发配置）。

---

## Build for production / 生产构建

```sh
npm run build
```

Builds every remote first (auth → dashboard → payments → wealth → accounts) then the
host, outputting to `apps/<app>/dist`. Exit code `0` on success.
先构建所有 remote（auth → dashboard → payments → wealth → accounts），再构建 host，
输出到 `apps/<app>/dist`。成功退出码为 `0`。

To preview the production build locally / 本地预览生产构建：

```sh
npm run preview
```

> For a fully static production deployment you would serve `dist/` behind a static
> server with SPA fallback (all non-asset routes → `index.html`) and rewrite the
> remote URLs in `apps/host/rsbuild.config.ts` to the real origins.
> 若要完全静态化部署，需要在带 SPA fallback（所有非资源路由 → `index.html`）的
> 静态服务器后托管 `dist/`，并把 `apps/host/rsbuild.config.ts` 中的 remote URL
> 改写为真实来源。

---

## Adding more remotes / 新增更多 remote

The project is designed to grow. Use `remote-template` as the starting point:
本项目设计为可持续扩展。以 `remote-template` 为起点：

1. **Copy the template** as `apps/remote-<name>` and update its
   `rsbuild.config.ts` → `name`, `port` (e.g. 3006) and `exposes`; update
   `package.json` → `name: @daas/remote-<name>`.
   **复制模板**为 `apps/remote-<name>`，更新其 `rsbuild.config.ts` 中的 `name`、
   `port`（如 3006）和 `exposes`；更新 `package.json` 中 `name: @daas/remote-<name>`。
   ```ts
   exposes: { './<Name>Page': './src/<Name>Page.tsx' },
   shared: { /* same singleton packages */ },
   ```
2. **Register it in the host** — add to `remotes` (+ keep same `shared` singletons)
   in `apps/host/rsbuild.config.ts`:
   **在 host 中注册**——在 `apps/host/rsbuild.config.ts` 的 `remotes` 中添加
   （并保持相同的 `shared` 单例）：
   ```ts
   remotes: {
     ...
     cards: 'cards@http://localhost:3006/mf-manifest.json',
   },
   ```
3. **Add a host-side lazy wrapper** — copy an existing file under `components/remotes/`
   or use the generic `createRemotePage`, changing the static specifier to
   `import('cards/CardsPage')`.
   **添加 host 端懒加载包装组件**——复制 `components/remotes/` 下已有文件，或使用
   通用 `createRemotePage`，把静态标识符改为 `import('cards/CardsPage')`。
4. **Add a route** — in `apps/host/src/router.tsx` under the layout:
   **添加路由**——在 `apps/host/src/router.tsx` 的 layout 下：
   ```tsx
   { path: 'mfe/cards', element: <CardsRoute /> },
   ```
5. **Add dependencies** to the new app's `package.json` and re-run `npm install`.
   Add them to each app's `shared` (singleton) if they must be a single copy across
   MFEs (e.g. a design system).
   **添加依赖**到新 app 的 `package.json` 并重新 `npm install`。若某依赖需要在多个
   MFE 间保持单份副本（例如设计系统），需加入各 app 的 `shared`（单例）。

---

## Troubleshooting / 常见问题排查

- **An MFE route shows a red "Failed to render remote" box** → that remote's server
  isn't running. Start it (see run instructions) and reload. For example, `/mfe/payments`
  requires the `remote-payments` dev server on :3003.
  **某个 MFE 路由显示红色 "Failed to render remote" 框** → 该 remote 的服务器未运行。
  启动它（见运行说明）并刷新。例如 `/mfe/payments` 需要 `remote-payments` 在
  :3003 上运行。
- **Hook / "Invalid hook call" errors** → two copies of React. Make sure the remote
  also shares `react`/`react-dom` as `singleton` and restart both dev servers.
  **Hook / "Invalid hook call" 错误** → React 有两份副本。确保 remote 也把
  `react`/`react-dom` 作为 `singleton` 共享，并重启两个 dev 服务器。
- **`EBADENGINE`/npx errors** → upgrade npm: `npm install -g npm@latest`.
  **`EBADENGINE`/npx 错误** → 升级 npm：`npm install -g npm@latest`。
- **DBS `[daas]` warning in console** → expected; the internal SDK is optional.
  **控制台 DBS `[daas]` 警告** → 正常现象；内部 SDK 为可选。

---

## Scripts (root) / 脚本（根目录）

| Command / 命令 | Description / 说明 |
|---|---|
| `npm run dev` | run host + all 5 remotes together / 一起运行 host + 全部 5 个 remote |
| `npm run dev:core` | run host + core remotes (no accounts) / 运行 host + 核心 remotes（不含 accounts） |
| `npm run build` | production build (remotes → host) / 生产构建（remotes → host） |
| `npm run preview` | serve production builds / 托管生产构建 |
| `npm run install:dbs` | best-effort install of the DBS SDK (skips on failure) / 尽力安装 DBS SDK（失败跳过） |

---

## Related docs / 相关文档

- `CLAUDE_LOG.md` — records each Claude Code session against this project. Review it
  at the start of every session to carry context forward (do **not** delete or trim
  entries without asking).
  `CLAUDE_LOG.md` —— 记录针对本项目的每次 Claude Code 会话。每次新会话开始时请先
  阅读以承接上下文（未经同意请勿删除或精简其中的条目）。
