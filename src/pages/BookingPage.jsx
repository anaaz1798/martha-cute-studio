import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { sonarBrillitos } from '../utils/notifications';

export default function BookingPage() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [catAbierta, setCatAbierta] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const { data: s } = await supabase.from('services').select('*').eq('is_active', true);
    setServicios(s || []);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setPerfil(p);
    }

    const guardado = localStorage.getItem('servicio_interes');
    if (guardado) {
      const servicioObj = JSON.parse(guardado);
      setServicioSeleccionado(servicioObj);
      localStorage.removeItem('servicio_interes');
    }
  }

  const handleReserva = async (e) => {
    e.preventDefault();
    if (!perfil) {
      localStorage.setItem('servicio_interes', JSON.stringify(servicioSeleccionado));
      alert("¡Casi lista! 💖 Inicia sesión rápido para confirmar tu cita.");
      return navigate('/login');
    }
    if (!servicioSeleccionado || !fecha || !hora) return alert("Llena todos los campos, hermosa ✨");

    setLoading(true);
    const { data: diaCerrado } = await supabase.from('closed_days').select('*').eq('closed_date', fecha).single();
    
    if (diaCerrado) {
      alert("¡Ay, lo sentimos! 🌸 Este día el estudio estará cerrado.");
      setLoading(false);
      return;
    }

    if (servicioSeleccionado.is_color_budget) {
      const msg = encodeURIComponent(`¡Hola Martha! ✨ Soy ${perfil.full_name}. Quiero presupuesto de color para el ${fecha}. 💖`);
      window.open(`https://wa.me/584241234567?text=${msg}`, '_blank');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('appointments').insert([{
      user_id: perfil.id,
      service_id: servicioSeleccionado.id,
      appointment_time: `${fecha}T${hora}:00`,
      status: 'scheduled'
    }]);

    if (error) alert("Hubo un error, intenta de nuevo");
    else {
      sonarBrillitos();
      alert(`¡Cita confirmada, ${perfil.full_name.split(' ')[0]}! 💖 Te esperamos.`);
    }
    setLoading(false);
  };

  const serviciosAgrupados = servicios.reduce((acc, s) => {
    const cat = s.category || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={container}>
      <header style={header}>
        <h2 style={title}>Martha Cute Studio ✨</h2>
        <p style={subtitle}>Reserva tu Momento</p>
      </header>

      <div style={vitrinaContainer}>
        {Object.keys(serviciosAgrupados).map(cat => (
          <div key={cat} style={{ marginBottom: '15px' }}>
            <button 
              type="button"
              onClick={() => setCatAbierta(catAbierta === cat ? null : cat)}
              style={categoryHeader(catAbierta === cat)}
            >
              <span>{cat}</span>
              <span>{catAbierta === cat ? '−' : '+'}</span>
            </button>

            {catAbierta === cat && (
              <div style={gridBanners}>
                {serviciosAgrupados[cat].map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => setServicioSeleccionado(s)}
                    style={servicioBanner(servicioSeleccionado?.id === s.id)}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '15px' }}>{s.name}</h4>
                      <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{s.duration_minutes} min</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={priceTag}>${s.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {servicioSeleccionado && (
        <form onSubmit={handleReserva} style={formStyle}>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#ff85a1', marginBottom: '10px' }}>
            Seleccionado: <strong>{servicioSeleccionado.name}</strong> 💅
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Día</label>
              <input type="date" style={input} onChange={e => setFecha(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Hora</label>
              <input type="time" style={input} onChange={e => setHora(e.target.value)} required />
            </div>
          </div>
          <button type="submit" style={btnPrincipal} disabled={loading}>
            {loading ? 'Procesando...' : !perfil ? 'Inicia sesión para agendar 🔑' : 'Confirmar Cita 💖'}
          </button>
        </form>
      )}
    </div>
  );
}

const container = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' };
const header = { textAlign: 'center', marginBottom: '25px' };
const title = { color: '#000', fontSize: '26px', fontFamily: 'serif', margin: 0 };
const subtitle = { color: '#ff85a1', fontSize: '14px', fontWeight: 'bold' };
const vitrinaContainer = { width: '100%' };
const categoryHeader = (active) => ({
  width: '100%', padding: '15px 20px', backgroundColor: active ? '#ff85a1' : '#fff0f3',
  color: active ? '#fff' : '#ff85a1', border: 'none', borderRadius: '15px',
  display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '10px'
});
const gridBanners = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px', padding: '10px 5px', marginBottom: '20px' };
const servicioBanner = (active) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px',
  borderRadius: '18px', border: active ? '2px solid #ff85a1' : '1px solid #eee',
  backgroundColor: active ? '#fff' : '#fafafa', cursor: 'pointer', transition: '0.3s'
});
const priceTag = { color: '#ff85a1', fontWeight: 'bold', fontSize: '18px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', border: '1px solid #ffdeeb', borderRadius: '20px', backgroundColor: '#fff', maxWidth: '500px', margin: '20px auto' };
const label = { fontSize: '12px', fontWeight: 'bold', color: '#999', marginBottom: '5px', display: 'block' };
const input = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', boxSizing: 'border-box' };
const btnPrincipal = { width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#000', color: '#ff85a1', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' };
