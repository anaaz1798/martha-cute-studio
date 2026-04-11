import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import Reservar from './pages/Reservar'; 
import VitrinaPage from './pages/VitrinaPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* EL LOGIN DE VUELTA AL PRINCIPIO */}
        <Route path="/" element={<LoginPage />} />
        
        {/* LAS DEMÁS RUTAS EN SU SITIO */}
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/vitrina" element={<VitrinaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
