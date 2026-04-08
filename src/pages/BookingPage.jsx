import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Clock, ChevronRight } from 'lucide-react';
import '../index.css'; 

export default function BookingPage() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        // 1. Traemos todos los servicios (sin el filtro is_active que daba error)
        const { data: s, error: sError } = await supabase
          .from('services')
          .select('*');
        
        if (sError) throw sError;
        setServicios(s || []);

        // 2. Revisamos si hay sesión para el perfil
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setPerfil(p);
        }
      } catch (err) {
        console.error("Error en la carga:", err.message);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // Iconos adaptados a tus categorías en Mayúsculas (según tu captura)
  const iconMap = { 
    'UÑAS': '💅', 
    'PESTAÑAS': '✨', 
    'CEJAS': '👁️', 
    'CABELLO': '💇‍♀️',
    'OTROS': '🌸'
  };

  const agrupados = servicios.reduce((acc, s) => {
    const cat = s.category ? s.category.toUpperCase() : 'OTROS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-[#d81b60]">Cargando servicios...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header style={{ backgroundColor: '#d81b60' }} className="p-4 shadow-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold text-lg">Martha Cute Studio</span>
        </div>
        {!perfil && (
          <Link to="/login" className="text-white text-[10px] font-bold bg-white/20 px-4 py-2 rounded-full uppercase">
            Entrar 🔑
          </Link>
        )}
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <h2 className="text-2xl font-black text-gray-800 mt-4">Nuestros Servicios</h2>

        {servicios.length === 0 && (
          <p className="text-center text-gray-500">No se encontraron servicios en la base de datos.</p>
        )}

        {Object.keys(agrupados).map(cat => (
          <div key={cat} className="space-y-3">
            <div style={{ color: '#d81b60' }} className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <span>{iconMap[cat] || '🌸'}</span> {cat}
            </div>
            
            <div className="grid gap-3">
              {agrupados[cat].map(s => (
                <div 
                  key={s.id}
                  onClick={() => setSeleccionado(s)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                    seleccionado?.id === s.id 
                    ? 'border-[#d81b60] bg-white shadow-xl scale-[1.02]' 
                    : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900">{s.name}</h4>
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                      <Clock className="w-3 h-3" /> {s.duration_minutes || 0} min
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: '#d81b60' }} className="font-black text-xl">${s.price}</span>
                    <ChevronRight className={`w-5 h-5 ${seleccionado?.id === s.id ? 'text-[#d81b60]' : 'text-gray-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Panel de Reserva */}
        {seleccionado && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 max-w-md mx-auto rounded-t-3xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Servicio seleccionado</p>
                <h3 className="font-bold text-gray-900">{seleccionado.name}</h3>
              </div>
              <button onClick={() => setSeleccionado(null)} className="text-gray-400 text-xs bg-gray-100 p-2 rounded-full">Cerrar</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-[#d81b60]" onChange={e => setFecha(e.target.value)} />
              <input type="time" className="w-full p-4 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-[#d81b60]" onChange={e => setHora(e.target.value)} />
            </div>

            <button 
              style={{ backgroundColor: '#d81b60' }}
              className="w-full text-white font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition-all text-lg"
              onClick={() => !perfil ? navigate('/login') : alert('Cita enviada 💖')}
            >
              {perfil ? 'AGENDAR CITA ✨' : 'INICIA SESIÓN PARA AGENDAR'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
