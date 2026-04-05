import { supabase } from './supabase'
import React, { useState } from 'react'
import './styles.css'

export default function App() {
  const [nombre, setNombre] = useState('');
  const [servicio, setServicio] = useState('Manicura Sencilla');
  const [fecha, setFecha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Guardamos los datos en la tabla 'citas' de Supabase
    const { data, error } = await supabase
      .from('citas')
      .insert([{ nombre, servicio, fecha }]);

    if (error) {
      alert("Error guardando en la base de datos: " + error.message);
    } else {
      // 2. Preparamos el mensaje de WhatsApp para tu hermana
      const numeroHermana = "584121663968"; 
      const mensaje = `¡Hola Martha! ✨ Soy ${nombre}, me gustaría agendar una cita para *${servicio}* el día *${fecha}*. ¿Me confirmas si tienes disponibilidad? 💅`;
      
      const urlWhatsapp = `https://wa.me/${numeroHermana}?text=${encodeURIComponent(mensaje)}`;
      
      alert("¡Cita registrada con éxito! Ahora te llevaremos a WhatsApp para confirmar con Martha. 🚀");
      
      // 3. Esto abre el chat de WhatsApp automáticamente
      window.open(urlWhatsapp, '_blank');

      // Limpiamos el formulario
      setNombre('');
      setFecha('');
    }
  };

  return (
    <div className="iphone-container">
      <h1 className="greeting">Martha Cute Studio ✨</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <label style={{fontWeight: 'bold'}}>Nombre de la clienta:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            placeholder="Ej: Ana Pérez" 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />

          <label style={{fontWeight: 'bold'}}>¿Qué servicio buscas?</label>
          <select 
            value={servicio} 
            onChange={(e) => setServicio(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="Manicura Sencilla">Manicura Sencilla</option>
            <option value="Uñas Acrílicas">Uñas Acrílicas</option>
            <option value="Pedicura">Pedicura</option>
            <option value="Sistemas / Retoque">Sistemas / Retoque</option>
            <option value="Diseño a Mano Alzada">Diseño a Mano Alzada</option>
          </select>

          <label style={{fontWeight: 'bold'}}>Fecha y Hora sugerida:</label>
          <input 
            type="datetime-local" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />

          <button type="submit" style={{ 
            padding: '12px', 
            backgroundColor: '#ff85a2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '25px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}>
            Agendar y Confirmar por WhatsApp 💅
          </button>
        </form>
      </div>
    </div>
  );
}
