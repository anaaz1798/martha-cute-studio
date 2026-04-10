import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Reservar from './pages/Reservar';
import ServicesPage from './pages/ServicesPage';
import EventsPage from './pages/EventsPage'; // Corregido: antes decía EventosPage
import VitrinaPage from './pages/VitrinaPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="pb-20">
        <Routes>
          {/* Inicio con el botón rosa y banners */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Página compacta de reservas */}
          <Route path="/reservar" element={<Reservar />} />
          
          {/* Otras rutas corregidas según tus archivos */}
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/vitrina" element={<VitrinaPage />} />

          {/* Por si acaso escriben cualquier cosa en la URL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
