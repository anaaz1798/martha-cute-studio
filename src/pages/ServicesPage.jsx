import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(null);
  const [serviciosAgrupados, setServiciosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  
  // LÓGICA DE RETRACCIÓN DEL BANNER
  const [scrollDir, setScrollDir] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculamos cuánto ha bajado la clienta
      const posicion = window.scrollY;
      setScrollDir(posicion);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function getServicios() {
      const { data } = await supabase.from('servicios').select('*');
      if (data && data.length > 0) {
        const grouped = data.reduce((acc, s) => {
          const cat = s.categoria ? s.categoria.trim() : 'General';
          acc[cat] = acc[cat] || [];
          acc[cat].push(s);
          return acc;
        }, {});
        setServiciosAgrupados(grouped);
        setAbierto(Object.keys(grouped)[0]);
      }
      setLoading(false);
    }
    getServicios();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 font-sans text-gray-800">
      {/* NAVBAR FIJO */}
      <nav className="bg-white/90 backdrop-blur-md p-6 flex items-center sticky top-0 z-[60] border-b border-pink-50 rounded-b-[30px]">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[12px] font-black uppercase tracking-[0.2em] text-center flex-1 mr-8">Servicios</h1>
      </nav>

      <main className="p-6">
        
        {/* EL BANNER QUE SE RETRAE */}
        <div 
          style={{ 
            height: scrollDir > 50 ? '80px' : '180px',
            opacity: scrollDir > 150 ? 0 : 1,
            marginBottom: scrollDir > 150 ? '-180px' : '2rem'
          }}
          className="bg-[#ec4899] rounded-[40px] text-white shadow-lg relative overflow-hidden transition-all duration-500 ease-in-out flex items-center p-8 sticky top-[90px] z-40"
        >
          <div className={`transition-all duration-500 ${scrollDir > 50 ? 'scale-75' : 'scale-100'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Bienvenida</p>
            <h2 className="text-[20px] font-black uppercase leading-tight mt-1">Tu momento <br/> de brillar</h2>
          </div>
          <Sparkles 
            className="absolute right-[-20px] bottom-[-20px] opacity-15 transition-transform duration-700" 
            size={scrollDir > 50 ? 80 : 160} 
          />
        </div>

        {/* LISTADO DE SERVICIOS */}
        <div className="space-y-4 relative z-50">
          {loading ? (
            <p className="text-center text-[10px] font-black uppercase text-pink-300 py-10">Actualizando...</p>
          ) : (
            Object.keys(serviciosAgrupados).map((cat) => (
              <div key={cat} className="space-y-2">
                <button 
                  onClick={() => setAbierto(abierto === cat ? null : cat)}
                  className={`w-full flex items-center justify-between p-6 rounded-[30px] transition-all border-2 ${
                    abierto === cat ? 'bg-gray-800 text-white shadow-xl scale-[1.02]' : 'bg-white border-pink-50 text-gray-700'
                  }`}
                >
                  <span className="text-[12px] font-black uppercase tracking-widest">{cat}</span>
                  {abierto === cat ? <ChevronUp size={20} className="text-pink-400" /> : <ChevronDown size={20} className="text-gray-300" />}
                </button>

                {abierto === cat && (
                  <div className="space-y-3 pt-2 animate-fadeIn px-2">
                    {serviciosAgrupados[cat].map((s) => (
                      <div key={s.id} className="bg-white p-5 rounded-[35px] border border-pink-50 flex items-center justify-between shadow-sm active:scale-95 transition-transform">
                        <div className="flex-1">
                          <p className="text-[12px] font-black uppercase text-gray-700 leading-tight">{s.nombre}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] font-bold text-[#ec4899] bg-pink-50 px-3 py-1 rounded-full flex items-center gap-1">
                              <Clock size={10} /> {s.tiempo}
                            </span>
                            <span className="text-[11px] font-black text-gray-800">{s.precio}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate('/reservar', { state: { servicio: s } })}
                          className="bg-pink-50 text-[#ec4899] p-4 rounded-full"
                        >
                          <Calendar size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
