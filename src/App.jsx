import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citas, setCitas] = useState([]);
  
  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [tecnica, setTecnica] = useState('Balayage');
  const [detalles, setDetalles] = useState('');

  // AQUÍ ESTÁ TU CORREO DE ADMIN
  const CORREO_ADMIN = "ana.az1798@gmail.com"; 

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
    
    if (error) alert("Error: " + error.message);
    else if (tipo === 'registro') alert("¡Casi listo! Revisa tu correo.");
  };

  const handleSubmitPresupuesto = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('citas').insert([{ 
      nombre, servicio: 'Presupuesto de Color: ' + tecnica, fecha: detalles 
    }]);

    if (error) alert("Error guardando: " + error.message);
    else {
      const mensaje = `¡Hola Martha! ✨ Soy ${nombre}. Necesito presupuesto para ${tecnica}: ${detalles}`;
      window.open(`https://wa.me/584121663968?text=${encodeURIComponent(mensaje)}`, '_blank');
      alert("¡Solicitud enviada con éxito! 💅");
      setNombre(''); setDetalles('');
    }
  };

  // --- 1. PANTALLA DE LOGIN ---
  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <h2 style={{textAlign: 'center', color: '#ff85a2'}}>Bienvenida</h2>
          <input type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-luxury" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-luxury" />
          <button onClick={() => handleAuth('login')} className="btn-luxury">Entrar</button>
          <button onClick={() => handleAuth('registro')} className="btn-outline">Registrarme</button>
        </div>
      </div>
    );
  }

  // --- 2. VISTA ADMIN (Solo para ti: ana.az1798@gmail.com) ---
  if (sesion.user.email === CORREO_ADMIN) {
    return (
      <div className="iphone-container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 className="greeting" style={{fontSize: '20px'}}>Panel Jefa 👑</h1>
          <button onClick={() => supabase.auth.signOut()} style={{width:'auto', padding:'5px 10px', fontSize:'12px', backgroundColor:'#ff4d4d'}}>Salir</button>
        </div>
        
        <div className="lista-citas">
          <h3 style={{color:'#ad1457', marginBottom:'15px'}}>Solicitudes Recientes:</h3>
          {citas.length === 0 ? <p>No hay solicitudes todavía.</p> : 
            citas.map((cita) => (
              <div key={cita.id} className="glass-card" style={{marginBottom:'15px', padding:'15px', textAlign:'left'}}>
                <p><strong>👤 Cliente:</strong> {cita.nombre}</p>
                <p><strong>🎨 Técnica:</strong> {cita.servicio}</p>
                <p><strong>📝 Pelo:</strong> {cita.fecha}</p>
                <hr style={{opacity:'0.2'}}/>
                <button 
                  onClick={() => window.open(`https://wa.me/584121663968`, '_blank')} 
                  style={{backgroundColor:'#25d366', padding:'8px', marginTop:'5px'}}
                >
                  Contactar por WA
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  // --- 3. VISTA CLIENTE (Formulario de Presupuesto) ---
  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={() => supabase.auth.signOut()} style={{width:'auto', padding:'5px'}}>Cerrar Sesión</button></div>
      <h1 className="greeting">Presupuesto de Color</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmitPresupuesto}>
          <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre completo" required className="input-luxury"/>
          <select value={tecnica} onChange={(e)=>setTecnica(e.target.value)} className="input-luxury">
            <option value="Balayage">Balayage</option>
            <option value="Mechas / Rayitos">Mechas / Rayitos</option>
            <option value="Tinte Global">Tinte Global</option>
            <option value="Corrección de Color">Corrección de Color</option>
          </select>
          <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} required placeholder="Háblame de tu cabello (largo, color actual, procesos previos)..." className="input-luxury" style={{height:'120px'}} />
          <button type="submit" className="btn-luxury">Enviar a Martha 📱</button>
        </form>
      </div>
    </div>
  );
}
