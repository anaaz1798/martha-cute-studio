import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Clock, ChevronRight, User, Scissors, Wand2, Star, Sparkle } from 'lucide-react';

export default function BookingPage() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        // Traemos todos los servicios sin filtros que den error
        const { data: s } = await supabase.from('services').select('*');
        setServicios(s || []);

        // Verificamos si hay sesión de usuario
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          setPerfil(p);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // Mapeo de Iconos Vectoriales (Ajustado a tus categorías en Supabase)
  const iconMap = { 
    'CABELLO': Scissors, 
    'CEJAS': Sparkle,       
    'PESTAÑAS': Wand2, 
    'UÑAS': Star,      
    'DEFAULT': Sparkles     
  };

  // Agrupar servicios por categoría (convirtiendo a MAYÚSCULAS para evitar fallos)
  const agrupados = servicios.reduce((acc, s) => {
    const cat = s.category ? s.category.toUpperCase() : 'OTROS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-bold text-[#d81b60] bg-[#fff5f7]">
      Cargando Martha Cute... ✨
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fff5f7] pb-10 font-sans">
      {/* Header Estilo Premium */}
      <header className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-50 border-b border-pink-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#d81b60] p-2.5 rounded-2xl rotate-6 shadow-md shadow-pink-100">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-2xl text-gray-900 tracking-tighter uppercase">Martha Cute</span>
        </div>
        {!perfil && (
          <Link to="/login" className="text-[#d81b60] text-xs font-bold bg-pink-50 px-5 py-3 rounded-full uppercase hover:bg-pink-100 transition-all flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Entrar
          </Link>
        )}
      </header>

      <main className="max-w-xl mx-auto p-6 space-y-12">
        {/* Título de bienvenida */}
        <div className="mt-6 text-center">
          <h2 className="text-4xl font-black text-gray-950 leading-none tracking-tighter">
            Nuestros <span className="text-[#d81b60]">Servicios</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 font-medium tracking-tight">Estilo y elegancia en cada detalle.</p>
        </div>

        {/* Renderizado por Categorías */}
        {Object.keys(agrupados).map(cat => {
          const IconoCategoria = iconMap[cat] || iconMap['DEFAULT'];

          return (
            <div key={cat} className="space-y-6">
              {/* Título de Categoría con Icono Vectorial */}
              <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-[#d81b60]">
                  <IconoCategoria className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">
                  {cat}
                </h3>
              </div>
              
              {/* Grid de Servicios en Tarjetas */}
              <div className="grid gap-4">
                {agrupados[cat].map(s => (
                  <div 
                    key={s.id}
                    onClick={() => navigate(`/reservar?servicio=${s.id}`)}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-transparent hover:border-[#ff85a1]/40 hover:shadow-xl hover:shadow-pink-100/30 transition-all duration-300 flex justify-between items-center group cursor-pointer active:scale-95"
                  >
                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#d81b60] transition-colors">
                        {s.name}
                      </h4>
                      <div className="flex items-center gap-2.5 text-gray-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" /> 
                        <span>{s.duration_minutes || '--'} min</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        {/* Lógica de Precio vs Presupuesto Verde WhatsApp */}
                        {s.price && s.price > 0 ? (
                          <span className="font-black text-3xl text-gray-950 group-hover:text-[#d81b60] transition-colors">
                            ${s.price}
                          </span>
                        ) : (
                          <span className="bg-[#2ecc71] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.1em] shadow-sm shadow-green-100">
                            Presupuesto
                          </span>
                        )}
                      </div>
                      <div className="bg-pink-50/50 p-2.5 rounded-2xl group-hover:bg-[#d81b60] transition-all">
                        <ChevronRight className="w-6 h-6 text-[#d81b60] group-hover:text-white stroke-[3]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {servicios.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">Aún no hay servicios disponibles... 🌸</p>
          </div>
        )}
      </main>
    </div>
  );
}
