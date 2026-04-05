import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [citas, setCitas] = useState([]);
  
  // Estados para el formulario de clientas
  const [nombre, setNombre] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  const [subCatSeleccionada, setSubCatSeleccionada] = useState('');
  const [detalles, setDetalles] = useState('');

  const CORREO_ADMIN = "ana.az1798@gmail.com"; 

  const menuStudio = [
    { id: 'cabello', nombre: 'Cabello', icono: '💇‍♀️', color: '#ffafcc', opciones: ['Balayage', 'Corte', 'Secado', 'Keratina'] },
    { id: 'unas', nombre: 'Uñas', icono: '💅', color: '#bde0fe', opciones: ['Sistemas', 'Gel / Semi', 'Pedicura', 'Manicura'] },
    { id: 'cejas', nombre: 'Cejas', icono: '👁️', color: '#cdb4db', opciones: ['Lifting', 'Henna', 'Pestañas Punto', 'Depilación'] },
    { id: 'maquillaje', nombre: 'Maquillaje', icono: '💄', color: '#a2d2ff', opciones: ['Social', 'Novias', 'Noche', 'Clases'] }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) cargarDatosAdmin();
    });
  }, []);

  const cargarDatosAdmin = async () => {
    const { data } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
    setCitas(data || []);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setCargando(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error: " + error.message);
      setCargando(false);
    } else if (data.session) {
      window.location.reload();
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- VISTA LOGIN ---
  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <form onSubmit={handleAuth}>
            <input type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-luxury" required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-luxury" required />
            <button type="submit" className="btn-luxury" disabled={cargando}>{cargando ? "Cargando..." : "Entrar"}</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VISTA PANEL ADMINISTRACIÓN (EL DE LA FOTO) ---
  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="admin-dashboard">
        {/* Banner Superior */}
        <div className="admin-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1>Martha Cute Studio ✨</h1>
              <p>Panel de Administración</p>
              <h3>¡Hola, Ana! Bienvenido a tu Panel Jefa 👑</h3>
            </div>
            <button onClick={handleCerrarSesion} className="btn-logout-admin">Cerrar Sesión (Ana)</button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Citas de Hoy */}
          <div className="dash-card">
            <div className="card-header">
              <span className="icon-bg">📅</span>
              <h2>Citas de Hoy</h2>
            </div>
            <table className="dash-table">
              <thead>
                <tr><th>Nombre</th><th>Servicio</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {citas.slice(0, 3).map(c => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.servicio.split(':')[1]}</td>
                    <td><span className="status-pill">Pendiente</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Solicitudes Nuevas */}
          <div className="dash-card">
            <div className="card-header">
              <span className="icon-bg">📬</span>
              <h2>Solicitudes Nuevas</h2>
            </div>
            <div className="solicitudes-list">
              {citas.length > 0 ? citas.map(c => (
                <div key={c.id} className="solicitud-item">
                  <p><strong>{c.nombre}</strong> - {c.servicio}</p>
                  <button onClick={() => window.open(`https://wa.me/584121663968`, '_blank')} className="btn-mini-wa">Contactar</button>
                </div>
              )) : <p>No hay solicitudes nuevas</p>}
            </div>
          </div>

          {/* Gestión de Catálogo */}
          <div className="dash-card">
            <div className="card-header">
              <span className="icon-bg">🎨</span>
              <h2>Gestión de Catálogo</h2>
            </div>
            <div className="cat-stats">
              {menuStudio.map(cat => (
                <div key={cat.id} className="stat-pill">
                  <strong>{cat.nombre}</strong>
                  <span>{cat.opciones.length} servicios</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notificaciones flotantes simuladas */}
        <div className="notif-toast">
          <p>🔔 Nueva solicitud recibida hace 2 mins</p>
        </div>
      </div>
    );
  }

  // --- VISTA CLIENTAS (BANNERS E ICONOS) ---
  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={handleCerrarSesion} className="btn-logout-mini">Cerrar Sesión</button></div>
      <h1 className="greeting">¿Qué nos hacemos hoy?</h1>
      
      {!catSeleccionada ? (
        <div className="category-grid">
          {menuStudio.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => { setCatSeleccionada(cat); setSubCatSeleccionada(cat.opciones[0]); }} style={{ backgroundColor: cat.color }}>
              <span className="cat-icon">{cat.icono}</span>
              <h3>{cat.nombre}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card animate-fade">
          <button onClick={() => setCatSeleccionada(null)} className="btn-back">⬅ Volver</button>
          <h2>{catSeleccionada.icono} {catSeleccionada.nombre}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('citas').insert([{ nombre, servicio: `${catSeleccionada.nombre}: ${subCatSeleccionada}`, fecha: detalles }]);
            if (error) alert(error.message);
            else {
              window.open(`https://wa.me/584121663968?text=${encodeURIComponent(`¡Hola! Soy ${nombre}. Cita para ${catSeleccionada.nombre}: ${subCatSeleccionada}. ${detalles}`)}`, '_blank');
              alert("¡Solicitud enviada!");
              setCatSeleccionada(null);
            }
          }}>
            <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre" required className="input-luxury"/>
            <select value={subCatSeleccionada} onChange={(e)=>setSubCatSeleccionada(e.target.value)} className="input-luxury">
              {catSeleccionada.opciones.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} placeholder="Detalles extra..." className="input-luxury" />
            <button type="submit" className="btn-luxury">Solicitar Cita 📱</button>
          </form>
        </div>
      )}
    </div>
  );
}
