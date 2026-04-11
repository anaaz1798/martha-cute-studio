import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(null);
  const [serviciosAgrupados, setServiciosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getServicios() {
      const { data, error } = await supabase.from('services').select('*');
      if (data) {
        const grouped = data.reduce((acc, s) => {
          const cat = s.category || 'General';
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
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white p-6 flex items-center sticky top-0 z-[100] border-b border-pink-50 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[12px] font-black uppercase tracking-[0.2em] text-center flex-1 mr-8">Martha Cute Studio</h1>
      </nav>

      <main className="p-6 space-y-6">
        {/* BANNER PRINCIPAL */}
        <div className="bg-[#ec4899] rounded-[40px] text-white shadow-lg relative overflow-hidden flex items-center p-10 min-h-[160px]">
          <div className="relative z-10">
            <h2 className="text-[40px] font-black uppercase leading-none tracking-tighter text-white">
              Servicios
            </h2>
          </div>
          <Sparkles className="absolute right-[-20px] bottom-[-20px] opacity-20" size={160} />
        </div>

        {/* LISTADO DE SERVICIOS */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-10 text-[10px] font-black uppercase text-pink-300 tracking-widest">Cargando...</p>
          ) : (
            Object.keys(serviciosAgrupados).map((cat) => (
              <div key={cat} className="space-y-2">
                <button 
                  onClick={() => setAbierto(abierto === cat ? null : cat)}
                  className={`w-full flex items-center justify-between p-6 rounded-[30px] border-2 transition-all ${
                    abierto === cat ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white border-pink-50 text-gray-700'
                  }`}
                >
                  <span className="text-[11px] font-black uppercase tracking-widest">{cat}</span>
                  {abierto === cat ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {abierto === cat && (
                  <div className="space-y-3 pt-2">
                    {serviciosAgrupados[cat].map((s) => {
                      const necesitaPresupuesto = s.name.toLowerCase().includes('color');

                      return (
                        <div key={s.id} className="bg-white p-5 rounded-[30px] border border-pink-50 flex items-center justify-between shadow-sm">
                          <div className="flex-1">
                            <p className="text-[11px] font-black uppercase text-gray-700 leading-tight">{s.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                                {s.duration_minutes || '0'} min
                              </span>
                              <span className="text-[11px] font-black">
                                {necesitaPresupuesto ? 'Bajo Presupuesto' : `$${s.price}`}
                              </span>
                            </div>
                          </div>

                          {/* EL BOTÓN ESTÁ INTEGRADO EN LA TARJETA */}
                          {necesitaPresupuesto ? (
                            <button 
                              onClick={() => window.open('https://wa.link/nkdmm8', '_blank')}
                              className="bg-green-500 text-white p-4 rounded-full active:scale-90 shadow-md flex items-center justify-center"
                            >
                              <MessageCircle size={20} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => navigate('/reservar', { state: { servicio: s } })}
                              className="bg-pink-50 text-pink-500 p-4 rounded-full active:scale-90"
                            >
                              <Calendar size={18} />
                            </button>
                          )}
                        </div>
                      );
                    })}
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
