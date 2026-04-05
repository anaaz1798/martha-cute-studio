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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) cargarCitas();
    });
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

  const handleAuth = async (tipo) => {
    const { data, error } = tipo === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else if (data.session) window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const servicioFinal = `${catSeleccionada.nombre}: ${subCatSeleccionada}`;
    const { error } = await supabase.from('citas').insert([{ 
      nombre, servicio: servicioFinal, fecha: detalles 
    }]);
    if (error) alert(error.message);
    else {
      const mensaje = `¡Hola Martha! ✨ Soy ${nombre}. Quiero cita para ${servicioFinal}. ${detalles}`;
      window.open(`https://wa.me/584121663968?text=${encodeURIComponent(mensaje)}`, '_blank');
      alert("¡Solicitud enviada! 💅");
      setCatSeleccionada(null); setNombre(''); setDetalles('');
    }
  };

  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <input type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-luxury" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-luxury" />
          <button onClick={() => handleAuth('login')} className="btn-luxury">Entrar</button>
          <button onClick={() => handleAuth('registro')} className="btn-outline">Registrarme</button>
        </div>
      </div>
    );
  }

  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="iphone-container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
          <h1 className="greeting" style={{fontSize: '20px'}}>Panel Jefa 👑</h1>
          <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="btn-outline" style={{width:'auto', padding:'5px 10px'}}>Salir</button>
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
      <div style={{textAlign: 'right'}}><button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="btn-logout-mini">Cerrar Sesión</button></div>
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
          <form onSubmit={handleSubmit}>
            <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre" required className="input-luxury"/>
            <select value={subCatSeleccionada} onChange={(e)=>setSubCatSeleccionada(e.target.value)} className="input-luxury">
              {catSeleccionada.opciones.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} placeholder="Detalles adicionales..." className="input-luxury" />
            <button type="submit" className="btn-luxury">Solicitar Cita 📱</button>
          </form>
        </div>
      )}
    </div>
  );
}
