import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import your page components
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Items from './pages/Items';
import Transactions from './pages/Transactions';
import Users from './pages/Users';
import Schedule from './pages/Schedule';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;