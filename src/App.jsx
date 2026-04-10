import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import VitrinaPage from './pages/VitrinaPage'; // <-- Revisa que se llame así
import EventsPage from './pages/EventsPage';   // <-- Revisa que se llame así

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/vitrina" element={<VitrinaPage />} />
        <Route path="/eventos" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
