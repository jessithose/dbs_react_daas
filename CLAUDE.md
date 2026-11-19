# Project instructions — dbs_react_daas

## Read this first / 请首先阅读

**At the START of every session, before anything else:**
**每次会话开始时，先做以下事情：**

1. `Read CLAUDE_LOG.md` in the project root — review its most recent entries to recall
   what was requested, done, decided, and left pending.
   阅读项目根目录下的 `CLAUDE_LOG.md` —— 查看最近的条目，回忆已完成、已决定与待办。
2. For architecture, layout, build/run steps and port map, see `README.md` (bilingual).
   架构、目录结构、构建/运行步骤与端口映射见 `README.md`（中英双语）。
3. When you do something notable, append a new entry (or update the current one) at the
   **end** of `CLAUDE_LOG.md`. Keep the format already used in that file.
   做了重要的事情后，请在 `CLAUDE_LOG.md` **末尾**追加一条新条目（或更新当前条目），
   保持文件中原有格式。
4. Do **not** delete, trim or reorder old entries in `CLAUDE_LOG.md` without asking the
   user. 未经用户同意，请勿删除、精简或重排 `CLAUDE_LOG.md` 中的旧条目。

## Dev/build workflow rules / 开发 / 构建流程规则

**Before changing ANY code, and before running a production build, follow these
workflow rules.**
**在改动任何代码之前、以及执行生产构建之前，请遵守以下流程规则。**

1. **Stop the dev servers first, then build.** If any dev server is running, stop it
   **before** changing code. After code changes, run a full `npm run build` to verify
   (exit code `0`) — do **not** rely only on HMR.
   先停 dev 再构建。若仍有 dev server 正在运行，**改动代码前先将其停止**；改动完成后用
   完整 `npm run build` 复核（退出码 `0`）——不要只依赖 HMR。
2. **Never rebuild while a dev server is alive.** Running `npm run build` on an app
   while its dev server is running pollutes the shared `dist/` with content-hashed
   artifacts → `Chunk is from another build` errors. 一个 app 的 dev server 运行期间
   **绝不要**对该 app 执行 `npm run build`（共用 `dist/` → 内容哈希产物污染 →
   `Chunk is from another build` 报错）。
3. **Shut all dev servers down when closing the shell.** If this shell window is
   closed, stop **all** of the project's dev servers first (kill the leftover rsbuild
   dev processes, e.g. on ports 3000–3005, and any background dev task such as
   `b3m224wqm`) so no stray processes or port conflicts remain.
   关闭 shell 窗口前停止全部 dev。若此 shell 窗口被关闭，先停止**本项目所有** dev
   server（清理残留的 rsbuild dev 进程，例如端口 3000–3005，以及后台 dev 任务如
   `b3m224wqm`），避免遗留进程或端口冲突。

## Key facts / 关键事实

- Monorepo (npm workspaces `apps/*`): `host` (port 3000) + remotes `remote-auth` (3001),
  `remote-dashboard` (3002), `remote-payments` (3003), `remote-wealth` (3004),
  `remote-accounts` (3005), plus `remote-template` (3099, a copy-start template not in
  the root build/workspace scripts).
  单仓（npm workspaces `apps/*`）：`host`（端口 3000）+ remotes `remote-auth`（3001）、
  `remote-dashboard`（3002）、`remote-payments`（3003）、`remote-wealth`（3004）、
  `remote-accounts`（3005），以及 `remote-template`（3099，作为复制起点的模板，未列入
  根 build/workspace 脚本）。

- Host owns routing (react-router v7); remotes are self-contained, fed via props,
  mutated via callbacks. react / react-dom / react-router / zustand are shared singletons.
  Host 拥有路由；remotes 自包含，经 props 注入数据、经回调接收变更。react /
  react-dom / react-router / zustand 为共享单例。
- Root scripts: `dev`, `dev:core`, `build`, `preview`, `install:dbs`.
  根脚本：`dev`、`dev:core`、`build`、`preview`、`install:dbs`。
- DBS SDK `@dbs/webstudio-hub-athena-daas` is an optional dep (404 on public npm),
  non-blocking. DBS SDK 为可选依赖（公共 npm 404），不阻塞。
- `npm run build` compiles remotes first, then host; verified exit code `0`.
  `npm run build` 先构建 remotes 再构建 host；已验证退出码 `0`。
