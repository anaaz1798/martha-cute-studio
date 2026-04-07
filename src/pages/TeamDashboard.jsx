import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { sonarBrillitos } from '../utils/notifications'; // Importamos la magia ✨

export default function TeamDashboard() {
  const [tab, setTab] = useState('calendario');
  const [citas, setCitas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombreStaff, setNombreStaff] = useState('Chama');

  useEffect(() => {
    cargarDatosEquipo();

    // Suscripción en tiempo real para el TeamCute ✨
    const canalTeam = supabase
      .channel('notificaciones-team')
      .on(
        'postgres_changes', 
        { event: 'INSERT', table: 'appointments' }, 
        (payload) => {
          sonarBrillitos(); // ✨ ¡Suena!
          alert("¡Nueva cita agendada! Revisen la agenda, chicas ✨💖");
          cargarDatosEquipo(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalTeam);
    };
  }, [tab]);

  async function cargarDatosEquipo() {
    // 1. Quién está trabajando hoy
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfil } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (perfil?.full_name) setNombreStaff(perfil.full_name.split(' ')[0]);
    }

    // 2. Cargar datos
    const { data: c } = await supabase.from('appointments').select('*, profiles(full_name, phone), services(name)').order('appointment_time', { ascending: true });
    const { data: pr } = await supabase.from('products').select('*');
    
    setCitas(c || []);
    setProductos(pr || []);
  }

  const actualizarEstatus = async (id, nuevoEstatus) => {
    await supabase.from('appointments').update({ status: nuevoEstatus }).eq('id', id);
    cargarDatosEquipo();
  };

  const enviarConfirmacion = (nombre, telefono, fecha, hora) => {
    const msg = encodeURIComponent(`¡Hola ${nombre}! ✨ Te confirmamos tu cita en Martha Cute Studio para el ${fecha} a las ${hora}. ¡Te esperamos! 💖`);
    window.open(`https://wa.me/${telefono.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  return (
    <div style={teamPage}>
      <header style={teamHeader}>
        <h2 style={{ color: '#000', margin: 0, fontFamily: 'serif' }}>
          ¡Hola, {nombreStaff}! ✨
        </h2>
        <p style={{ fontSize: '13px', color: '#ff85a1', fontWeight: 'bold', marginTop: '5px' }}>
          TeamCute Workspace
        </p>
      </header>

      <nav style={navTeam}>
        <button onClick={() => setTab('calendario')} style={btnNav(tab === 'calendario')}>📅 Agenda</button>
        <button onClick={() => setTab('vitrina')} style={btnNav(tab === 'vitrina')}>🛍️ Vitrina</button>
      </nav>

      {tab === 'calendario' && (
        <div style={{ marginTop: '20px' }}>
          {citas.map(cita => (
            <div key={cita.id} style={cardCita}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>{cita.profiles?.full_name}</b>
                <select 
                  value={cita.status} 
                  onChange={(e) => actualizarEstatus(cita.id, e.target.value)}
                  style={selectStyle}
                >
                  <option value="scheduled">Pendiente</option>
                  <option value="completed">Lista</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <p style={textSmall}>{cita.services?.name}</p>
              <div style={timeBox}>
                ⏰ {new Date(cita.appointment_time).toLocaleString([], {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit'})}
              </div>
              <button 
                onClick={() => enviarConfirmacion(cita.profiles?.full_name, cita.profiles?.phone, 'hoy', 'su hora')}
                style={btnWaStaff}
              >
                Confirmar Cita 📲
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'vitrina' && (
        <div style={gridStaff}>
          {productos.map(p => (
            <div key={p.id} style={cardProductStaff}>
              <img src={p.image_url} style={imgStaff} alt="" />
              <p style={{ margin: '5px', fontWeight: 'bold', fontSize: '12px' }}>{p.name}</p>
              <p style={{ color: p.is_active ? '#4CAF50' : '#f44336', fontSize: '10px', marginLeft: '5px', marginBottom: '5px' }}>
                {p.is_active ? '● DISPONIBLE' : '○ AGOTADO'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- ESTILOS ---
const teamPage = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', paddingBottom: '40px', fontFamily: 'sans-serif' };
const teamHeader = { textAlign: 'center', marginBottom: '25px', padding: '20px', borderRadius: '20px', border: '1px solid #f0f0f0' };
const navTeam = { display: 'flex', gap: '10px' };
const btnNav = (active) => ({ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: active ? '#000' : '#f5f5f5', color: active ? '#ff85a1' : '#666', fontWeight: 'bold' });
const cardCita = { padding: '15px', borderRadius: '18px', border: '1px solid #eee', marginBottom: '15px' };
const textSmall = { fontSize: '12px', color: '#888', margin: '5px 0' };
const timeBox = { backgroundColor: '#fff0f3', padding: '8px', borderRadius: '8px', fontSize: '12px', color: '#ff85a1', fontWeight: 'bold', margin: '10px 0' };
const btnWaStaff = { width: '100%', padding: '10px', backgroundColor: '#000', color: '#ff85a1', border: '1px solid #ff85a1', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' };
const selectStyle = { padding: '5px', borderRadius: '8px', border: '1px solid #ff85a1', fontSize: '11px' };
const gridStaff = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' };
const cardProductStaff = { border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' };
const imgStaff = { width: '100%', height: '80px', objectFit: 'cover' };
