import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function CalendarPage({ servicioId, onConfirm }) {
  const [fecha, setFecha] = useState('');
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const horasDisponibles = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  // Esto busca en Supabase qué horas ya están apartadas
  useEffect(() => {
    if (fecha) {
      const consultarCitas = async () => {
        const { data } = await supabase
          .from('appointments')
          .select('appointment_time')
          .gte('appointment_time', `${fecha}T00:00:00`)
          .lte('appointment_time', `${fecha}T23:59:59`);
        
        if (data) {
          const ocupadas = data.map(c => new Date(c.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setHorasOcupadas(ocupadas);
        }
      };
      consultarCitas();
    }
  }, [fecha]);

  return (
    <div className="bolt-card" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2 style={{ color: '#d15690', textAlign: 'center' }}>Selecciona tu Cita</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Día:</label>
        <input 
          type="date" 
          className="bolt-input"
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      {fecha && (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hora disponible:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {horasDisponibles.map((h) => {
              const estaOcupada = horasOcupadas.includes(h);
              return (
                <button
                  key={h}
                  disabled={estaOcupada}
                  onClick={() => onConfirm(fecha, h)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: estaOcupada ? '#eee' : '#fff0f6',
                    color: estaOcupada ? '#aaa' : '#d15690',
                    cursor: estaOcupada ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {h} {estaOcupada ? '(Ocupado)' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
