import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home';
import ChatPage from './pages/Chat';
import NewPageInfo from './pages/Chat/NewPageInfo';
import ResearchPage from './pages/Chat/ResearchPage';
import TaskPage from './pages/Task';
import CompetitorPage from './pages/Competitor';
import ContentPage from './pages/Content';
import SchedulePage from './pages/Schedule';

import AccountPage from './pages/Account';
import ProductPage from './pages/Product';
import MCPTestPage from './pages/MCP/MCPTest';
import XhsManagementPage from './pages/XHS';
import ExamplesPage from './pages/Examples';
import WorkflowPage from './pages/workflow/WorkflowPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import KnowledgePage from './pages/Knowledge';
import LightRAGPage from './pages/LightRAG';
import CategorizedNotesPage from './pages/CategorizedNotesPage';
import HelpPage from './pages/Resources/Help';
import BlogPage from './pages/Resources/Blog';
import ChangelogPage from './pages/Resources/Changelog';
import PrivacyPage from './pages/Legal/Privacy';
import TermsPage from './pages/Legal/Terms';
import CookiesPage from './pages/Legal/Cookies';
import CompliancePage from './pages/Legal/Compliance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 资源与法律合规单页 */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/cookies" element={<CookiesPage />} />
        <Route path="/legal/compliance" element={<CompliancePage />} />
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="workflow" replace />} />
          <Route path="new-page-info" element={<NewPageInfo />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="workflow" element={<WorkflowPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="task" element={<TaskPage />} />
          <Route path="competitor" element={<CompetitorPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="examples" element={<ExamplesPage />} />

          <Route path="account" element={<AccountPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="mcp-test" element={<MCPTestPage />} />
          <Route path="xhs" element={<XhsManagementPage />} />
          <Route path="knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="lightrag" element={<LightRAGPage />} />
          <Route path="categorized-notes" element={<CategorizedNotesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
