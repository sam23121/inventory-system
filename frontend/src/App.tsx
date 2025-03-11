import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n/config';

// Import your page components
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Items from './pages/Items';
import Transactions from './pages/Transactions';
import Users from './pages/Users';
import Schedule from './pages/Schedule';
import LoginPage from './pages/LoginPage';
import Members from './pages/Members';
import Baptism from './pages/Baptism';
import Burial from './pages/Burials';
import Marriage from './pages/Marriages';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/items" element={<Items />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/users" element={<Users />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/members" element={<Members />} />
              <Route path="/baptisms" element={<Baptism />} />
              <Route path="/burials" element={<Burial />} />
              <Route path="/marriages" element={<Marriage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;