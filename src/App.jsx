import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citas, setCitas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  const [subCatSeleccionada, setSubCatSeleccionada] = useState('');
  const [detalles, setDetalles] = useState('');

  const CORREO_ADMIN = "ana.az1798@gmail.com"; 

  const menuStudio = [
    { id: 'cabello', nombre: 'Cabello', icono: '💇‍♀️', color: '#ffafcc', opciones: ['Balayage', 'Corte', 'Secado', 'Keratina'] },
    { id: 'unas', nombre: 'Uñas', icono: '💅', color: '#bde0fe', opciones: ['Sistemas', 'Gel / Semi', 'Pedicura', 'Manicura'] },
    { id: 'cejas', nombre: 'Cejas & Pestañas', icono: '👁️', color: '#cdb4db', opciones: ['Lifting', 'Henna', 'Pestañas Punto', 'Depilación'] },
    { id: 'maquillaje', nombre: 'Maquillaje', icono: '💄', color: '#a2d2ff', opciones: ['Social', 'Novias', 'Noche', 'Clases'] }
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) cargarCitas();
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) cargarCitas();
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarCitas = async () => {
    const { data } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
    setCitas(data || []);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    if (data?.session) {
      // ESTO ES LO QUE IMPORTA: Forzar recarga total
      window.location.href = window.location.origin;
    }
  };

  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <form onSubmit={handleAuth}>
            <input type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-luxury" required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-luxury" required />
            <button type="submit" className="btn-luxury">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="iphone-container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
          <h1 className="greeting" style={{fontSize: '20px'}}>Panel Jefa 👑</h1>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="btn-outline" style={{width:'auto', padding:'5px 10px'}}>Salir</button>
        </div>
        <div className="lista-citas">
          {citas.map((cita) => (
            <div key={cita.id} className="glass-card" style={{marginBottom:'10px', textAlign:'left'}}>
              <p><strong>👤 {cita.nombre}</strong></p>
              <p>✨ {cita.servicio}</p>
              <button onClick={() => window.open(`https://wa.me/584121663968`, '_blank')} className="btn-wa">WhatsApp</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="btn-logout-mini">Cerrar Sesión</button></div>
      <h1 className="greeting">¿Qué nos hacemos hoy?</h1>
      {!catSeleccionada ? (
        <div className="category-grid">
          {menuStudio.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => { setCatSeleccionada(cat); setSubCatSeleccionada(cat.opciones[0]); }} style={{ backgroundColor: cat.color }}>
              <span style={{fontSize: '40px'}}>{cat.icono}</span>
              <h3 style={{color: '#444', marginTop: '10px'}}>{cat.nombre}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card animate-fade">
          <button onClick={() => setCatSeleccionada(null)} className="btn-back">⬅ Volver</button>
          <h2 style={{color: 'white', marginBottom: '15px'}}>{catSeleccionada.icono} {catSeleccionada.nombre}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('citas').insert([{ nombre, servicio: `${catSeleccionada.nombre}: ${subCatSeleccionada}`, fecha: detalles }]);
            if (error) alert(error.message);
            else { window.open(`https://wa.me/584121663968?text=${encodeURIComponent(`¡Hola! Soy ${nombre}. Cita para ${catSeleccionada.nombre}: ${subCatSeleccionada}. ${detalles}`)}`, '_blank'); alert("Enviado"); setCatSeleccionada(null); }
          }}>
            <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre" required className="input-luxury"/>
            <select value={subCatSeleccionada} onChange={(e)=>setSubCatSeleccionada(e.target.value)} className="input-luxury">
              {catSeleccionada.opciones.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} placeholder="Detalles..." className="input-luxury" />
            <button type="submit" className="btn-luxury">Solicitar Cita 📱</button>
          </form>
        </div>
      )}
    </div>
  );
}
