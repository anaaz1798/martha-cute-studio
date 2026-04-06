import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import CalendarPage from './CalendarPage';

export default function BookingPage({ servicioSeleccionado }) {
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // 1. Buscamos quién es la clienta que está conectada
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const confirmarCita = async (fecha, hora) => {
    if (!user) return alert("Debes iniciar sesión para agendar.");

    // Combinamos fecha y hora para el formato de la base de datos
    const appointmentTime = `${fecha}T${hora}:00Z`;

    // 2. Guardamos la cita en la tabla 'appointments'
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          client_id: user.id,
          service_id: servicioSeleccionado.id,
          appointment_time: appointmentTime,
          status: 'scheduled'
        }
      ]);

    if (error) {
      alert("Error al agendar: " + error.message);
    } else {
      setMensaje(`¡Listo Ana! Cita confirmada para el ${fecha} a las ${hora}.`);
    }
  };

  if (mensaje) {
    return (
      <div className="bolt-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: '#25D366' }}>✨ ¡Reservada! ✨</h2>
        <p>{mensaje}</p>
        <button className="bolt-btn" onClick={() => window.location.reload()}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ textAlign: 'center', color: '#666' }}>
        Agendando: <span style={{ color: '#d15690' }}>{servicioSeleccionado.name}</span>
      </h3>
      <CalendarPage 
        servicioId={servicioSeleccionado.id} 
        onConfirm={confirmarCita} 
      />
    </div>
  );
}
