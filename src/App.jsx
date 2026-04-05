import { supabase } from './supabase'
import React, { useState } from 'react'
import './styles.css'

export default function App() {
  const [nombre, setNombre] = useState('');
  const [tecnica, setTecnica] = useState('Balayage');
  const [detalles, setDetalles] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Guardamos en la base de datos (columna servicio y fecha)
    const { data, error } = await supabase
      .from('citas')
      .insert([{ 
        nombre: nombre, 
        servicio: 'Presupuesto de Color: ' + tecnica, 
        fecha: detalles // Guardamos la descripción del pelo aquí
      }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      const numeroHermana = "584121663968"; 
      const mensaje = `¡Hola Martha! ✨\n\nNecesito un *Presupuesto de Color*:\n\n👤 *Nombre:* ${nombre}\n🎨 *Técnica:* ${tecnica}\n📝 *Detalles del cabello:* ${detalles}`;
      
      const urlWhatsapp = `https://wa.me/${numeroHermana}?text=${encodeURIComponent(mensaje)}`;
      
      alert("¡Solicitud lista! Dale a 'Aceptar' para enviársela a Martha por WhatsApp.");
      window.open(urlWhatsapp, '_blank');

      setNombre('');
      setDetalles('');
    }
  };

  return (
    <div className="iphone-container">
      <h1 className="greeting">Martha Cute Studio ✨</h1>
      <div className="glass-card">
        <h2 style={{textAlign: 'center', color: '#ff85a2', marginBottom: '20px'}}>Presupuesto de Color</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <label style={{fontWeight: 'bold'}}>Nombre de la clienta:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            placeholder="Escribe tu nombre" 
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
          />

          <label style={{fontWeight: 'bold'}}>Técnica que deseas:</label>
          <select 
            value={tecnica} 
            onChange={(e) => setTecnica(e.target.value)}
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: 'white' }}
          >
            <option value="Balayage">Balayage</option>
            <option value="Mechas / Rayitos">Mechas / Rayitos</option>
            <option value="Tinte Global (Todo el pelo)">Tinte Global</option>
            <option value="Decoloración + Color Fantasía">Color Fantasía</option>
            <option value="Corrección de Color">Corrección de Color</option>
          </select>

          <label style={{fontWeight: 'bold'}}>Cuéntame de tu cabello:</label>
          <textarea 
            value={detalles} 
            onChange={(e) => setDetalles(e.target.value)} 
            required
            placeholder="Ej: Lo tengo negro por los hombros, nunca me he pintado o tengo tinte viejo..." 
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', height: '120px', resize: 'none' }}
          />

          <button type="submit" style={{ 
            padding: '15px', 
            backgroundColor: '#ff85a2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '30px', 
            fontWeight: 'bold', 
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(255, 133, 162, 0.3)'
          }}>
            Pedir Presupuesto a Martha 📱
          </button>
        </form>
      </div>
    </div>
  );
}
