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

  useEffect(() => {
    const validarUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSesion(session);
        // Intentamos buscar tu rol
        let { data: perfil } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', session.user.id)
          .single();

        // Si no existes en la tabla, te creamos
        if (!perfil) {
          const esAdmin = session.user.email === "ana.az1798@gmail.com";
          const nuevoRol = esAdmin ? 'admin' : 'cliente';
          await supabase.from('perfiles').insert([
            { id: session.user.id, email: session.user.email, rol: nuevoRol }
          ]);
          setRol(nuevoRol);
        } else {
          setRol(perfil.rol);
        }
      }
    };
    validarUsuario();
    if (rol === 'admin') cargarCitas();
  }, [rol]);

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
      window.location.reload();
    }
  };

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

  // --- VISTA ADMINISTRADORA (Lo que querías ver) ---
  if (rol === 'admin') {
    return (
      <div className="admin-dashboard" style={{padding: '20px', backgroundColor: '#fce4ec', minHeight: '100vh'}}>
        <div className="admin-banner" style={{background: 'linear-gradient(90deg, #ffc1e3, #e1bee7)', padding: '20px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{margin:0, color: '#880e4f'}}>Dashboard Jefa 👑</h2>
          <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="btn-logout-mini">Salir</button>
        </div>
        <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
          <div className="dash-card" style={{background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{borderBottom: '2px solid #fce4ec', paddingBottom: '10px'}}>📬 Citas Nuevas</h3>
            {citas.length > 0 ? citas.map(c => (
              <div key={c.id} style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>
                <strong>{c.nombre}</strong> - {c.servicio}
              </div>
            )) : <p>Esperando clientes...</p>}
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA CLIENTE ---
  return (
    <div className="iphone-container">
      <h1 className="greeting">Bienvenida al Studio</h1>
      <p style={{color: 'white', textAlign: 'center'}}>Pronto verás nuestro catálogo aquí.</p>
      <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="btn-logout-mini" style={{marginTop: '20px'}}>Cerrar Sesión</button>
    </div>
  );
}
