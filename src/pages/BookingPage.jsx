import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Clock, ChevronRight, Calendar } from 'lucide-react';
import '../index.css'; // <--- CAMBIADO A INDEX.CSS

export default function BookingPage() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    async function cargar() {
      const { data: s } = await supabase.from('services').select('*').eq('is_active', true);
      setServicios(s || []);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setPerfil(p);
      }
    }
    cargar();
  }, []);

  const iconMap = { 'Uñas': '💅', 'Pestañas': '✨', 'Cejas': '👁️', 'Cabello': '💇‍♀️' };

  const agrupados = servicios.reduce((acc, s) => {
    const cat = s.category || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Fucsia Estilo Bolt */}
      <header className="bg-primary p-4 shadow-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-white/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">Martha Cute Studio</span>
        </div>
        {!perfil && (
          <Link to="/login" className="text-white text-xs font-bold bg-white/20 px-3 py-2 rounded-full">
            ENTRAR 🔑
          </Link>
        )}
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <h2 className="text-2xl font-black text-gray-800 mt-4">Servicios ✨</h2>

        {Object.keys(agrupados).map(cat => (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
              <span>{iconMap[cat] || '🌸'}</span>
              {cat}
            </div>
            
            <div className="grid gap-3">
              {agrupados[cat].map(s => (
                <div 
                  key={s.id}
                  onClick={() => setSeleccionado(s)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                    seleccionado?.id === s.id 
                    ? 'border-primary bg-white shadow-lg scale-[1.02]' 
                    : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900">{s.name}</h4>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {s.duration_minutes} min
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-primary text-lg">${s.price}</span>
                    <div className={`p-1 rounded-full ${seleccionado?.id === s.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Card de Reserva - Solo aparece al elegir servicio */}
        {seleccionado && (
          <div className="bg-white p-6 rounded-3xl shadow-2xl border-t-4 border-primary fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Agendar {seleccionado.name}</h3>
              <button onClick={() => setSeleccionado(null)} className="text-gray-400 text-xs">Cerrar</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input 
                type="date" 
                className="w-full p-3 bg-gray-100 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary"
                onChange={e => setFecha(e.target.value)}
              />
              <input 
                type="time" 
                className="w-full p-3 bg-gray-100 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary"
                onChange={e => setHora(e.target.value)}
              />
            </div>

            <button 
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
              onClick={() => !perfil ? navigate('/login') : alert('Cita enviada 💖')}
            >
              {perfil ? 'CONFIRMAR CITA 💖' : 'INICIA SESIÓN PARA AGENDAR'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
