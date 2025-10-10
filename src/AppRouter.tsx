import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TimesheetsDashboard from './pages/DashBoardPage';
import LoginPage from './pages/LoginPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/dashboard" element={<TimesheetsDashboard />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<div className="text-center p-20 text-red-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;