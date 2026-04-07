import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ServicesPage from './pages/ServicesPage';
import VitrinaPage from './pages/VitrinaPage';
import AdminPanel from './pages/AdminPanel';
import SignUp from './pages/SignUp';
// Importa aquí tus otras páginas (Login, Home, etc.)

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', paddingBottom: '70px' }}>
        
        {/* Logo / Header */}
        <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
          <h1 style={{ margin: 0, color: '#d15690', fontSize: '24px', fontFamily: 'serif' }}>The Cute Studio</h1>
        </header>

        {/* Cuerpo de la App */}
        <main style={{ padding: '10px' }}>
          <Routes>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/vitrina" element={<VitrinaPage />} />
            <Route path="/registro" element={<SignUp />} />
            <Route path="/admin-pro" element={<AdminPanel />} />
            {/* Agrega más rutas según necesites */}
          </Routes>
        </main>

        {/* Menú de Navegación Inferior (Estilo App Movil) */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65px',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid #eee',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          zIndex: 1000
        }}>
          <Link to="/" style={linkStyle}>🏠<span style={labelStyle}>Servicios</span></Link>
          <Link to="/vitrina" style={linkStyle}>🛍️<span style={labelStyle}>Vitrina</span></Link>
          <Link to="/registro" style={linkStyle}>👤<span style={labelStyle}>Perfil</span></Link>
          {/* Este solo lo ves tú, puedes ocultarlo después con lógica de Admin */}
          <Link to="/admin-pro" style={linkStyle}>⚙️<span style={labelStyle}>Admin</span></Link>
        </nav>

      </div>
    </Router>
  );
}

// --- ESTILOS RÁPIDOS ---
const linkStyle = {
  textDecoration: 'none',
  fontSize: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#666'
};

const labelStyle = {
  fontSize: '10px',
  marginTop: '4px',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};
