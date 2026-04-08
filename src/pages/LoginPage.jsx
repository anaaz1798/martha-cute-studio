import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Scissors, Wand2, Star, Sparkle, LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('services').select('*');
      setServicios(data || []);
    }
    cargar();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
    } catch (err) { alert(err.message); }
  };

  const iconMap = { 
    'CABELLO': Scissors, 'CEJAS': Sparkle, 'PESTAÑAS': Wand2, 'UÑAS': Star, 'DEFAULT': Sparkles 
  };

  const categoriasUnicas = [...new Set(servicios.map(s => s.category?.toUpperCase() || 'OTROS'))];

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-8 px-4 font-sans">
      <main className="max-w-md mx-auto pt-4 space-y-6">
        
        {/* BOTÓN DE ENTRAR RECUPERADO (image_be7add.jpg) */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowAuth(!showAuth)} 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#d81b60] transition-colors"
          >
            <LogIn className="w-4 h-4" /> Entrar
          </button>
        </div>

        {/* CABEZAL GRANDE Y ELEGANTE (image_be6fdf.jpg) */}
        <section className="bg-white rounded-[35px] p-8 text-center shadow-sm border border-pink-50/50">
          <div className="bg-[#d81b60] w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto mb-5 rotate-3 shadow-lg shadow-pink-100">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-1">Martha Cute Studio</h1>
          <p className="text-gray-400 text-xs font-medium mb-8">Reserva tu cita o pide presupuesto de color</p>
          
          <button 
            onClick={() => navigate('/reservar')} 
            className="w-full bg-[#d81b60] text-white font-bold py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-pink-200 active:scale-95 transition-all"
          >
            Reservar Cita
          </button>
        </section>

        {/* LOGIN FORM (Aparece al darle a Entrar) */}
        {showAuth && (
          <div className="bg-white rounded-[28px] p-6 shadow-md border border-pink-50 animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleAuth} className="space-y-3">
              <input className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs outline-none" type="password" placeholder="Clave" onChange={e => setPassword(e.target.value)} />
              <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest">Acceder</button>
            </form>
          </div>
        )}

        {/* BANNERS DE CATEGORÍAS (image.png con corrección de tamaño) */}
        <div className="grid grid-cols-2 gap-4">
          {categoriasUnicas.map(cat => {
            const servicioConImagen = servicios.find(s => s.category?.toUpperCase() === cat && s.image_url);
            const bgImage = servicioConImagen?.image_url || 'https://via.placeholder.com/300';
            const Icono = iconMap[cat] || iconMap['DEFAULT'];

            return (
              <div 
                key={cat} 
                onClick={() => navigate(`/reservar?categoria=${cat}`)}
                className="relative h-36 rounded-[28px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all group"
              >
                <img src={bgImage} alt={cat} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center">
                  <div className="bg-white/20 p-2 rounded-xl mb-2 backdrop-blur-md border border-white/10">
                    <Icono className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-black text-white text-[11px] uppercase tracking-wider">{cat}</h4>
                  <span className="text-[9px] font-bold text-pink-200 uppercase mt-1 opacity-90">Ver menú</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
