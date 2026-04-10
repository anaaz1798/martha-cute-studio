import { Link, useLocation } from 'react-router-dom';
import { Heart, Scissors, ShoppingBag, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-rose-50 flex justify-around p-3 z-50">
      {[
        { to: '/', icon: Heart, label: 'Home' },
        { to: '/reservar', icon: Scissors, label: 'Citas' },
        { to: '/vitrina', icon: ShoppingBag, label: 'Vitrina' },
        { to: '/eventos', icon: Calendar, label: 'Eventos' }
      ].map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className={`flex flex-col items-center ${isActive(item.to) ? 'text-[#fb7185]' : 'text-gray-300'}`}
        >
          <item.icon size={20} fill={isActive(item.to) ? '#fb7185' : 'none'} />
          <span className="text-[7px] uppercase font-black mt-1 tracking-widest">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
