import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { initDbsSdk, type DbsSdkHandle } from './daas/initDbsSdk';
import { seedDemoData } from './stores/global';

/**
 * Application bootstrap. Starts the (best-effort, non-blocking) DBS SDK
 * integration, seeds a local mock of the DaaS customer-data slices, and mounts
 * the React app via the host-owned router.
 * 应用启动引导。启动（尽力而为、非阻塞的）DBS SDK 集成，为 DaaS 客户数据切片
 * 注入一份本地 mock 数据，并通过 host 拥有的路由挂载 React 应用。
 */
async function start(): Promise<void> {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    throw new Error('Root DOM node #root not found');
  }

  // Best-effort DBS SDK init. Never blocks startup — when the internal SDK
  // isn't installed it just logs a warning and the app uses a passthrough.
  // 尽力而为的 DBS SDK 初始化。绝不阻塞启动 —— 当内部 SDK 未安装时，
  // 它只会记录一条警告，应用使用直通（passthrough）逻辑。
  const dbs: DbsSdkHandle = await initDbsSdk();
  const DbsRoot = dbs.Root;

  // Local demo data (mirrors the DaaS CFO slice shapes documented for the
  // platform) so every MFE has something realistic to render without a backend.
  // 本地演示数据（模拟平台上文档所述的 DaaS CFO 切片结构），使每个 MFE 在
  // 没有后端的情况下也能渲染出真实感的内容。
  seedDemoData();

  // Router is host-owned. Import dynamically to keep the federation graph simple.
  // 路由由 host 拥有。使用动态导入以保持联邦依赖图简单。
  const { Router } = await import('./router');

  createRoot(rootEl).render(
    <StrictMode>
      <DbsRoot>
        <Router />
      </DbsRoot>
    </StrictMode>,
  );
}

void start();
