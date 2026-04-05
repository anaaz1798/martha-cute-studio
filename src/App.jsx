import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citas, setCitas] = useState([]);
  
  const [nombre, setNombre] = useState('');
  const [tecnica, setTecnica] = useState('Balayage');
  const [detalles, setDetalles] = useState('');

  // AQUÍ ESTÁ TU LLAVE MAESTRA
  const CORREO_ADMIN = "ana.az1798@gmail.com"; 

  useEffect(() => {
    // 1. Revisar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) cargarCitas();
    });

    // 2. Escuchar cambios de login/logout en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session);
      if (session?.user.email === CORREO_ADMIN) cargarCitas();
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarCitas = async () => {
    const { data } = await supabase
      .from('citas')
      .select('*')
      .order('created_at', { ascending: false });
    setCitas(data || []);
  };

  const handleAuth = async (tipo) => {
    const { data, error } = tipo === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) {
      alert(error.message);
    } else if (data.session) {
      // Forzamos recarga para limpiar cualquier rastro de caché
      window.location.reload();
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleSubmitPresupuesto = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('citas').insert([{ 
      nombre, servicio: 'Presupuesto de Color: ' + tecnica, fecha: detalles 
    }]);
    if (error) alert(error.message);
    else {
      const mensaje = `¡Hola Martha! ✨ Soy ${nombre}. Necesito presupuesto para ${tecnica}: ${detalles}`;
      window.open(`https://wa.me/584121663968?text=${encodeURIComponent(mensaje)}`, '_blank');
      alert("¡Enviado! 💅");
      setNombre(''); setDetalles('');
    }
  };

  // --- VISTA 1: LOGIN (Si no hay nadie conectado) ---
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

  // --- VISTA 2: PANEL ADMINISTRADOR (Solo para ti) ---
  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="iphone-container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
          <h1 className="greeting" style={{fontSize: '20px', margin: 0}}>Panel Jefa 👑</h1>
          <button onClick={handleCerrarSesion} style={{width:'auto', padding:'8px 15px', borderRadius:'10px', backgroundColor:'#ff4d4d', color:'white', border:'none'}}>Salir</button>
        </div>
        <div className="lista-citas">
          {citas.length > 0 ? citas.map((cita) => (
            <div key={cita.id} className="glass-card" style={{marginBottom:'15px', padding:'15px', textAlign:'left'}}>
              <p style={{margin: '5px 0'}}><strong>👤 Cliente:</strong> {cita.nombre}</p>
              <p style={{margin: '5px 0'}}><strong>🎨 Técnica:</strong> {cita.servicio}</p>
              <p style={{margin: '5px 0'}}><strong>📝 Pelo:</strong> {cita.fecha}</p>
              <button onClick={() => window.open(`https://wa.me/584121663968`, '_blank')} style={{backgroundColor:'#25d366', color:'white', padding:'8px', marginTop:'10px', width:'100%', border:'none', borderRadius:'8px'}}>WhatsApp</button>
            </div>
          )) : <p style={{color:'white', textAlign:'center'}}>No hay presupuestos todavía.</p>}
        </div>
      </div>
    );
  }

  // --- VISTA 3: CLIENTAS (Para cualquier otro usuario) ---
  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={handleCerrarSesion} style={{width:'auto', padding:'5px', background:'none', border:'1px solid white', color:'white', borderRadius:'5px'}}>Cerrar Sesión</button></div>
      <h1 className="greeting">Presupuesto de Color</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmitPresupuesto}>
          <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre" required className="input-luxury"/>
          <select value={tecnica} onChange={(e)=>setTecnica(e.target.value)} className="input-luxury">
            <option value="Balayage">Balayage</option>
            <option value="Mechas">Mechas</option>
            <option value="Tinte">Tinte</option>
          </select>
          <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} placeholder="Detalles de tu cabello..." className="input-luxury" style={{height:'100px'}} />
          <button type="submit" className="btn-luxury">Pedir Presupuesto 📱</button>
        </form>
      </div>
    </div>
  );
}
