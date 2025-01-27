import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuduratTest from './pages/QuduratTest';
import TahsiliTest from './pages/TahsiliTest';
import { AuthProvider } from './context/AuthContext';

function App(): React.ReactElement {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/admin',
      element: <AdminDashboard />
    },
    {
      path: '/qudurat/:type/:subject',
      element: <QuduratTest />
    },
    {
      path: '/tahsili/:subject',
      element: <TahsiliTest />
    }
  ]);

  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;