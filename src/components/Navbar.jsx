import { Link, useLocation } from 'react-router-dom';
import { Heart, Stars, ShoppingBag, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-pink-50 flex justify-around p-3 z-50">
      {[
        { to: '/', icon: Heart, label: 'Home' },
        { to: '/servicios', icon: Stars, label: 'Servicios' },
        { to: '/vitrina', icon: ShoppingBag, label: 'Vitrina' },
        { to: '/eventos', icon: Calendar, label: 'Eventos' }
      ].map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className="flex flex-col items-center transition-all duration-300"
        >
          {/* Quitamos el 'fill' para que no se rellene y usamos tu rosado #ec4899 */}
          <item.icon 
            size={20} 
            strokeWidth={isActive(item.to) ? 3 : 2} 
            className={`${isActive(item.to) ? 'text-[#ec4899]' : 'text-gray-300'}`} 
          />
          <span className={`text-[7px] uppercase font-black mt-1 tracking-widest ${isActive(item.to) ? 'text-[#ec4899]' : 'text-gray-300'}`}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
