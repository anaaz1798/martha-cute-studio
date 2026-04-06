import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminPanel() {
  const [tab, setTab] = useState('citas'); // 'citas', 'servicios', 'config', 'equipo', 'vitrina'
  const [data, setData] = useState({ citas: [], servicios: [], config: {}, llaves: [], productos: [] });
  const [nuevaLlave, setNuevaLlave] = useState({ nombre: '', clave: '' });
  const [nuevoProducto, setNuevoProducto] = useState({ name: '', price: '', image_url: '', description: '' });

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    const { data: c } = await supabase.from('appointments').select('*, profiles(full_name, phone), services(name)').order('appointment_time');
    const { data: s } = await supabase.from('services').select('*').order('id');
    const { data: cfg } = await supabase.from('site_config').select('*').single();
    const { data: ll } = await supabase.from('access_keys').select('*').order('id');
    const { data: prod } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    setData({ 
      citas: c || [], 
      servicios: s || [], 
      config: cfg || {}, 
      llaves: ll || [],
      productos: prod || []
    });
  }

  // --- LÓGICA DE PRODUCTOS ---
  const agregarProducto = async () => {
    if (!nuevoProducto.name || !nuevoProducto.price) return alert("Nombre y precio son obligatorios");
    await supabase.from('products').insert([nuevoProducto]);
    setNuevoProducto({ name: '', price: '', image_url: '', description: '' });
    cargarTodo();
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Segura que quieres quitar este producto de la vitrina?")) {
      await supabase.from('products').delete().eq('id', id);
      cargarTodo();
    }
  };

  // --- LÓGICA DE CITAS Y LLAVES ---
  const cambiarEstatusCita = async (id, nuevoEstatus) => {
    await supabase.from('appointments').update({ status: nuevoEstatus }).eq('id', id);
    cargarTodo();
  };

  const crearLlave = async () => {
    await supabase.from('access_keys').insert([{ key_value: nuevaLlave.clave, user_name: nuevaLlave.nombre }]);
    setNuevaLlave({ nombre: '', clave: '' });
    cargarTodo();
  };

  const toggleLlave = async (id, statusActual) => {
    await supabase.from('access_keys').update({ is_active: !statusActual }).eq('id', id);
    cargarTodo();
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d15690', textAlign: 'center' }}>⚙️ Panel de Control "The Cute"</h1>
      
      {/* Menú de Navegación Pro */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setTab('citas')} style={btnTab(tab === 'citas')}>Citas</button>
        <button onClick={() => setTab('vitrina')} style={btnTab(tab === 'vitrina')}>🛍️ Vitrina</button>
        <button onClick={() => setTab('servicios')} style={btnTab(tab === 'servicios')}>Precios</button>
        <button onClick={() => setTab('config')} style={btnTab(tab === 'config')}>Sitio</button>
        <button onClick={() => setTab('equipo')} style={btnTab(tab === 'equipo')}>🔑 Equipo</button>
      </div>

      {/* SECCIÓN VITRINA (PRODUCTOS) */}
      {tab === 'vitrina' && (
        <div>
          <h3>Gestionar Productos a la Venta</h3>
          <div style={{ ...cardStyle, backgroundColor: '#f0fdf4' }}>
            <input placeholder="Nombre del producto" value={nuevoProducto.name} onChange={e => setNuevoProducto({...nuevoProducto, name: e.target.value})} style={inputStyle} />
            <input placeholder="Precio $" type="number" value={nuevoProducto.price} onChange={e => setNuevoProducto({...nuevoProducto, price: e.target.value})} style={inputStyle} />
            <input placeholder="Link de la imagen (URL)" value={nuevoProducto.image_url} onChange={e => setNuevoProducto({...nuevoProducto, image_url: e.target.value})} style={inputStyle} />
            <textarea placeholder="Descripción corta" value={nuevoProducto.description} onChange={e => setNuevoProducto({...nuevoProducto, description: e.target.value})} style={inputStyle} />
            <button onClick={agregarProducto} style={{...mainBtn, backgroundColor: '#22c55e'}}>Añadir a Vitrina</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {data.productos.map(p => (
              <div key={p.id} style={cardStyle}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src={p.image_url} alt="" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ color: '#d15690' }}>${p.price}</div>
                  </div>
                </div>
                <button onClick={() => eliminarProducto(p.id)} style={{ marginTop: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN CITAS */}
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
          <p style={{ fontSize: '14px', color: '#25D366', fontWeight: 'bold' }}>📞 {cita.profiles?.phone}</p>
        </div>
      ))}

      {/* SECCIÓN EQUIPO */}
      {tab === 'equipo' && (
        <div>
          <h3>Llaves de Acceso para el Personal</h3>
          <div style={{ ...cardStyle, backgroundColor: '#fdf2f8' }}>
            <input placeholder="Nombre empleada" value={nuevaLlave.nombre} onChange={e => setNuevaLlave({...nuevaLlave, nombre: e.target.value})} style={inputStyle} />
            <input placeholder="Clave secreta" value={nuevaLlave.clave} onChange={e => setNuevaLlave({...nuevaLlave, clave: e.target.value})} style={inputStyle} />
            <button onClick={crearLlave} style={mainBtn}>Generar Acceso</button>
          </div>
          {data.llaves.map(llave => (
            <div key={llave.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><b>{llave.user_name}</b><br/><code>{llave.key_value}</code></div>
              <button onClick={() => toggleLlave(llave.id, llave.is_active)} style={llaveBtn(llave.is_active)}>
                {llave.is_active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          ))}
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
  padding: '8px 12px', backgroundColor: active ? '#4CAF50' : '#f44336', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'
});
