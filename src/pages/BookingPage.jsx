import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

export default function BookingPage() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    const { data: s } = await supabase.from('services').select('*').eq('is_active', true);
    setServicios(s || []);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setPerfil(p);
    }
  }

  // Mapeo de iconos por categoría para que brille como en Bolt
  const iconMap = { 'Uñas': '💅', 'Pestañas': '✨', 'Cejas': '👁️', 'Cabello': '💇‍♀️' };

  const agrupados = servicios.reduce((acc, s) => {
    const cat = s.category || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="martha-container">
      <header className="martha-header">
        <div style={{background: '#e91e63', padding: '8px', borderRadius: '10px', color: 'white'}}>✨</div>
        <h2 style={{margin: 0, fontSize: '20px'}}>Martha Cute Studio</h2>
        {!perfil && <Link to="/login" style={{marginLeft: 'auto', color: '#e91e63', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold'}}>Entrar 🔑</Link>}
      </header>

      {Object.keys(agrupados).map(cat => (
        <section key={cat} className="category-section">
          <div className="category-title">
            <span>{iconMap[cat] || '🌸'}</span> {cat}
          </div>
          <div className="service-list">
            {agrupados[cat].map(s => (
              <div key={s.id} className="service-item">
                <div className="service-info">
                  <h4>{s.name}</h4>
                  <p>⏱ {s.duration_minutes} min</p>
                </div>
                <div className="service-right">
                  <span className="price">${s.price}</span>
                  <button className="btn-book" onClick={() => setSeleccionado(s)}>
                    <span>💖</span> Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {seleccionado && (
        <div className="booking-card">
          <h3 style={{textAlign: 'center', color: '#e91e63'}}>Agendar {seleccionado.name}</h3>
          <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
            <input type="date" className="martha-input" style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} onChange={e => setFecha(e.target.value)} />
            <input type="time" className="martha-input" style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} onChange={e => setHora(e.target.value)} />
          </div>
          <button 
            className="btn-book" 
            style={{width: '100%', padding: '15px', justifyContent: 'center', fontSize: '16px'}}
            onClick={() => !perfil ? navigate('/login') : alert('Cita enviada 💖')}
          >
            {perfil ? 'Confirmar Cita 💖' : 'Inicia Sesión para Confirmar 🔑'}
          </button>
        </div>
      )}
    </div>
  );
}
