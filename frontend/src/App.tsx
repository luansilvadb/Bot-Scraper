import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardHome } from './features/dashboard/DashboardHome';
import { BotList } from './features/bots/BotList';
import { ProductList } from './features/products/ProductList';
import { SettingsPage } from './features/settings/SettingsPage';
import { WorkerList } from './features/workers/WorkerList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardHome />} />
          <Route path="bots" element={<BotList />} />
          <Route path="workers" element={<WorkerList />} />
          <Route path="approval" element={<ProductList />} />
          <Route path="system" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

