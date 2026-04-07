import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom'; // Para navegar al login
import { sonarBrillitos } from '../utils/notifications';

export default function BookingPage() {
  const navigate = useNavigate();
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
    // 1. Cargamos servicios siempre (es público)
    const { data: s } = await supabase.from('services').select('*').eq('is_active', true);
    setServicios(s || []);

    // 2. Revisamos si el usuario ya está logueado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setPerfil(p);
    }

    // 3. ¿Venía un servicio pre-seleccionado de la vitrina? ✨
    const guardado = localStorage.getItem('servicio_interes');
    if (guardado) {
      const servicioObj = JSON.parse(guardado);
      setServicioSeleccionado(servicioObj);
      localStorage.removeItem('servicio_interes'); // Limpiamos para que no se repita
    }
  }

  const handleReserva = async (e) => {
    e.preventDefault();
    
    // 🚨 FILTRO MAESTRO: Si no hay perfil (no logueado), pal' login
    if (!perfil) {
      localStorage.setItem('servicio_interes', JSON.stringify(servicioSeleccionado));
      alert("¡Casi lista! 💖 Inicia sesión rápido para confirmar tu cita.");
      return navigate('/login');
    }

    if (!servicioSeleccionado || !fecha || !hora) return alert("Llena todos los campos, hermosa ✨");

    setLoading(true);

    // Validación de día cerrado
    const { data: diaCerrado } = await supabase.from('closed_days').select('*').eq('closed_date', fecha).single();
    if (diaCerrado) {
      alert("¡Ay, lo sentimos! 🌸 Este día el estudio estará cerrado.");
      setLoading(false);
      return;
    }

    // Lógica de Presupuesto de Color
    if (servicioSeleccionado.is_color_budget) {
      const msg = encodeURIComponent(`¡Hola Martha! ✨ Soy ${perfil.full_name}. Quiero presupuesto de color para el ${fecha}. 💖`);
      window.open(`https://wa.me/584241234567?text=${msg}`, '_blank');
      setLoading(false);
      return;
    }

    // Reserva Normal
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
      sonarBrillitos();
      alert(`¡Cita confirmada, ${perfil.full_name.split(' ')[0]}! 💖 Te esperamos.`);
    }
    setLoading(false);
  };

  return (
    <div style={container}>
      <header style={header}>
        <h2 style={title}>Martha Cute Studio ✨</h2>
        <p style={subtitle}>Reserva tu Momento</p>
      </header>

      <form onSubmit={handleReserva} style={formStyle}>
        <label style={label}>¿Qué servicio deseas?</label>
        <select 
          style={input} 
          value={servicioSeleccionado?.id || ""}
          onChange={(e) => setServicioSeleccionado(servicios.find(s => s.id === parseInt(e.target.value)))}
          required
        >
          <option value="">Selecciona un servicio...</option>
          {servicios.map(s => (
            <option key={s.id} value={s.id}>{s.name} - {s.is_color_budget ? 'Presupuesto' : `$${s.price}`}</option>
          ))}
        </select>

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
          {loading ? 'Procesando...' : !perfil ? 'Inicia sesión para agendar 🔑' : servicioSeleccionado?.is_color_budget ? 'Pedir Presupuesto 🎨' : 'Confirmar Cita 💖'}
        </button>
      </form>
      
      {/* (Resto de los estilos igual...) */}
    </div>
  );
}

// ... (Tus estilos nativos se mantienen iguales)
