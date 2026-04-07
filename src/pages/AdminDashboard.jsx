import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminDashboard() {
  const [tab, setTab] = useState('citas'); // 'citas', 'clientas', 'vitrina', 'config'
  const [citas, setCitas] = useState([]);
  const [clientas, setClientas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [config, setConfig] = useState({});

  useEffect(() => {
    cargarDatos();
  }, [tab]);

  async function cargarDatos() {
    const { data: c } = await supabase.from('appointments').select('*, profiles(full_name, phone), services(name)').order('appointment_time');
    const { data: cl } = await supabase.from('profiles').select('*').eq('role', 'client');
    const { data: pr } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: cfg } = await supabase.from('global_config').select('*').single();

    setCitas(c || []);
    setClientas(cl || []);
    setProductos(pr || []);
    setConfig(cfg || {});
  }

  // 1. LÓGICA DE RECORDATORIOS (WHATSAPP)
  const enviarRecordatorio = (nombre, telefono, fecha, hora) => {
    const msg = encodeURIComponent(`Hola ${nombre} ✨, te recordamos tu cita en Martha Cute Studio para el día ${fecha} a las ${hora}. ¡Prepárate para brillar! 💖`);
    window.open(`https://wa.me/${telefono.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  const contactoManual = (telefono) => {
    window.open(`https://wa.me/${telefono.replace(/\D/g,'')}`, '_blank');
  };

  // 2. GESTIÓN DE VITRINA (TOGGLE)
  const toggleProducto = async (id, estadoActual) => {
    await supabase.from('products').update({ is_active: !estadoActual }).eq('id', id);
    cargarDatos();
  };

  return (
    <div style={adminPage}>
      <h1 style={{ color: '#ff85a1', textAlign: 'center', fontFamily: 'serif' }}>Martha's Control ✨</h1>
      
      {/* Menú de Navegación Admin */}
      <nav style={navStyle}>
        <button onClick={() => setTab('citas')} style={tabBtn(tab === 'citas')}>Citas</button>
        <button onClick={() => setTab('clientas')} style={tabBtn(tab === 'clientas')}>Clientas</button>
        <button onClick={() => setTab('vitrina')} style={tabBtn(tab === 'vitrina')}>Vitrina</button>
        <button onClick={() => setTab('config')} style={tabBtn(tab === 'config')}>Ajustes</button>
      </nav>

      {/* SECCIÓN CITAS */}
      {tab === 'citas' && citas.map(cita => (
        <div key={cita.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>{cita.profiles?.full_name}</b>
            <span style={statusBadge(cita.status)}>{cita.status}</span>
          </div>
          <p style={infoText}>{cita.services?.name} - {new Date(cita.appointment_time).toLocaleString()}</p>
          <button 
            onClick={() => enviarRecordatorio(cita.profiles?.full_name, cita.profiles?.phone, 'mañana', '3:00 PM')}
            style={btnAction}
          >
            Enviar Recordatorio 📲
          </button>
        </div>
      ))}

      {/* SECCIÓN CLIENTAS */}
      {tab === 'clientas' && clientas.map(cl => (
        <div key={cl.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0 }}><b>{cl.full_name}</b></p>
              <p style={infoText}>{cl.phone}</p>
            </div>
            <button onClick={() => contactoManual(cl.phone)} style={btnWa}>WhatsApp</button>
          </div>
        </div>
      ))}

      {/* SECCIÓN VITRINA */}
      {tab === 'vitrina' && productos.map(p => (
        <div key={p.id} style={{ ...cardStyle, display: 'flex', gap: '15px' }}>
          <img src={p.image_url} style={{ width: '60px', height: '60px', borderRadius: '10px' }} alt="" />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0 }}><b>{p.name}</b></p>
            <p style={infoText}>${p.price}</p>
          </div>
          <button 
            onClick={() => toggleProducto(p.id, p.is_active)}
            style={toggleBtn(p.is_active)}
          >
            {p.is_active ? 'Visible' : 'Oculto'}
          </button>
        </div>
      ))}

      {/* SECCIÓN CONFIG (SOLO MARTHA) */}
      {tab === 'config' && (
        <div style={cardStyle}>
          <h3>Ajustes del Salón</h3>
          <label style={labelStyle}>WhatsApp Master</label>
          <input style={inputStyle} defaultValue={config.whatsapp_master} />
          <label style={labelStyle}>Logo URL</label>
          <input style={inputStyle} defaultValue={config.logo_url} />
          <button style={btnSave}>Guardar Cambios</button>
        </div>
      )}
    </div>
  );
}

// --- ESTILOS ---
const adminPage = { minHeight: '100vh', backgroundColor: '#fafafa', padding: '20px', paddingBottom: '80px' };
const navStyle = { display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', padding: '5px' };
const tabBtn = (active) => ({
  padding: '10px 20px', borderRadius: '15px', border: 'none',
  backgroundColor: active ? '#000' : '#fff', color: active ? '#ff85a1' : '#000',
  fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
});
const cardStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const infoText = { fontSize: '13px', color: '#666', margin: '5px 0' };
const btnAction = { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#000', color: '#ff85a1', border: '1px solid #ff85a1', borderRadius: '10px', fontWeight: 'bold' };
const btnWa = { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '12px' };
const toggleBtn = (active) => ({
  backgroundColor: active ? '#ff85a1' : '#ccc', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '15px', height: '30px'
});
const statusBadge = (s) => ({ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', backgroundColor: s === 'scheduled' ? '#e3f2fd' : '#f5f5f5' });
const labelStyle = { display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #eee' };
const btnSave = { width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold' };
