import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Scissors, Wand2, Star, Sparkle, Calendar, LogIn } from 'lucide-react';

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

  const iconMap = { 'CABELLO': Scissors, 'CEJAS': Sparkle, 'PESTAÑAS': Wand2, 'UÑAS': Star, 'DEFAULT': Sparkles };
  const categoriasUnicas = [...new Set(servicios.map(s => s.category?.toUpperCase() || 'OTROS'))];

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-20 px-4">
      <main className="max-w-4xl mx-auto pt-6 space-y-8">
        
        {/* LOGIN DISCRETO */}
        <div className="flex justify-end opacity-30">
          <button onClick={() => setShowAuth(!showAuth)} className="p-2 hover:text-[#d81b60]"><LogIn className="w-5 h-5" /></button>
        </div>

        {/* BIENVENIDA */}
        <section className="bg-white rounded-[40px] p-12 text-center shadow-sm border border-pink-50/50">
          <div className="bg-[#d81b60] w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 rotate-6 shadow-lg shadow-pink-100">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Martha Cute Studio</h1>
          <p className="text-gray-400 text-sm font-medium mb-10 max-w-md mx-auto">Reserva tu cita y vive la experiencia Cute.</p>
          
          {/* CAMBIO: AHORA LLEVA DIRECTO A RESERVAR */}
          <button 
            onClick={() => navigate('/reservar')} 
            className="bg-[#d81b60] text-white font-bold py-5 px-10 rounded-[22px] shadow-lg shadow-pink-200 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest mx-auto"
          >
            <Calendar className="w-5 h-5" /> Reservar Cita
          </button>
        </section>

        {showAuth && (
          <section className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-50 max-w-sm mx-auto animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleAuth} className="space-y-3">
              <input className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none border-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none border-none" type="password" placeholder="Clave" onChange={e => setPassword(e.target.value)} />
              <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest">Entrar</button>
            </form>
          </section>
        )}

        {/* BANNERS DE CATEGORÍAS */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {categoriasUnicas.map(cat => {
            const Icono = iconMap[cat] || iconMap['DEFAULT'];
            return (
              <div 
                key={cat} 
                onClick={() => navigate(`/reservar?categoria=${cat}`)}
                className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6 cursor-pointer hover:border-pink-200 active:scale-[0.98] transition-all"
              >
                <div className="bg-pink-50 p-6 rounded-[32px] text-[#d81b60]">
                  <Icono className="w-12 h-12" />
                </div>
                <h4 className="font-black text-gray-900 text-2xl tracking-tighter uppercase">{cat}</h4>
                <div className="bg-gray-900 text-white text-[9px] font-black px-6 py-3 rounded-full uppercase tracking-[0.2em]">Ver Servicios</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
