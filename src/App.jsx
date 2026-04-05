import { supabase } from './supabase'
import React, { useState } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  const [subCatSeleccionada, setSubCatSeleccionada] = useState('');
  const [detalles, setDetalles] = useState('');
  const [citas, setCitas] = useState([]);

  const CORREO_ADMIN = "ana.az1798@gmail.com"; 

  const menuStudio = [
    { id: 'cabello', nombre: 'Cabello', icono: '💇‍♀️', color: '#ffafcc', opciones: ['Balayage', 'Corte', 'Secado', 'Keratina'] },
    { id: 'unas', nombre: 'Uñas', icono: '💅', color: '#bde0fe', opciones: ['Sistemas', 'Gel / Semi', 'Pedicura', 'Manicura'] },
    { id: 'cejas', nombre: 'Cejas', icono: '👁️', color: '#cdb4db', opciones: ['Lifting', 'Henna', 'Pestañas Punto', 'Depilación'] },
    { id: 'maquillaje', nombre: 'Maquillaje', icono: '💄', color: '#a2d2ff', opciones: ['Social', 'Novias', 'Noche', 'Clases'] }
  ];

  // Función de Login Reforzada
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        alert("Pana, algo pasó: " + error.message);
        return;
      }

      if (data.session) {
        setSesion(data.session);
        if (data.session.user.email === CORREO_ADMIN) {
          const { data: lista } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
          setCitas(lista || []);
        }
      }
    } catch (err) {
      alert("Error crítico de código: " + err.message);
    }
  };

  // 1. PANTALLA DE LOGIN (Si no hay sesión)
  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="input-luxury" required />
            <input type="password" placeholder="Clave" value={password} onChange={(e) => setPassword(e.target.value)} className="input-luxury" required />
            <button type="submit" className="btn-luxury">Entrar al Studio 🚀</button>
          </form>
        </div>
      </div>
    );
  }

  // 2. PANEL JEFA (Si el correo es el tuyo)
  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="admin-dashboard" style={{backgroundColor: '#fce4ec', minHeight: '100vh', padding: '20px'}}>
        <div className="admin-banner" style={{background: 'linear-gradient(90deg, #ffc1e3, #e1bee7)', padding: '25px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '24px'}}>Martha Cute Studio ✨</h1>
            <p style={{margin: 0}}>Panel de Administración</p>
            <h3 style={{marginTop: '10px'}}>¡Hola, Ana! Bienvenida Jefa 👑</h3>
          </div>
          <button onClick={() => window.location.reload()} className="btn-logout-mini">Salir</button>
        </div>
        
        <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
          <div className="dash-card" style={{background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{borderBottom: '2px solid #fce4ec', paddingBottom: '10px'}}>📬 Solicitudes Nuevas</h3>
            {citas.length > 0 ? citas.map(c => (
              <div key={c.id} style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>
                <strong>{c.nombre}</strong> - {c.servicio}
              </div>
            )) : <p>No hay citas registradas.</p>}
          </div>
        </div>
      </div>
    );
  }

  // 3. VISTA CLIENTA (Banners e Iconos)
  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={() => window.location.reload()} className="btn-logout-mini">Salir</button></div>
      <h1 className="greeting">¿Qué nos hacemos hoy?</h1>
      
      {!catSeleccionada ? (
        <div className="category-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
          {menuStudio.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => { setCatSeleccionada(cat); setSubCatSeleccionada(cat.opciones[0]); }} style={{ backgroundColor: cat.color, padding: '20px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer' }}>
              <span style={{fontSize: '40px', display: 'block'}}>{cat.icono}</span>
              <h3 style={{marginTop: '10px'}}>{cat.nombre}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card">
          <button onClick={() => setCatSeleccionada(null)} className="btn-back" style={{color: 'white', background: 'none', border: 'none', cursor: 'pointer'}}>⬅ Volver</button>
          <h2 style={{color: 'white', margin: '15px 0'}}>{catSeleccionada.icono} {catSeleccionada.nombre}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('citas').insert([{ nombre, servicio: `${catSeleccionada.nombre}: ${subCatSeleccionada}`, fecha: detalles }]);
            if (error) alert(error.message);
            else {
              window.open(`https://wa.me/584121663968?text=Hola! Soy ${nombre}, quiero cita para ${subCatSeleccionada}`, '_blank');
              setCatSeleccionada(null);
            }
          }}>
            <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="input-luxury" required />
            <select value={subCatSeleccionada} onChange={(e)=>setSubCatSeleccionada(e.target.value)} className="input-luxury">
              {catSeleccionada.opciones.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <textarea placeholder="Detalles extra..." value={detalles} onChange={(e)=>setDetalles(e.target.value)} className="input-luxury" style={{marginTop: '10px'}} />
            <button type="submit" className="btn-luxury" style={{marginTop: '15px'}}>Solicitar Cita 📱</button>
          </form>
        </div>
      )}
    </div>
  );
}
      )}
    </div>
  );
}
