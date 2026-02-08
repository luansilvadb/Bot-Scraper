import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider } from '@fluentui/react-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardHome } from './features/dashboard/DashboardHome';
import { BotList } from './features/bots/BotList';
import { ProductList } from './features/products/ProductList';
import { SettingsPage } from './features/settings/SettingsPage';
import { WorkerList } from './features/workers/WorkerList';

function AppContent() {
  const { fluentTheme } = useTheme();

  return (
    <FluentProvider theme={fluentTheme}>
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
    </FluentProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

