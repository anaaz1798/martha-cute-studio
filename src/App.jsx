import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import Reservar from './pages/Reservar'; // <-- Cambié el nombre para que coincida con tu archivo
import VitrinaPage from './pages/VitrinaPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* La página principal ahora es Servicios para que veas el banner */}
        <Route path="/" element={<ServicesPage />} />
        
        {/* Ruta para el login de Martha */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta para el panel de administración */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* ESTA ES LA RUTA QUE TE FALTABA CONECTAR */}
        <Route path="/reservar" element={<Reservar />} />
        
        {/* Ruta para la vitrina de fotos */}
        <Route path="/vitrina" element={<VitrinaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
