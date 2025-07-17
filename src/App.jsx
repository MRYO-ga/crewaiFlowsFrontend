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
import ProductPage from './pages/Product';
import ApiTestPage from './pages/ApiTest';
import MCPTestPage from './pages/MCP/MCPTest';
import XhsManagementPage from './pages/XHS';
import ExamplesPage from './pages/Examples';
import HomePage from './pages/GuidePage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="task" element={<TaskPage />} />
          <Route path="competitor" element={<CompetitorPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="examples" element={<ExamplesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="api-test" element={<ApiTestPage />} />
          <Route path="mcp-test" element={<MCPTestPage />} />
          <Route path="xhs" element={<XhsManagementPage />} />
          <Route path="knowledge-graph" element={<KnowledgeGraphPage />} />
        </Route>
        <Route path="/guide" element={<HomePage />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
      </Routes>
    </Router>
  );
}

export default App; 