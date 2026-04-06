import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function Router() {
  const { user, rol, loading } = useAuth();

  // Mientras carga la sesión, mostramos un mensaje bonito
  if (loading) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#fce4ec',
        color: '#ad1457',
        fontFamily: 'sans-serif'
      }}>
        <h2>Cargando Martha Cute Studio... ✨</h2>
      </div>
    );
  }

  // Si no hay usuario, mandamos al Login
  if (!user) {
    return <LoginPage />;
  }

  // Si es admin (Ana), mandamos al Panel Jefa. Si no, al Home de clientes.
  return rol === 'admin' ? <AdminPage /> : <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
