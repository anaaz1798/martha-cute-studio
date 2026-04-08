import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import Reservar from './pages/Reservar';
import EventosPage from './pages/EventosPage';
import VitrinaPage from './pages/VitrinaPage';
import Navbar from './components/Navbar'; // <--- IMPORTA EL NAVBAR AQUÍ

function App() {
  return (
    <Router>
      <div className="pb-20"> {/* Espacio para que el menú no tape el contenido */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/vitrina" element={<VitrinaPage />} />
        </Routes>
        <Navbar /> {/* <--- PONLO AQUÍ PARA QUE SE VEA SIEMPRE */}
      </div>
    </Router>
  );
}

export default App;
