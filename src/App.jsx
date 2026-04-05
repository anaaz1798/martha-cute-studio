import { supabase } from './supabase'
import React, { useState } from 'react'
import './styles.css'

export default function App() {
  const [nombre, setNombre] = useState('');
  const [servicio, setServicio] = useState('Manicura Sencilla');
  const [fecha, setFecha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Guardamos en la base de datos
    const { data, error } = await supabase
      .from('citas')
      .insert([{ nombre, servicio, fecha }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      // 2. Si se guarda bien, armamos el mensaje de WhatsApp
      const mensaje = `¡Hola Martha! Soy ${nombre}, acabo de agendar una cita para ${servicio} el día ${fecha}.`;
      const urlWhatsapp = `https://wa.me/PON_AQUI_EL_NUMERO?text=${encodeURIComponent(mensaje)}`;
      
      alert("¡Cita agendada con éxito! Ahora te redirigiremos a WhatsApp para confirmar.");
      
      // 3. Abrimos el WhatsApp de tu hermana
      window.open(urlWhatsapp, '_blank');

      setNombre('');
      setFecha('');
    }
  };

  return (
    <div className="iphone-container">
      <h1 className="greeting">Martha Cute Studio ✨</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <label>Nombre de la clienta:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Ana Pérez" />

          <label>¿Qué servicio buscas?</label>
          <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
            <option value="Manicura Sencilla">Manicura Sencilla</option>
            <option value="Uñas Acrílicas">Uñas Acrílicas</option>
            <option value="Pedicura">Pedicura</option>
            <option value="Diseño Especial">Diseño Especial</option>
          </select>

          <label>Fecha y Hora:</label>
          <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

          <button type="submit" className="boton-agendar">
            Agendar y Confirmar 💅
          </button>
        </form>
      </div>
    </div>
  );
}
