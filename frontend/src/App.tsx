import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { BotList } from './features/bots/BotList';
import { ProxyManager } from './features/proxy/ProxyManager';
import { ApprovalGrid } from './features/approval/ApprovalGrid';
import { SettingsPage } from './features/settings/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<div>Dashboard Home</div>} />
          <Route path="bots" element={<BotList />} />
          <Route path="approval" element={<ApprovalGrid />} />
          <Route path="proxies" element={<ProxyManager />} />
          <Route path="system" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
