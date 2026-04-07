import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function TeamDashboard() {
  const [tab, setTab] = useState('calendario'); // 'calendario', 'vitrina', 'eventos'
  const [citas, setCitas] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarDatosEquipo();
  }, [tab]);

  async function cargarDatosEquipo() {
    // El staff ve todas las citas para coordinarse
    const { data: c } = await supabase.from('appointments')
      .select('*, profiles(full_name, phone), services(name)')
      .order('appointment_time');
    
    const { data: pr } = await supabase.from('products').select('*');
    
    setCitas(c || []);
    setProductos(pr || []);
  }

  const actualizarEstatus = async (id, nuevoEstatus) => {
    await supabase.from('appointments').update({ status: nuevoEstatus }).eq('id', id);
    cargarDatosEquipo();
    alert("Estatus actualizado ✨");
  };

  const enviarRecordatorioStaff = (nombre, telefono, fecha, hora) => {
    const msg = encodeURIComponent(`Hola ${nombre} ✨, te escribimos de Martha Cute Studio para confirmar tu cita de ${fecha} a las ${hora}. ¡Te esperamos! 💖`);
    window.open(`https://wa.me/${telefono.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  return (
    <div style={teamPage}>
      <header style={teamHeader}>
        <h2 style={{ color: '#ff85a1', margin: 0 }}>TeamCute Workspace ✨</h2>
        <p style={{ fontSize: '12px', color: '#666' }}>Gestión de Citas y Vitrina</p>
      </header>

      {/* Menú del Staff */}
      <nav style={navTeam}>
        <button onClick={() => setTab('calendario')} style={btnNav(tab === 'calendario')}>📅 Agenda</button>
        <button onClick={() => setTab('vitrina')} style={btnNav(tab === 'vitrina')}>🛍️ Vitrina</button>
      </nav>

      {/* SECCIÓN AGENDA MAESTRA */}
      {tab === 'calendario' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={titleSection}>Calendario Maestro</h3>
          {citas.map(cita => (
            <div key={cita.id} style={cardCita}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <b style={{ fontSize: '16px' }}>{cita.profiles?.full_name}</b>
                  <p style={textSmall}>{cita.services?.name}</p>
                </div>
                <select 
                  value={cita.status} 
                  onChange={(e) => actualizarEstatus(cita.id, e.target.value)}
                  style={selectStyle}
                >
                  <option value="scheduled">Programada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              
              <div style={timeBox}>
                🗓️ {new Date(cita.appointment_time).toLocaleDateString()} | ⏰ {new Date(cita.appointment_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => enviarRecordatorioStaff(cita.profiles?.full_name, cita.profiles?.phone, 'hoy', 'la hora acordada')}
                  style={btnWaStaff}
                >
                  Confirmar WhatsApp 📲
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECCIÓN VITRINA (SOLO VISTA PARA EL STAFF) */}
      {tab === 'vitrina' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={titleSection}>Estado de Productos</h3>
          <div style={gridStaff}>
            {productos.map(p => (
              <div key={p.id} style={cardProductStaff}>
                <img src={p.image_url} style={imgStaff} alt="" />
                <div style={{ padding: '8px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px' }}>{p.name}</p>
                  <p style={{ color: p.is_active ? '#4CAF50' : '#f44336', fontSize: '11px', fontWeight: 'bold' }}>
                    {p.is_active ? 'DISPONIBLE' : 'AGOTADO'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ESTILOS TEAM CUTE ---
const teamPage = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', paddingBottom: '40px' };
const teamHeader = { textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' };
const navTeam = { display: 'flex', gap: '10px', justifyContent: 'center' };
const btnNav = (active) => ({
  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
  backgroundColor: active ? '#000' : '#f5f5f5', color: active ? '#ff85a1' : '#666',
  fontWeight: 'bold', cursor: 'pointer'
});
const cardCita = { padding: '15px', borderRadius: '18px', backgroundColor: '#fff', border: '1px solid #eee', marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' };
const textSmall = { fontSize: '12px', color: '#888', margin: 0 };
const timeBox = { backgroundColor: '#fdf2f8', padding: '8px', borderRadius: '8px', fontSize: '12px', color: '#d15690', fontWeight: 'bold' };
const btnWaStaff = { flex: 1, padding: '10px', backgroundColor: '#000', color: '#ff85a1', border: '1px solid #ff85a1', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' };
const selectStyle = { padding: '5px', borderRadius: '8px', border: '1px solid #ff85a1', fontSize: '11px', outline: 'none' };
const titleSection = { fontSize: '18px', color: '#000', marginBottom: '15px' };
const gridStaff = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const cardProductStaff = { border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' };
const imgStaff = { width: '100%', height: '100px', objectFit: 'cover' };
