import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminPanel() {
  const [tab, setTab] = useState('citas'); // 'citas', 'servicios', 'config', 'equipo'
  const [data, setData] = useState({ citas: [], servicios: [], config: {}, llaves: [] });
  const [nuevaLlave, setNuevaLlave] = useState({ nombre: '', clave: '' });

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    const { data: c } = await supabase.from('appointments').select('*, profiles(full_name, phone), services(name)').order('appointment_time');
    const { data: s } = await supabase.from('services').select('*').order('id');
    const { data: cfg } = await supabase.from('site_config').select('*').single();
    const { data: ll } = await supabase.from('access_keys').select('*').order('id');
    setData({ citas: c || [], servicios: s || [], config: cfg || {}, llaves: ll || [] });
  }

  const cambiarEstatusCita = async (id, nuevoEstatus) => {
    await supabase.from('appointments').update({ status: nuevoEstatus }).eq('id', id);
    cargarTodo();
  };

  const crearLlave = async () => {
    if (!nuevaLlave.nombre || !nuevaLlave.clave) return alert("Llena ambos campos, jefa");
    await supabase.from('access_keys').insert([{ key_value: nuevaLlave.clave, user_name: nuevaLlave.nombre }]);
    setNuevaLlave({ nombre: '', clave: '' });
    cargarTodo();
  };

  const toggleLlave = async (id, statusActual) => {
    await supabase.from('access_keys').update({ is_active: !statusActual }).eq('id', id);
    cargarTodo();
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d15690', textAlign: 'center' }}>⚙️ Panel de Control "The Cute"</h1>
      
      {/* Menú de Navegación */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setTab('citas')} style={btnTab(tab === 'citas')}>Citas</button>
        <button onClick={() => setTab('servicios')} style={btnTab(tab === 'servicios')}>Precios</button>
        <button onClick={() => setTab('config')} style={btnTab(tab === 'config')}>Sitio/Redes</button>
        <button onClick={() => setTab('equipo')} style={btnTab(tab === 'equipo')}>🔑 Equipo</button>
      </div>

      {/* --- SECCIÓN CITAS --- */}
      {tab === 'citas' && data.citas.map(cita => (
        <div key={cita.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p><b>{cita.profiles?.full_name}</b></p>
            <select value={cita.status} onChange={(e) => cambiarEstatusCita(cita.id, e.target.value)} style={selectStyle}>
              <option value="scheduled">Programada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>{cita.services?.name} - {new Date(cita.appointment_time).toLocaleString()}</p>
          <p style={{ fontSize: '14px', color: '#25D366' }}>📞 {cita.profiles?.phone}</p>
        </div>
      ))}

      {/* --- SECCIÓN EQUIPO (LLAVES) --- */}
      {tab === 'equipo' && (
        <div>
          <h3>Gestión de Acceso al Personal</h3>
          <div style={{ ...cardStyle, backgroundColor: '#fdf2f8' }}>
            <input placeholder="Nombre de la empleada" value={nuevaLlave.nombre} onChange={e => setNuevaLlave({...nuevaLlave, nombre: e.target.value})} style={inputStyle} />
            <input placeholder="Clave de acceso" value={nuevaLlave.clave} onChange={e => setNuevaLlave({...nuevaLlave, clave: e.target.value})} style={inputStyle} />
            <button onClick={crearLlave} style={mainBtn}>Generar Acceso</button>
          </div>
          {data.llaves.map(llave => (
            <div key={llave.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{llave.user_name}</div>
                <code style={{ color: '#d15690' }}>Clave: {llave.key_value}</code>
              </div>
              <button 
                onClick={() => toggleLlave(llave.id, llave.is_active)}
                style={llaveBtn(llave.is_active)}
              >
                {llave.is_active ? 'Activa (Desactivar)' : 'Inactiva (Activar)'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- SECCIÓN CONFIG --- */}
      {tab === 'config' && (
        <div style={cardStyle}>
          <label>Nombre del Salón</label>
          <input type="text" defaultValue={data.config.site_name} style={inputStyle} />
          <label>Instagram URL</label>
          <input type="text" defaultValue={data.config.instagram_url} style={inputStyle} />
          <button style={mainBtn}>Guardar Todo</button>
        </div>
      )}
    </div>
  );
}

// --- ESTILOS ---
const btnTab = (active) => ({
  padding: '10px 15px', backgroundColor: active ? '#d15690' : '#eee', color: active ? '#fff' : '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
});
const cardStyle = { padding: '15px', border: '1px solid #eee', borderRadius: '15px', marginBottom: '12px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', marginBottom: '10px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const selectStyle = { padding: '5px', borderRadius: '5px', border: '1px solid #d15690' };
const mainBtn = { width: '100%', padding: '12px', backgroundColor: '#d15690', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const llaveBtn = (active) => ({
  padding: '8px 12px', backgroundColor: active ? '#4CAF50' : '#f44336', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
});
