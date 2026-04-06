import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function ServicesPage() {
  const [servicios, setServicios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    async function cargarServicios() {
      const { data } = await supabase.from('services').select('*');
      if (data) setServicios(data);
    }
    cargarServicios();
  }, []);

  const handleAction = (s) => {
    if (s.name === 'Presupuesto de color') {
      window.open('https://wa.link/nkdmm8', '_blank');
    } else {
      setSeleccionado(s);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#d15690' }}>Menú de Servicios</h1>
      
      {servicios.map((s) => (
        <div 
          key={s.id} 
          onClick={() => handleAction(s)}
          style={{
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '10px',
            cursor: 'pointer',
            backgroundColor: seleccionado?.id === s.id ? '#fff0f6' : '#fff',
            border: s.name === 'Presupuesto de color' ? '2px solid #25D366' : (seleccionado?.id === s.id ? '2px solid #d15690' : '1px solid #ddd')
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>{s.name}</span>
            <span style={{ color: s.name === 'Presupuesto de color' ? '#25D366' : '#d15690' }}>
              {s.name === 'Presupuesto de color' ? '📲' : `$${s.price}`}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>{s.duration} min</div>
        </div>
      ))}

      <button 
        style={{
          width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
          backgroundColor: seleccionado ? '#d15690' : '#ccc', color: '#fff', fontWeight: 'bold'
        }}
        disabled={!seleccionado}
      >
        {seleccionado ? `Reservar ${seleccionado.name}` : 'Selecciona un servicio'}
      </button>
    </div>
  );
}
