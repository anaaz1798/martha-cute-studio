import { useState, useEffect } from 'react';
import { supabase } from './supabase';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EventsPage from './pages/EventsPage';
import VitrinaPage from './pages/VitrinaPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'services': return <ServicesPage />;
      case 'appointments': return <AppointmentsPage />;
      case 'events': return <EventsPage />;
      case 'vitrina': return <VitrinaPage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      {/* Menu de navegacion rapida */}
      <nav style={{
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        padding: '15px', 
        background: '#111',
        overflowX: 'auto'
      }}>
        <button onClick={() => setCurrentPage('home')} style={navBtnStyle}>Inicio</button>
        <button onClick={() => setCurrentPage('services')} style={navBtnStyle}>Servicios</button>
        <button onClick={() => setCurrentPage('appointments')} style={navBtnStyle}>Citas</button>
        <button onClick={() => setCurrentPage('vitrina')} style={navBtnStyle}>Vitrina</button>
        <button onClick={() => setCurrentPage('admin')} style={{...navBtnStyle, color: '#d15690'}}>Admin</button>
        <button onClick={() => supabase.auth.signOut()} style={navBtnStyle}>Salir</button>
      </nav>

      <div style={{ padding: '20px' }}>
        {renderPage()}
      </div>
    </div>
  );
}

const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer'
};
