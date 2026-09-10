import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProjectDashboard from './pages/dashboard/ProjectDashboard';
import MemberManagement from './pages/dashboard/MemberManagement';
import ProductBacklog from './pages/backlog/ProductBacklog';
import SprintPlanning from './pages/sprint/SprintPlanning';
import ScrumBoard from './pages/board/ScrumBoard';
import DeployedArchive from './pages/archive/DeployedArchive';
import CeremonyLogs from './pages/ceremony-logs/CeremonyLogs';

// Wrapper component to extract projectId from URL and pass it to MemberManagement
const MemberManagementWrapper: React.FC = () => {
const { projectId } = useParams<{ projectId: string }>();
  return <MemberManagement projectId={projectId || ''} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<ProjectDashboard />} />
        <Route path="/project/:projectId/members" element={<MemberManagementWrapper />} />
        <Route path="/project/:projectId/backlog" element={<ProductBacklog />} />
        <Route path="/project/:projectId/sprint-planning" element={<SprintPlanning />} />
        <Route path="/project/:projectId/board" element={<ScrumBoard />} />
        <Route path="/archive" element={<DeployedArchive />} />
        <Route path="/ceremonies" element={<CeremonyLogs />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
