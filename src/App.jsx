import { supabase } from './supabase'
import React, { useState, useEffect } from 'react'
import './styles.css'

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [tecnica, setTecnica] = useState('Balayage');
  const [detalles, setDetalles] = useState('');

  // 1. Revisar si la clienta ya inició sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session)
    })
  }, [])

  // 2. Función para Registrarse o Iniciar Sesión
  const handleAuth = async (tipo) => {
    const { error } = tipo === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) alert("Error: " + error.message);
    else if (tipo === 'registro') alert("¡Revisa tu correo para confirmar!");
  };

  const handleSubmitPresupuesto = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('citas').insert([{ 
      nombre, servicio: 'Presupuesto de Color: ' + tecnica, fecha: detalles 
    }]);

    if (error) alert("Error: " + error.message);
    else {
      const mensaje = `¡Hola Martha! ✨ Soy ${nombre}. Mi usuario es ${sesion.user.email}. Necesito presupuesto para ${tecnica}: ${detalles}`;
      window.open(`https://wa.me/584121663968?text=${encodeURIComponent(mensaje)}`, '_blank');
      setNombre(''); setDetalles('');
    }
  };

  // --- VISTA DE LOGIN ---
  if (!sesion) {
    return (
      <div className="iphone-container">
        <h1 className="greeting">Martha Cute Studio ✨</h1>
        <div className="glass-card">
          <h2 style={{textAlign: 'center', color: '#ff85a2'}}>Bienvenida</h2>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e)=>setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} style={inputStyle} />
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            <button onClick={() => handleAuth('login')} style={btnStyle}>Entrar</button>
            <button onClick={() => handleAuth('registro')} style={{...btnStyle, backgroundColor: '#ccc'}}>Registrarme</button>
          </div>
        </div>
      </div>
    )
  }

  // --- VISTA DE FORMULARIO (Cuando ya entró) ---
  return (
    <div className="iphone-container">
      <div style={{textAlign: 'right'}}><button onClick={() => supabase.auth.signOut()} style={{fontSize: '12px'}}>Salir</button></div>
      <h1 className="greeting">Presupuesto de Color</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmitPresupuesto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre" style={inputStyle} />
          <select value={tecnica} onChange={(e) => setTecnica(e.target.value)} style={inputStyle}>
            <option value="Balayage">Balayage</option>
            <option value="Mechas">Mechas</option>
            <option value="Tinte">Tinte</option>
          </select>
          <textarea value={detalles} onChange={(e) => setDetalles(e.target.value)} required placeholder="Detalles de tu cabello..." style={{...inputStyle, height: '100px'}} />
          <button type="submit" style={btnStyle}>Pedir Presupuesto 📱</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', width: '100%', marginBottom: '5px' };
const btnStyle = { padding: '12px', backgroundColor: '#ff85a2', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', flex: 1 };
