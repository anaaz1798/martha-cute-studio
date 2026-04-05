import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [rol, setRol] = useState('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [citas, setCitas] = useState([]);
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  const [subCatSeleccionada, setSubCatSeleccionada] = useState('');

  useEffect(() => {
    // Al cargar, vemos si ya hay alguien logueado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSesion(session);
        // Buscamos el rol en la tabla de perfiles
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', session.user.id)
          .single();
        
        if (data) setRol(data.rol);
        if (data?.rol === 'admin') cargarCitas();
      }
    };
    checkUser();
  }, []);

  const cargarCitas = async () => {
    const { data } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
    setCitas(data || []);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert("Error: " + error.message);
      setCargando(false);
    } else {
      // Forzamos recarga para que el useEffect detecte el nuevo usuario
      window.location.reload();
    }
  };

  // --- LOGIN ---
  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-luxury" required />
            <input type="password" placeholder="Clave" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-luxury" required />
            <button type="submit" className="btn-luxury" disabled={cargando}>{cargando ? "Entrando..." : "Entrar"}</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VISTA JEFA (Si el rol es admin) ---
  if (rol === 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="admin-banner">
          <h1>Panel Jefa 👑</h1>
          <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="btn-logout-mini">Salir</button>
        </div>
        <div className="dash-card">
          <h3>Solicitudes Recibidas</h3>
          {citas.map(c => <div key={c.id} className="solicitud-item">{c.nombre} - {c.servicio}</div>)}
        </div>
      </div>
    );
  }

  // --- VISTA CLIENTE (Cuadros y Iconos) ---
  return (
    <div className="iphone-container">
      <h1 className="greeting">¿Qué nos hacemos hoy?</h1>
      <div className="category-grid">
        <div className="category-card" onClick={() => alert("Pronto!")} style={{backgroundColor: '#ffafcc'}}>
          <span style={{fontSize:'40px'}}>💅</span>
          <h3>Uñas</h3>
        </div>
        <div className="category-card" onClick={() => alert("Pronto!")} style={{backgroundColor: '#bde0fe'}}>
          <span style={{fontSize:'40px'}}>💇‍♀️</span>
          <h3>Cabello</h3>
        </div>
      </div>
      <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="btn-logout-mini">Cerrar Sesión</button>
    </div>
  );
}
