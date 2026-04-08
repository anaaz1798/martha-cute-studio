import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Sparkles, ShoppingBag, Megaphone } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para saber en qué página estamos y pintar el icono de rosado
  const active = (path) => location.pathname === path ? '#d81b60' : '#9ca3af';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-50 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1">
        <Heart className="w-6 h-6 transition-colors" color={active('/')} fill={location.pathname === '/' ? '#d81b60' : 'none'} />
        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: active('/') }}>Home</span>
      </button>
      
      <button onClick={() => navigate('/servicios')} className="flex flex-col items-center gap-1">
        <Sparkles className="w-6 h-6 transition-colors" color={active('/servicios')} />
        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: active('/servicios') }}>Servicios</span>
      </button>

      <button onClick={() => navigate('/vitrina')} className="flex flex-col items-center gap-1">
        <ShoppingBag className="w-6 h-6 transition-colors" color={active('/vitrina')} />
        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: active('/vitrina') }}>Vitrina</span>
      </button>

      <button onClick={() => navigate('/eventos')} className="flex flex-col items-center gap-1">
        <Megaphone className="w-6 h-6 transition-colors" color={active('/eventos')} />
        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: active('/eventos') }}>Eventos</span>
      </button>
    </nav>
  );
}
