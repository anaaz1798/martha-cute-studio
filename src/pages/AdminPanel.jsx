import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminPanel() {
  const [tab, setTab] = useState('citas'); // 'citas', 'servicios', 'config'
  const [data, setData] = useState({ citas: [], servicios: [], config: {} });

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    const { data: c } = await supabase.from('appointments').select('*, profiles(full_name, phone), services(name)').order('appointment_time');
    const { data: s } = await supabase.from('services').select('*').order('id');
    const { data: cfg } = await supabase.from('site_config').select('*').single();
    setData({ citas: c || [], servicios: s || [], config: cfg || {} });
  }

  const actualizarPrecio = async (id, nuevoPrecio) => {
    await supabase.from('services').update({ price: nuevoPrecio }).eq('id', id);
    cargarTodo();
  };

  const cambiarEstatusCita = async (id, nuevoEstatus) => {
    await supabase.from('appointments').update({ status: nuevoEstatus }).eq('id', id);
    cargarTodo();
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d15690' }}>⚙️ Panel de Control</h1>
      
      {/* Menú de pestañas */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setTab('citas')} style={btnTab(tab === 'citas')}>Citas</button>
        <button onClick={() => setTab('servicios')} style={btnTab(tab === 'servicios')}>Servicios/Precios</button>
        <button onClick={() => setTab('config')} style={btnTab(tab === 'config')}>Redes y Sitio</button>
      </div>

      {/* Vista de Citas */}
      {tab === 'citas' && data.citas.map(cita => (
        <div key={cita.id} style={cardStyle}>
          <p><b>{cita.profiles?.full_name}</b> - {new Date(cita.appointment_time).toLocaleString()}</p>
          <p>Servicio: {cita.services?.name} | Tel: {cita.profiles?.phone}</p>
          <select value={cita.status} onChange={(e) => cambiarEstatusCita(cita.id, e.target.value)}>
            <option value="scheduled">Programada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      ))}

      {/* Vista de Servicios */}
      {tab === 'servicios' && data.servicios.map(s => (
        <div key={s.id} style={cardStyle}>
          <span>{s.name} ({s.category})</span>
          <input 
            type="number" 
            defaultValue={s.price} 
            onBlur={(e) => actualizarPrecio(s.id, e.target.value)} 
            style={{ width: '60px', marginLeft: '10px' }}
          /> $
        </div>
      ))}

      {/* Vista de Configuración (Redes y Nombre) */}
      {tab === 'config' && (
        <div style={cardStyle}>
          <label>Nombre del Salón:</label>
          <input type="text" defaultValue={data.config.site_name} style={inputStyle} />
          <label>Instagram URL:</label>
          <input type="text" defaultValue={data.config.instagram_url} style={inputStyle} />
          <button className="bolt-btn">Guardar Cambios</button>
        </div>
      )}
    </div>
  );
}

const btnTab = (active) => ({
  padding: '10px 20px', backgroundColor: active ? '#d15690' : '#eee', color: active ? '#fff' : '#000', border: 'none', borderRadius: '8px', cursor: 'pointer'
});
const cardStyle = { padding: '15px', border: '1px solid #eee', borderRadius: '12px', marginBottom: '10px', backgroundColor: '#fff' };
const inputStyle = { width: '100%', marginBottom: '15px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' };
