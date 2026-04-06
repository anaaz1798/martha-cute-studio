import { useState } from 'react';

const listaServicios = [
  { id: 1, nombre: 'Extensiones de Pestañas', precio: '$50', duracion: '2h' },
  { id: 2, nombre: 'Diseño de Cejas + Henna', precio: '$25', duracion: '45min' },
  { id: 3, nombre: 'Lifting de Pestañas', precio: '$40', duracion: '1h' },
  { id: 4, nombre: 'Limpieza Facial Express', precio: '$35', duracion: '30min' }
];

export default function ServicesPage() {
  return (
    <div className="bolt-screen">
      <div className="bolt-card">
        <div className="bolt-icon-circle">
          <span style={{fontSize: '24px', color: 'white'}}>💖</span>
        </div>
        
        <h1 className="bolt-title">Nuestros Servicios</h1>
        <p className="bolt-welcome">Elige el consentimiento que mereces</p>

        <div style={{textAlign: 'left', marginTop: '20px'}}>
          {listaServicios.map((servicio) => (
            <div key={servicio.id} style={{
              padding: '15px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{fontWeight: '700', color: '#333'}}>{servicio.nombre}</div>
                <div style={{fontSize: '12px', color: '#999'}}>{servicio.duracion}</div>
              </div>
              <div style={{fontWeight: '800', color: '#d15690'}}>{servicio.precio}</div>
            </div>
          ))}
        </div>

        <button className="bolt-btn" style={{marginTop: '30px'}}>
          Agendar Cita
        </button>
      </div>
    </div>
  );
}
