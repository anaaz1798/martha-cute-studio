import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('branding');

  return (
    <div className="bolt-screen" style={{ flexDirection: 'column', padding: '20px' }}>
      <div className="bolt-card" style={{ maxWidth: '800px', width: '100%' }}>
        <h1 className="bolt-title">Panel de Administración</h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
          <button onClick={() => setActiveTab('branding')} className="bolt-btn" style={{ width: 'auto', padding: '10px 20px' }}>Branding</button>
          <button onClick={() => setActiveTab('servicios')} className="bolt-btn" style={{ width: 'auto', padding: '10px 20px' }}>Servicios</button>
          <button onClick={() => setActiveTab('citas')} className="bolt-btn" style={{ width: 'auto', padding: '10px 20px' }}>Citas</button>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
          <p>Gestionando: <strong>{activeTab.toUpperCase()}</strong></p>
          <p style={{ color: '#666' }}>Aquí aparecerán las opciones para editar tu estudio.</p>
        </div>
      </div>
    </div>
  );
}
