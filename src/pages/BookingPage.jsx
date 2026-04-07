import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { sonarBrillitos } from '../utils/notifications';

export default function BookingPage() {
  const [perfil, setPerfil] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: s } = await supabase.from('services').select('*').eq('is_active', true);
    setPerfil(p);
    setServicios(s || []);
  }

  const handleReserva = async (e) => {
    e.preventDefault();
    if (!servicioSeleccionado || !fecha || !hora) return alert("Llena todos los campos, hermosa ✨");

    setLoading(true);

    // LÓGICA ESPECIAL: PRESUPUESTO DE COLOR
    if (servicioSeleccionado.is_color_budget) {
      const msg = encodeURIComponent(`¡Hola Martha! ✨ Soy ${perfil.full_name}. Quiero un presupuesto de color para el ${fecha}. 💖`);
      window.open(`https://wa.me/584241234567?text=${msg}`, '_blank'); // Cambia por tu número
      alert("Solicitud enviada. Te avisaremos cuando tu presupuesto esté listo ✨");
      setLoading(false);
      return;
    }

    // RESERVA NORMAL
    const { error } = await supabase.from('appointments').insert([
      {
        user_id: perfil.id,
        service_id: servicioSeleccionado.id,
        appointment_time: `${fecha}T${hora}:00`,
        status: 'scheduled'
      }
    ]);

    if (error) {
      alert("Hubo un error, intenta de nuevo");
    } else {
      sonarBrillitos(); // ¡MAGIA! ✨
      alert(`¡Cita confirmada, ${perfil.full_name.split(' ')[0]}! 💖 Te esperamos.`);
    }
    setLoading(false);
  };

  return (
    <div style={container}>
      <header style={header}>
        <h2 style={title}>Reserva tu Momento ✨</h2>
        <p style={subtitle}>Elige lo que te haga brillar hoy</p>
      </header>

      <form onSubmit={handleReserva} style={formStyle}>
        {/* SELECCIÓN DE SERVICIO */}
        <label style={label}>¿Qué servicio deseas?</label>
        <select 
          style={input} 
          onChange={(e) => setServicioSeleccionado(servicios.find(s => s.id === parseInt(e.target.value)))}
          required
        >
          <option value="">Selecciona un servicio...</option>
          {servicios.map(s => (
            <option key={s.id} value={s.id}>{s.name} - {s.is_color_budget ? 'Presupuesto' : `$${s.price}`}</option>
          ))}
        </select>

        {/* FECHA Y HORA */}
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

        {/* BOTÓN DINÁMICO */}
        <button type="submit" style={btnPrincipal} disabled={loading}>
          {loading ? 'Procesando...' : servicioSeleccionado?.is_color_budget ? 'Pedir Presupuesto 🎨' : 'Confirmar Cita 💖'}
        </button>
      </form>

      {/* BANNER DE CIERRE */}
      <div style={footerBanner}>
        <p>¡Cita confirmada! 💖 Hasta entonces, mira nuestras redes o revisa nuestra vitrina.</p>
      </div>
    </div>
  );
}

// --- ESTILOS NATIVOS ---
const container = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' };
const header = { textAlign: 'center', marginBottom: '30px' };
const title = { color: '#000', fontSize: '24px', fontFamily: 'serif', margin: 0 };
const subtitle = { color: '#ff85a1', fontSize: '14px', fontWeight: 'bold' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const label = { fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '5px' };
const input = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', backgroundColor: '#fafafa', boxSizing: 'border-box' };
const btnPrincipal = { 
  width: '100%', padding: '15px', marginTop: '10px', borderRadius: '15px', border: 'none',
  backgroundColor: '#000', color: '#ff85a1', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(255, 133, 161, 0.3)' 
};
const footerBanner = { 
  marginTop: '40px', padding: '20px', backgroundColor: '#fdf2f8', 
  borderRadius: '20px', textAlign: 'center', color: '#d15690', fontSize: '13px', fontWeight: 'bold' 
};
