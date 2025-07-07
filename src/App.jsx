import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/Chat';
import TaskPage from './pages/Task';
import CompetitorPage from './pages/Competitor';
import ContentPage from './pages/Content';
import SchedulePage from './pages/Schedule';
import FavoritesPage from './pages/Favorites';
import HistoryPage from './pages/History';
import AccountPage from './pages/Account';
import ApiTestPage from './pages/ApiTest';
import MCPTestPage from './pages/MCP/MCPTest';
import XhsManagementPage from './pages/XHS';
import ExamplesPage from './pages/Examples';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="task" element={<TaskPage />} />
          <Route path="competitor" element={<CompetitorPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="examples" element={<ExamplesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="api-test" element={<ApiTestPage />} />
          <Route path="mcp-test" element={<MCPTestPage />} />
          <Route path="xhs" element={<XhsManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 