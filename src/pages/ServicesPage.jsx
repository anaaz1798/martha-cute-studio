import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(null);
  const [serviciosAgrupados, setServiciosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [scrollDir, setScrollDir] = useState(0);

  // LÓGICA DE RETRACCIÓN DEL BANNER
  useEffect(() => {
    const handleScroll = () => {
      setScrollDir(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CONEXIÓN REAL CON TU SUPABASE
  useEffect(() => {
    async function getServicios() {
      // 1. Usamos 'services' (nombre real en tu foto)
      const { data, error } = await supabase.from('services').select('*');
      
      if (error) {
        console.error("Error de conexión:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const grouped = data.reduce((acc, s) => {
          // 2. Usamos la columna 'category' (asegúrate de crearla en Supabase)
          // Si no existe aún, agrupará todo en 'General'
          const cat = s.category ? s.category.trim() : 'General';
          acc[cat] = acc[cat] || [];
          
          // 3. Mapeamos tus nombres reales de columnas: name, price, duration_minutes
          acc[cat].push({
            id: s.id,
            nombre: s.name,
            precio: s.price ? `$${s.price}` : 'Consultar',
            tiempo: s.duration_minutes ? `${s.duration_minutes} min` : 'Varía',
            is_whatsapp: s.is_whatsapp_only
          });
          return acc;
        }, {});

        setServiciosAgrupados(grouped);
        // Abrimos la primera categoría automáticamente
        setAbierto(Object.keys(grouped)[0]);
      }
      setLoading(false);
    }
    getServicios();
  }, []);

  const handlePresupuestoColor = () => {
    window.open(`https://wa.link/nkdmm8`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 font-sans text-gray-800">
      {/* NAVBAR FIJO */}
      <nav className="bg-white/90 backdrop-blur-md p-6 flex items-center sticky top-0 z-[60] border-b border-pink-50 rounded-b-[30px]">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[12px] font-black uppercase tracking-[0.2em] text-center flex-1 mr-8 text-gray-900">Nuestros Servicios</h1>
      </nav>

      <main className="p-6">
        
        {/* EL BANNER HERMOSO QUE SE RETRAE */}
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

        {/* LISTADO DE SERVICIOS DINÁMICO */}
        <div className="space-y-4 relative z-50">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-[10px] font-black uppercase text-pink-300 tracking-widest">Actualizando vitrina...</p>
            </div>
          ) : Object.keys(serviciosAgrupados).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-pink-100">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">No hay servicios disponibles</p>
            </div>
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
                          className="bg-pink-50 text-[#ec4899] p-4 rounded-full active:scale-90"
                        >
                          <Calendar size={18} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Botón de Presupuesto de Color (Si la categoría es Cabello) */}
                    {cat.toLowerCase().includes('cabello') && (
                      <button 
                        onClick={handlePresupuestoColor}
                        className="w-full bg-green-50 border-2 border-dashed border-green-200 p-6 rounded-[35px] flex items-center justify-center gap-3 mt-2 active:scale-95"
                      >
                        <MessageCircle size={18} className="text-green-500" />
                        <p className="text-[11px] font-black uppercase text-green-700 text-left">
                          Solicitar Presupuesto de Color <br/>
                          <span className="text-[9px] opacity-70">Vía WhatsApp ✨</span>
                        </p>
                      </button>
                    )}
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
