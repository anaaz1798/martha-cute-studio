import { useState } from 'react';

const MENU_SERVICIOS = [
  {
    categoria: 'Cabello',
    icon: '💇‍♀️',
    items: [
      { id: 10, nombre: 'Corte Dama', precio: 35, tiempo: '1h' },
      { id: 11, nombre: 'Secado + Plancha', precio: 25, tiempo: '45min' },
      { 
        id: 12, 
        nombre: 'Presupuesto de color', 
        isWhatsApp: true, 
        link: 'https://wa.link/nkdmm8' 
      }
    ]
  },
  {
    categoria: 'Pestañas',
    icon: '👁️',
    items: [
      { id: 1, nombre: 'Clásicas', precio: 50, tiempo: '1h 30min' },
      { id: 2, nombre: 'Volumen Ruso', precio: 80, tiempo: '2h 15min' }
    ]
  },
  {
    categoria: 'Cejas',
    icon: '✨',
    items: [
      { id: 5, nombre: 'Diseño + Depilación', precio: 20, tiempo: '30min' },
      { id: 6, nombre: 'Laminado de Cejas', precio: 55, tiempo: '1h' }
    ]
  }
];

export default function ServicesPage() {
  const [seleccionado, setSeleccionado] = useState(null);

  const handleAction = (item) => {
    if (item.isWhatsApp) {
      window.open(item.link, '_blank');
    } else {
      setSeleccionado(item);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#111', fontSize: '24px' }}>Nuestros Servicios</h1>
      
      {MENU_SERVICIOS.map((cat) => (
        <div key={cat.categoria} style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '18px', color: '#d15690', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '15px' }}>
            {cat.icon} {cat.categoria}
          </h2>
          
          {cat.items.map((s) => (
            <div 
              key={s.id} 
              onClick={() => handleAction(s)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor: seleccionado?.id === s.id ? '#fff0f6' : '#fff',
                border: s.isWhatsApp ? '2px solid #25D366' : (seleccionado?.id === s.id ? '2px solid #d15690' : '1px solid #f0f0f0')
              }}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#333' }}>{s.nombre}</div>
                {s.tiempo && <div style={{ fontSize: '12px', color: '#999' }}>{s.tiempo}</div>}
                {s.isWhatsApp && <div style={{ fontSize: '12px', color: '#25D366', fontWeight: 'bold' }}>Pedir presupuesto</div>}
              </div>
              <div style={{ fontWeight: 'bold', color: s.isWhatsApp ? '#25D366' : '#d15690' }}>
                {s.isWhatsApp ? '📲' : `$${s.precio}`}
              </div>
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
