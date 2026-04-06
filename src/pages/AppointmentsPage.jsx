export default function AppointmentsPage() {
  return (
    <div className="bolt-screen">
      <div className="bolt-card">
        <div className="bolt-icon-circle"><span>📅</span></div>
        <h1 className="bolt-title">Mis Citas</h1>
        <p className="bolt-welcome">Próximos servicios programados</p>
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <p style={{ padding: '15px', background: '#f9f9f9', borderRadius: '10px', borderLeft: '4px solid #d15690' }}>
            No tienes citas pendientes por ahora.
          </p>
        </div>
      </div>
    </div>
  );
}
