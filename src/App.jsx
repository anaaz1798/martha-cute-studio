import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Reservar from './pages/Reservar';
import ServicesPage from './pages/ServicesPage';
import EventosPage from './pages/EventosPage';
import VitrinaPage from './pages/VitrinaPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="pb-20"> {/* Espacio para que el menú no tape nada */}
        <Routes>
          {/* Esta es la pantalla de inicio con el botón rosa y banners */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Esta es la nueva página compacta que creaste */}
          <Route path="/reservar" element={<Reservar />} />
          
          {/* Otras rutas existentes */}
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/vitrina" element={<VitrinaPage />} />
        </Routes>
        
        {/* El Navbar se mantiene abajo siempre */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
