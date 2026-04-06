import { supabase } from '../supabase';

export default function HomePage() {
  const categorias = [
    { id: 1, nombre: 'Cabello', icono: '💇‍♀️', color: '#ffafcc' },
    { id: 2, nombre: 'Uñas', icono: '💅', color: '#bde0fe' },
    { id: 3, nombre: 'Cejas', icono: '👁️', color: '#cdb4db' },
    { id: 4, nombre: 'Maquillaje', icono: '💄', color: '#a2d2ff' }
  ];

  return (
    <div className="iphone-container">
      <h1 className="greeting">¿Qué nos hacemos hoy?</h1>
      <div className="category-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
        {categorias.map(cat => (
          <div key={cat.id} className="category-card" style={{backgroundColor: cat.color, padding: '25px', borderRadius: '20px', textAlign: 'center'}}>
            <span style={{fontSize: '40px'}}>{cat.icono}</span>
            <h3>{cat.nombre}</h3>
          </div>
        ))}
      </div>
      <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="btn-logout-mini" style={{marginTop: '20px'}}>Cerrar Sesión</button>
    </div>
  );
}
