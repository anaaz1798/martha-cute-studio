import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import LoginPage from './pages/LoginPage';
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
        {/* Ahora la raíz es LoginPage, que tiene la bienvenida y los servicios */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Si ya hay sesión y entran a /login, los mandamos al admin directamente */}
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/admin" />} />
        
        {/* El panel de administración protegido */}
        <Route path="/admin" element={session ? <AdminDashboard /> : <Navigate to="/login" />} />
        
        {/* Cualquier otra ruta loca se regresa al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
