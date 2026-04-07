import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { sonarBrillitos } from '../utils/notifications'; // Importamos la magia ✨

export default function AdminDashboard() {
  const [tab, setTab] = useState('citas'); 
  const [citas, setCitas] = useState([]);
  const [clientas, setClientas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [config, setConfig] = useState({});

  // ELEGANCIA: El "Oído" en tiempo real
  useEffect(() => {
    cargarDatos();

    // Suscripción para que suenen los brillitos al entrar una cita nueva
    const canalCitas = supabase
      .channel('notificaciones-martha')
      .on(
        'postgres_changes', 
        { event: 'INSERT', table: 'appointments' }, 
        (payload) => {
          sonarBrillitos(); // ✨ Sonido nativo
          alert("¡Nueva cita agendada! Revisa la agenda ✨💖");
          cargarDatos(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalCitas);
    };
  }, [tab]);

  async function cargarDatos() {
    const { data: c } = await supabase.from('appointments').select('*, profiles(full_name, phone), services(name)').order('appointment_time', { ascending: false });
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
      <h1 style={{ color: '#ff85a1', textAlign: 'center', fontFamily: 'serif', marginBottom: '5px' }}>Martha's Control ✨</h1>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '20px' }}>Gestión de Salón y Equipo</p>
      
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
          <p style={infoText}>{cita.services?.name}</p>
          <p style={infoText}>📅 {new Date(cita.appointment_time).toLocaleString()}</p>
          <button 
            onClick={() => enviarRecordatorio(cita.profiles?.full_name, cita.profiles?.phone, 'mañana', 'la hora agendada')}
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
          <img src={p.image_url} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} alt="" />
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
          <h3>Ajustes del Salón 🩷</h3>
          <label style={labelStyle}>WhatsApp Master</label>
          <input style={inputStyle} defaultValue={config.whatsapp_master} placeholder="Ej: 584241234567" />
          <label style={labelStyle}>Link del Logo</label>
          <input style={inputStyle} defaultValue={config.logo_url} />
          <label style={labelStyle}>Link del Banner</label>
          <input style={inputStyle} defaultValue={config.banner_url} />
          <button style={btnSave}>Guardar Cambios</button>
          <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
             <p style={{fontSize: '11px', color: '#888'}}>ID de Sesión: {config.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- ESTILOS NATIVOS ---
const adminPage = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', paddingBottom: '80px', fontFamily: 'sans-serif' };
const navStyle = { display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px' };
const tabBtn = (active) => ({
  padding: '12px 20px', borderRadius: '15px', border: 'none',
  backgroundColor: active ? '#000' : '#f5f5f5', color: active ? '#ff85a1' : '#666',
  fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', minWidth: '100px'
});
const cardStyle = { backgroundColor: '#fff', padding: '18px', borderRadius: '22px', marginBottom: '15px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' };
const infoText = { fontSize: '13px', color: '#666', margin: '4px 0' };
const btnAction = { width: '100%', padding: '12px', marginTop: '12px', backgroundColor: '#000', color: '#ff85a1', border: '1px solid #ff85a1', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnWa = { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const toggleBtn = (active) => ({
  backgroundColor: active ? '#ff85a1' : '#eee', color: active ? '#fff' : '#888', border: 'none', padding: '8px 15px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer'
});
const statusBadge = (s) => ({ fontSize: '10px', padding: '4px 10px', borderRadius: '12px', backgroundColor: s === 'scheduled' ? '#fff0f3' : '#f5f5f5', color: '#ff85a1', fontWeight: 'bold', textTransform: 'uppercase' });
const labelStyle = { display: 'block', fontSize: '12px', marginBottom: '6px', fontWeight: 'bold', color: '#333' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box' };
const btnSave = { width: '100%', padding: '15px', backgroundColor: '#000', color: '#ff85a1', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' };
