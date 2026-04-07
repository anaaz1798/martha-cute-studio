import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { sonarBrillitos } from '../utils/notifications'; 

export default function AdminDashboard() {
  const [tab, setTab] = useState('citas'); 
  const [citas, setCitas] = useState([]);
  const [clientas, setClientas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [config, setConfig] = useState({});
  
  // NUEVO: Estado para el bloqueo
  const [fechaBloqueo, setFechaBloqueo] = useState('');

  useEffect(() => {
    cargarDatos();

    const canalCitas = supabase
      .channel('notificaciones-martha')
      .on(
        'postgres_changes', 
        { event: 'INSERT', table: 'appointments' }, 
        (payload) => {
          sonarBrillitos(); 
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

  // NUEVO: Función para bloquear días
  const bloquearDia = async () => {
    if (!fechaBloqueo) return alert("Selecciona una fecha primero, jefa 🩷");
    
    const { error } = await supabase
      .from('closed_days')
      .insert([{ closed_date: fechaBloqueo, reason: 'Cerrado por Admin' }]);

    if (error) {
      alert("Ese día ya está bloqueado o hubo un error 🚫");
    } else {
      alert(`¡Día ${fechaBloqueo} bloqueado con éxito! ✨`);
      setFechaBloqueo('');
    }
  };

  const enviarRecordatorio = (nombre, telefono, fecha, hora) => {
    const msg = encodeURIComponent(`Hola ${nombre} ✨, te recordamos tu cita en Martha Cute Studio para el día ${fecha} a las ${hora}. ¡Prepárate para brillar! 💖`);
    window.open(`https://wa.me/${telefono.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  const contactoManual = (telefono) => {
    window.open(`https://wa.me/${telefono.replace(/\D/g,'')}`, '_blank');
  };

  const toggleProducto = async (id, estadoActual) => {
    await supabase.from('products').update({ is_active: !estadoActual }).eq('id', id);
    cargarDatos();
  };

  return (
    <div style={adminPage}>
      <h1 style={{ color: '#ff85a1', textAlign: 'center', fontFamily: 'serif', marginBottom: '5px' }}>Martha's Control ✨</h1>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '20px' }}>Gestión de Salón y Equipo</p>
      
      <nav style={navStyle}>
        <button onClick={() => setTab('citas')} style={tabBtn(tab === 'citas')}>Citas</button>
        <button onClick={() => setTab('clientas')} style={tabBtn(tab === 'clientas')}>Clientas</button>
        <button onClick={() => setTab('vitrina')} style={tabBtn(tab === 'vitrina')}>Vitrina</button>
        <button onClick={() => setTab('config')} style={tabBtn(tab === 'config')}>Ajustes</button>
      </nav>

      {tab === 'citas' && citas.map(cita => (
        <div key={cita.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>{cita.profiles?.full_name}</b>
            <span style={statusBadge(cita.status)}>{cita.status}</span>
          </div>
          <p style={infoText}>{cita.services?.name}</p>
          <p style={infoText}>📅 {new Date(cita.appointment_time).toLocaleString()}</p>
          <button onClick={() => enviarRecordatorio(cita.profiles?.full_name, cita.profiles?.phone, 'mañana', 'la hora agendada')} style={btnAction}>
            Enviar Recordatorio 📲
          </button>
        </div>
      ))}

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

      {tab === 'vitrina' && productos.map(p => (
        <div key={p.id} style={{ ...cardStyle, display: 'flex', gap: '15px' }}>
          <img src={p.image_url} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} alt="" />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0 }}><b>{p.name}</b></p>
            <p style={infoText}>${p.price}</p>
          </div>
          <button onClick={() => toggleProducto(p.id, p.is_active)} style={toggleBtn(p.is_active)}>
            {p.is_active ? 'Visible' : 'Oculto'}
          </button>
        </div>
      ))}

      {tab === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SECCIÓN AJUSTES GENERALES */}
          <div style={cardStyle}>
            <h3 style={{fontSize: '16px', color: '#ff85a1', marginTop: 0}}>Ajustes del Salón 🩷</h3>
            <label style={labelStyle}>WhatsApp Master</label>
            <input style={inputStyle} defaultValue={config.whatsapp_master} placeholder="Ej: 584241234567" />
            <label style={labelStyle}>Link del Logo</label>
            <input style={inputStyle} defaultValue={config.logo_url} />
            <button style={btnSave}>Guardar Cambios</button>
          </div>

          {/* NUEVA SECCIÓN: BLOQUEO DE CALENDARIO */}
          <div style={{...cardStyle, border: '2px solid #fff0f3'}}>
            <h3 style={{fontSize: '16px', color: '#000', marginTop: 0}}>Bloqueo de Calendario 🗓️</h3>
            <p style={{fontSize: '11px', color: '#666', marginBottom: '10px'}}>Usa esto para cerrar el salón en días específicos.</p>
            <input 
              type="date" 
              style={{...inputStyle, marginBottom: '10px'}} 
              value={fechaBloqueo} 
              onChange={(e) => setFechaBloqueo(e.target.value)} 
            />
            <button 
              onClick={bloquearDia} 
              style={{...btnAction, backgroundColor: '#ff85a1', color: '#000', border: 'none'}}
            >
              Cerrar el Salón este Día 🔒
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// (Estilos se mantienen igual)
const adminPage = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', paddingBottom: '80px', fontFamily: 'sans-serif' };
const navStyle = { display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px' };
const tabBtn = (active) => ({ padding: '12px 20px', borderRadius: '15px', border: 'none', backgroundColor: active ? '#000' : '#f5f5f5', color: active ? '#ff85a1' : '#666', fontWeight: 'bold', cursor: 'pointer', minWidth: '100px' });
const cardStyle = { backgroundColor: '#fff', padding: '18px', borderRadius: '22px', marginBottom: '15px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' };
const infoText = { fontSize: '13px', color: '#666', margin: '4px 0' };
const btnAction = { width: '100%', padding: '12px', marginTop: '12px', backgroundColor: '#000', color: '#ff85a1', border: '1px solid #ff85a1', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnWa = { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const toggleBtn = (active) => ({ backgroundColor: active ? '#ff85a1' : '#eee', color: active ? '#fff' : '#888', border: 'none', padding: '8px 15px', borderRadius: '15px', fontWeight: 'bold' });
const statusBadge = (s) => ({ fontSize: '10px', padding: '4px 10px', borderRadius: '12px', backgroundColor: s === 'scheduled' ? '#fff0f3' : '#f5f5f5', color: '#ff85a1', fontWeight: 'bold' });
const labelStyle = { display: 'block', fontSize: '12px', marginBottom: '6px', fontWeight: 'bold', color: '#333' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box' };
const btnSave = { width: '100%', padding: '15px', backgroundColor: '#000', color: '#ff85a1', border: 'none', borderRadius: '15px', fontWeight: 'bold' };
