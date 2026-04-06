
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function AdminPage() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const cargarCitas = async () => {
      const { data } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
      setCitas(data || []);
    };
    cargarCitas();
  }, []);

  return (
    <div className="admin-dashboard" style={{backgroundColor: '#fce4ec', minHeight: '100vh', padding: '20px'}}>
      <div className="admin-banner" style={{background: 'linear-gradient(90deg, #ffc1e3, #e1bee7)', padding: '20px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2 style={{margin:0, color: '#880e4f'}}>Panel Jefa 👑</h2>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="btn-logout-mini">Salir</button>
      </div>
      <div className="dash-card" style={{background: 'white', padding: '20px', borderRadius: '15px'}}>
        <h3>📬 Citas Recibidas</h3>
        {citas.map(c => (
          <div key={c.id} style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>
            <strong>{c.nombre}</strong> - {c.servicio}
          </div>
        ))}
      </div>
    </div>
  );
}
