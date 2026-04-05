import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citas, setCitas] = useState([]); // Para el Admin
  
  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [tecnica, setTecnica] = useState('Balayage');
  const [detalles, setDetalles] = useState('');

  const CORREO_ADMIN = "marthacute@gmail.com"; // <-- PON EL CORREO DE TU HERMANA AQUÍ

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) {
        cargarCitas();
      }
    });
  }, []);

  const cargarCitas = async () => {
    const { data } = await supabase
      .from('citas')
      .select('*')
      .order('created_at', { ascending: false });
    setCitas(data || []);
  };

  const handleAuth = async (tipo) => {
    const { error } = tipo === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  };

  const handleSubmitPresupuesto = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('citas').insert([{ 
      nombre, servicio: 'Presupuesto de Color: ' + tecnica, fecha: detalles 
    }]);
    if (error) alert(error.message);
    else {
      const mensaje = `¡Hola Martha! Soy ${nombre}. Mi usuario: ${sesion.user.email}. Necesito presupuesto para ${tecnica}: ${detalles}`;
      window.open(`https://wa.me/584121663968?text=${encodeURIComponent(mensaje)}`, '_blank');
      alert("¡Solicitud enviada!");
    }
  };

  // --- VISTA DE LOGIN ---
  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <h2>Entrar</h2>
          <input type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-luxury" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-luxury" />
          <button onClick={() => handleAuth('login')} className="btn-luxury">Entrar</button>
          <button onClick={() => handleAuth('registro')} className="btn-outline">Registrarme</button>
        </div>
      </div>
    );
  }

  // --- VISTA ADMIN (Solo para Martha) ---
  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="iphone-container admin-view">
        <h1 className="greeting">Panel Admin 👑</h1>
        <button onClick={() => supabase.auth.signOut()} className="btn-salir">Cerrar Sesión</button>
        
        <div className="lista-citas">
          {citas.map((cita) => (
            <div key={cita.id} className="glass-card cita-item">
              <p><strong>Cliente:</strong> {cita.nombre}</p>
              <p><strong>Servicio:</strong> {cita.servicio}</p>
              <p><strong>Detalles:</strong> {cita.fecha}</p>
              <p className="fecha-badge">{new Date(cita.created_at).toLocaleDateString()}</p>
              <button onClick={() => window.open(`https://wa.me/584121663968`, '_blank')} className="btn-whatsapp-small">Contactar</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VISTA CLIENTE (El formulario de siempre) ---
  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={() => supabase.auth.signOut()}>Salir</button></div>
      <h1 className="greeting">Presupuesto</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmitPresupuesto}>
          <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre" required className="input-luxury"/>
          <select value={tecnica} onChange={(e)=>setTecnica(e.target.value)} className="input-luxury">
            <option value="Balayage">Balayage</option>
            <option value="Mechas">Mechas</option>
            <option value="Tinte Global">Tinte Global</option>
          </select>
          <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} placeholder="Estado de tu cabello..." className="input-luxury" style={{height:'100px'}} />
          <button type="submit" className="btn-luxury">Pedir Presupuesto 📱</button>
        </form>
      </div>
    </div>
  );
}
