import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/Chat';
import TaskPage from './pages/Task';
import AnalyticsPage from './pages/Analytics';
import CompetitorPage from './pages/Competitor';
import ContentPage from './pages/Content';
import SchedulePage from './pages/Schedule';
import FavoritesPage from './pages/Favorites';
import HistoryPage from './pages/History';
import AccountPage from './pages/Account';
import ApiTestPage from './pages/ApiTest';
import MCPPage from './pages/MCP';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="task" element={<TaskPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="competitor" element={<CompetitorPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="api-test" element={<ApiTestPage />} />
          <Route path="mcp" element={<MCPPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 