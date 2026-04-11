import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { supabase } from '../supabase'; // Importación limpia

export default function ServicesPage() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState('Pestañas');
  const [serviciosAgrupados, setServiciosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);

  // CARGAR SERVICIOS REALES
  useEffect(() => {
    async function getServicios() {
      const { data, error } = await supabase.from('servicios').select('*');
      if (data) {
        // Agrupamos por categoría para que el diseño no se rompa
        const grouped = data.reduce((acc, s) => {
          acc[s.categoria] = acc[s.categoria] || [];
          acc[s.categoria].push(s);
          return acc;
        }, {});
        setServiciosAgrupados(grouped);
      }
      setLoading(false);
    }
    getServicios();
  }, []);

  const handlePresupuestoColor = () => {
    const tlf = "584121663968";
    const mensaje = "Hola Martha Cute Studio! ✨ Me gustaría pedir un presupuesto para color.";
    window.open(`https://wa.me/${tlf}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const handleAgendarInterno = (servicio) => {
    // Sin alertas locas, directo a reservar
    navigate('/reservar', { state: { servicioSeleccionado: servicio } });
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 font-sans text-gray-800">
      <nav className="bg-white p-6 flex items-center sticky top-0 z-50 border-b border-pink-50 rounded-b-[30px] shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[12px] font-black uppercase tracking-[0.2em] text-center flex-1 mr-8">Nuestros Servicios</h1>
      </nav>

      <main className="p-6 space-y-4">
        <div className="bg-[#ec4899] p-10 rounded-[40px] text-white shadow-lg relative overflow-hidden mb-8">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Bienvenida</p>
            <h2 className="text-[24px] font-black uppercase leading-tight mt-1">Tu momento <br/> de brillar</h2>
          </div>
          <Sparkles className="absolute right-[-20px] bottom-[-20px] opacity-15" size={160} />
        </div>

        {loading ? (
          <p className="text-center text-[10px] font-black uppercase text-pink-300">Actualizando vitrina...</p>
        ) : (
          Object.keys(serviciosAgrupados).map((cat) => (
            <div key={cat} className="space-y-2">
              <button 
                onClick={() => setAbierto(abierto === cat ? null : cat)}
                className={`w-full flex items-center justify-between p-6 rounded-[30px] transition-all border-2 ${
                  abierto === cat ? 'bg-gray-800 text-white shadow-xl' : 'bg-white border-pink-50 text-gray-700'
                }`}
              >
                <span className="text-[12px] font-black uppercase tracking-widest">{cat}</span>
                {abierto === cat ? <ChevronUp size={20} className="text-pink-400" /> : <ChevronDown size={20} className="text-gray-300" />}
              </button>

              {abierto === cat && (
                <div className="space-y-3 pt-2 animate-fadeIn">
                  {serviciosAgrupados[cat].map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-[35px] border border-pink-50 flex items-center justify-between shadow-sm active:scale-[0.98]">
                      <div className="flex-1">
                        <p className="text-[12px] font-black uppercase text-gray-700">{s.nombre}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[9px] font-bold text-[#ec4899] bg-pink-50 px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock size={10} /> {s.tiempo}
                          </span>
                          <span className="text-[11px] font-black text-gray-800">{s.precio}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAgendarInterno(s)}
                        className="bg-pink-50 text-[#ec4899] p-4 rounded-full active:scale-90"
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
      </main>
    </div>
  );
}
