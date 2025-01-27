import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuduratTest from './pages/QuduratTest';
import TahsiliTest from './pages/TahsiliTest';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/qudurat/:type/:subject" element={<QuduratTest />} />
          <Route path="/tahsili/:subject" element={<TahsiliTest />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;