export default function VitrinaPage() {
  return (
    <div className="bolt-screen">
      <div className="bolt-card" style={{ maxWidth: '500px' }}>
        <div className="bolt-icon-circle"><span>📸</span></div>
        <h1 className="bolt-title">Nuestra Vitrina</h1>
        <p className="bolt-welcome">Mira nuestros mejores resultados</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
          <div style={{ height: '150px', background: '#eee', borderRadius: '15px' }}></div>
          <div style={{ height: '150px', background: '#eee', borderRadius: '15px' }}></div>
        </div>
      </div>
    </div>
  );
}
