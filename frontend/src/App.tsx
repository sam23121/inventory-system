import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './hooks/useAuth';

// Import your page components
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Items from './pages/Items';
import Transactions from './pages/Transactions';
import Users from './pages/Users';
import Schedule from './pages/Schedule';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/documents" element={<Documents />} />
            <Route path="/items" element={<Items />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<Users />} />
            <Route path="/schedule" element={<Schedule />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;