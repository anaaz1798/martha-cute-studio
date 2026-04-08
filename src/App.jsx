import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import LoginPage from './pages/LoginPage';
import Reservar from './pages/Reservar'; // IMPORTANTE: Agrega esta línea
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-[#d81b60] font-bold italic bg-[#fff5f7]">
      Cargando Martha Cute... ✨
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal con servicios y botones de acceso */}
        <Route path="/" element={<LoginPage />} />
        
        {/* ESTA ES LA QUE FALTABA: La pantalla donde eligen fecha y ponen sus datos */}
        <Route path="/reservar" element={<Reservar />} />
        
        {/* Manejo del Login */}
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/admin" />} />
        
        {/* Panel de administración protegido */}
        <Route path="/admin" element={session ? <AdminDashboard /> : <Navigate to="/login" />} />
        
        {/* Si escriben cualquier cosa vieja, al inicio de una */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
