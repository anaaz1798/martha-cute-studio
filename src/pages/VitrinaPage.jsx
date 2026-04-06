import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function VitrinaPage() {
  const [productos, setProductos] = useState([]);
  const WHATSAPP_LINK = "https://wa.link/nkdmm8"; // Tu link de siempre

  useEffect(() => {
    async function cargarProductos() {
      const { data } = await supabase.from('products').select('*').eq('is_active', true);
      if (data) setProductos(data);
    }
    cargarProductos();
  }, []);

  const consultarProducto = (nombre) => {
    const mensaje = encodeURIComponent(`¡Hola! Estoy interesada en el producto: ${nombre} ✨`);
    window.open(`${WHATSAPP_LINK}?text=${mensaje}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#d15690' }}>Nuestra Vitrina</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Productos exclusivos para tu cuidado</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {productos.map((p) => (
          <div key={p.id} style={cardProducto}>
            <img src={p.image_url} alt={p.name} style={imgStyle} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '16px', margin: '5px 0' }}>{p.name}</h3>
              <p style={{ fontSize: '12px', color: '#888', height: '30px', overflow: 'hidden' }}>{p.description}</p>
              <div style={{ fontWeight: 'bold', color: '#d15690', margin: '10px 0' }}>${p.price}</div>
              <button 
                onClick={() => consultarProducto(p.name)}
                style={btnWhatsApp}
              >
                Me interesa 📲
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ESTILOS ---
const cardProducto = {
  backgroundColor: '#fff',
  borderRadius: '15px',
  overflow: 'hidden',
  border: '1px solid #eee',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
};
const imgStyle = { width: '100%', height: '150px', objectFit: 'cover' };
const btnWhatsApp = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#25D366',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
};
