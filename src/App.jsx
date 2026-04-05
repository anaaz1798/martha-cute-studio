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

  const CORREO_ADMIN = "ana.az1798@gmail.com"; 

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
    const { data } = await supabase
      .from('citas')
      .select('*')
      .order('created_at', { ascending: false });
    setCitas(data || []);
  };

  // --- EL ARREGLO ESTÁ AQUÍ (FUERZA BRUTA) ---
  const handleAuth = async (tipo) => {
    const { data, error } = tipo === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) {
      alert(error.message);
    } else if (data.session) {
      // Si el login es exitoso, obligamos a la página a recargar para que entre al panel
      window.location.reload();
    }
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
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 className="greeting" style={{fontSize: '20px'}}>Panel Jefa 👑</h1>
          <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} style={{width:'auto', padding:'5px 10px', fontSize:'12px', backgroundColor:'#ff4d4d'}}>Salir</button>
        </div>
        <div className="lista-citas">
          {citas.map((cita) => (
            <div key={cita.id} className="glass-card" style={{marginBottom:'15px', padding:'15px', textAlign:'left'}}>
              <p><strong>👤 Cliente:</strong> {cita.nombre}</p>
              <p><strong>🎨 Técnica:</strong> {cita.servicio}</p>
              <p><strong>📝 Pelo:</strong> {cita.fecha}</p>
              <button onClick={() => window.open(`https://wa.me/584121663968`, '_blank')} style={{backgroundColor:'#25d366', padding:'8px', marginTop:'5px'}}>WhatsApp</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} style={{width:'auto', padding:'5px'}}>Salir</button></div>
      <h1 className="greeting">Presupuesto</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmitPresupuesto}>
          <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Nombre" required className="input-luxury"/>
          <select value={tecnica} onChange={(e)=>setTecnica(e.target.value)} className="input-luxury">
            <option value="Balayage">Balayage</option>
            <option value="Mechas">Mechas</option>
            <option value="Tinte">Tinte</option>
          </select>
          <textarea value={detalles} onChange={(e)=>setDetalles(e.target.value)} placeholder="Detalles de tu pelo..." className="input-luxury" style={{height:'100px'}} />
          <button type="submit" className="btn-luxury">Enviar 📱</button>
        </form>
      </div>
    </div>
  );
}
