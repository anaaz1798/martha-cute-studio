// En src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { Heart, Scissors, ShoppingBag, Calendar } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-2 z-50">
      <Link to="/" className="flex flex-col items-center text-gray-400">
        <Heart size={20} />
        <span className="text-[8px] uppercase font-bold">Home</span>
      </Link>
      
      {/* CAMBIA ESTO: Que mande a /reservar en vez de /servicios */}
      <Link to="/reservar" className="flex flex-col items-center text-[#d81b60]">
        <Scissors size={20} />
        <span className="text-[8px] uppercase font-bold">Servicios</span>
      </Link>

      <Link to="/vitrina" className="flex flex-col items-center text-gray-400">
        <ShoppingBag size={20} />
        <span className="text-[8px] uppercase font-bold">Vitrina</span>
      </Link>
      
      <Link to="/eventos" className="flex flex-col items-center text-gray-400">
        <Calendar size={20} />
        <span className="text-[8px] uppercase font-bold">Eventos</span>
      </Link>
    </nav>
  );
}
