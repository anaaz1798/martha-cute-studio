import { Link, useLocation } from 'react-router-dom';
import { Heart, Scissors, ShoppingBag, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-pink-50 flex justify-around p-3 z-50">
      <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-[#d81b60]' : 'text-gray-300'}`}>
        <Heart size={20} fill={isActive('/') ? '#d81b60' : 'none'} />
        <span className="text-[7px] uppercase font-black mt-1 tracking-widest">Home</span>
      </Link>
      
      <Link to="/reservar" className={`flex flex-col items-center ${isActive('/reservar') ? 'text-[#d81b60]' : 'text-gray-300'}`}>
        <Scissors size={20} />
        <span className="text-[7px] uppercase font-black mt-1 tracking-widest">Citas</span>
      </Link>

      <Link to="/vitrina" className={`flex flex-col items-center ${isActive('/vitrina') ? 'text-[#d81b60]' : 'text-gray-300'}`}>
        <ShoppingBag size={20} />
        <span className="text-[7px] uppercase font-black mt-1 tracking-widest">Vitrina</span>
      </Link>
      
      <Link to="/eventos" className={`flex flex-col items-center ${isActive('/eventos') ? 'text-[#d81b60]' : 'text-gray-300'}`}>
        <Calendar size={20} />
        <span className="text-[7px] uppercase font-black mt-1 tracking-widest">Eventos</span>
      </Link>
    </nav>
  );
}
