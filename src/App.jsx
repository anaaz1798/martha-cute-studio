import { supabase } from './supabase'
import React, { useState } from 'react'
import './styles.css'

export default function App() {
  const [nombre, setNombre] = useState('');
  const [servicio, setServicio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Esto manda los datos a la tabla 'citas' en Supabase
    const { data, error } = await supabase
      .from('citas')
      .insert([{ nombre: nombre, servicio: servicio }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("¡Cita enviada con éxito! 💅");
      setNombre(''); // Limpia el cuadro de nombre
      setServicio(''); // Limpia el cuadro de servicio
    }
  };

  return (
    <div className="iphone-container">
      <h1 className="greeting">Martha Cute Studio ✨</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Nombre de la clienta" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required 
            style={{ padding: '10px', borderRadius: '8px', border: 'none' }}
          />
          <input 
            type="text" 
            placeholder="¿Qué servicio busca?" 
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            required 
            style={{ padding: '10px', borderRadius: '8px', border: 'none' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#ff85a2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Agendar Cita
          </button>
        </form>
      </div>
    </div>
  );
}
