import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('services').select('*');
      setServicios(data || []);
    }
    cargar();
  }, []);

  // Agrupamos servicios para sacar las categorías
  const categoriasUnicas = [...new Set(servicios.map(s => s.category?.toUpperCase() || 'OTROS'))];

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-6 px-4 font-sans">
      <main className="max-w-md mx-auto pt-4 space-y-4">
        
        {/* HEADER COMPACTO */}
        <section className="bg-white rounded-[28px] p-4 text-center shadow-sm border border-pink-50/50">
          <div className="bg-[#d81b60] w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-gray-900 uppercase">Martha Cute Studio</h1>
          <button 
            onClick={() => navigate('/reservar')} 
            className="mt-3 w-full bg-[#d81b60] text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md"
          >
            Reservar Cita
          </button>
        </section>

        {/* BANNERS CON FOTOS CARGADAS */}
        <div className="grid grid-cols-2 gap-3">
          {categoriasUnicas.map(cat => {
            // Buscamos si algún servicio de esta categoría tiene imagen
            const servicioConImagen = servicios.find(s => s.category?.toUpperCase() === cat && s.image_url);
            const bgImage = servicioConImagen?.image_url || 'https://via.placeholder.com/300';

            return (
              <div 
                key={cat} 
                onClick={() => navigate(`/reservar?categoria=${cat}`)}
                className="relative h-32 rounded-[20px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all group"
              >
                {/* Imagen de Fondo */}
                <img src={bgImage} alt={cat} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                
                {/* Capa oscura para que se lea el texto */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                  <h4 className="font-black text-white text-[10px] uppercase tracking-tighter drop-shadow-md">{cat}</h4>
                  <span className="text-[8px] font-bold text-pink-200 uppercase mt-1">Ver menú</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
