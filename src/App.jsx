import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Chequear sesión al cargar
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Buscar el rol en tu tabla de perfiles
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', session.user.id)
          .single();
        setRol(data?.rol || 'cliente');
      }
      setLoading(false);
    };

    checkUser();

    // 2. Escuchar cambios de sesión (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const { data } = await supabase.from('perfiles').select('rol').eq('id', session.user.id).single();
        setRol(data?.rol || 'cliente');
      } else {
        setUser(null);
        setRol(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Cargando Martha Cute Studio... ✨</div>;

  // Si no hay usuario, directo al Login
  if (!user) return <LoginPage />;

  // Si eres admin, al Panel Jefa. Si no, al Home de clientes.
  return rol === 'admin' ? <AdminPage /> : <HomePage />;
}
