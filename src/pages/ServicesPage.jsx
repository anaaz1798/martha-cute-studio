import { useState } from 'react';

const MENU_SERVICIOS = [
  {
    categoria: 'Pestañas',
    icon: '👁️',
    items: [
      { id: 1, nombre: 'Clásicas', precio: 50, tiempo: '1h 30min' },
      { id: 2, nombre: 'Volumen Ruso', precio: 80, tiempo: '2h 15min' },
      { id: 3, nombre: 'Híbridas', precio: 65, tiempo: '2h' },
      { id: 4, nombre: 'Lifting + Tinte', precio: 45, tiempo: '1h' }
    ]
  },
  {
    categoria: 'Cejas',
    icon: '✨',
    items: [
      { id: 5, nombre: 'Diseño + Depilación', precio: 20, tiempo: '30min' },
      { id: 6, nombre: 'Laminado de Cejas', precio: 55, tiempo: '1h' },
      { id: 7, nombre: 'Pigmentación Henna', precio: 30, tiempo: '45min' }
    ]
  },
  {
    categoria: 'Faciales',
    icon: '🧼',
    items: [
      { id: 8, nombre: 'Limpieza Profunda', precio: 60, tiempo: '1h 15min' },
      { id: 9, nombre: 'Hidratación VIP', precio: 40, tiempo: '45min' }
    ]
  }
];

export default function ServicesPage() {
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <div style={{ maxWidth: '450px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#111', fontSize: '24px' }}>Nuestros Servicios</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Selecciona lo que deseas agendar</p>

      {MENU_SERVICIOS.map((cat) => (
        <div key={cat.categoria} style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '18px', color: '#d15690', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '15px' }}>
            {cat.icon} {cat.categoria}
          </h2>
          
          {cat.items.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setSeleccionado(s)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: '0.2s',
                backgroundColor: seleccionado?.id === s.id ? '#fff0f6' : '#fff',
                border: seleccionado?.id === s.id ? '2px solid #d15690' : '1px solid #f0f0f0'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#333' }}>{s.nombre}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{s.tiempo}</div>
              </div>
              <div style={{ fontWeight: 'bold', color: '#d15690' }}>${s.precio}</div>
            </div>
          ))}
        </div>
      ))}

      <button 
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: seleccionado ? '#d15690' : '#ccc',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: seleccionado ? 'pointer' : 'not-allowed',
          marginTop: '20px'
        }}
        disabled={!seleccionado}
      >
        {seleccionado ? `Reservar ${seleccionado.nombre}` : 'Elige un servicio'}
      </button>
    </div>
  );
}
