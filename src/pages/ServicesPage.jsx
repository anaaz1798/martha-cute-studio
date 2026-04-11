import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Calendar, MessageCircle, Sparkles } from 'lucide-react';
// Importamos la data que definimos en el Admin
import { DATA_SERVICIOS } from './AdminPage'; 

export default function ServicesPage() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState('Pestañas');

  // EL WHATSAPP SOLO PARA COLOR
  const handlePresupuestoColor = () => {
    const tlf = "584121663968"; // Tu número de Venezuela
    const mensaje = "Hola Martha Cute Studio! ✨ Me gustaría pedir un presupuesto para color de cabello. ¿Me podrías asesorar?";
    window.open(`https://wa.me/${tlf}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  // AGENDAR INTERNO (Para todo lo demás)
  const handleAgendarInterno = (servicio) => {
    console.log("Iniciando flujo interno para:", servicio.nombre);
    // Aquí es donde luego conectaremos el formulario de la base de datos
    alert(`Agendando cita interna para: ${servicio.nombre}`);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 font-sans text-gray-800">
      {/* Header Fijo */}
      <nav className="bg-white p-6 flex items-center sticky top-0 z-50 border-b border-pink-50 rounded-b-[30px] shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[12px] font-black uppercase tracking-[0.2em] text-center flex-1 mr-8">Nuestros Servicios</h1>
      </nav>

      <main className="p-6 space-y-4">
        
        {/* === EL BANNER HERMOSÍSIMO QUE RECUPERAMOS === */}
        <div className="bg-[#ec4899] p-10 rounded-[40px] text-white shadow-lg shadow-pink-100 relative overflow-hidden mb-8">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Bienvenida a</p>
            <h2 className="text-[24px] font-black uppercase leading-tight mt-1">Tu momento <br/> de brillar</h2>
            <p className="text-[10px] mt-4 opacity-70 max-w-[200px]">Elige el servicio perfecto para realzar tu belleza natural.</p>
          </div>
          <Sparkles className="absolute right-[-20px] bottom-[-20px] opacity-15" size={160} />
        </div>
        {/* ============================================= */}

        {Object.keys(DATA_SERVICIOS).map((cat) => (
          <div key={cat} className="space-y-2">
            {/* Banner Desplegable (Categoría) */}
            <button 
              onClick={() => setAbierto(abierto === cat ? null : cat)}
              className={`w-full flex items-center justify-between p-6 rounded-[30px] transition-all border-2 ${
                abierto === cat 
                ? 'bg-gray-800 border-gray-800 text-white shadow-xl scale-[1.01]' 
                : 'bg-white border-pink-50 text-gray-700 shadow-sm'
              }`}
            >
              <span className="text-[12px] font-black uppercase tracking-widest">{cat}</span>
              {abierto === cat ? <ChevronUp size={20} className="text-pink-400" /> : <ChevronDown size={20} className="text-gray-300" />}
            </button>

            {/* Lista de Servicios si está abierto */}
            {abierto === cat && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                {DATA_SERVICIOS[cat].map((s) => (
                  <div key={s.id} className="bg-white p-5 rounded-[35px] border border-pink-50 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
                    <div className="flex-1">
                      <p className="text-[12px] font-black uppercase text-gray-700 leading-tight">{s.nombre}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] font-bold text-[#ec4899] bg-pink-50 px-3 py-1 rounded-full flex items-center gap-1">
                          <Clock size={10} /> {s.tiempo}
                        </span>
                        <span className="text-[11px] font-black text-gray-800">{s.precio}</span>
                      </div>
                    </div>
                    
                    {/* Botón de Agenda Interna */}
                    <button 
                      onClick={() => handleAgendarInterno(s)}
                      className="bg-pink-50 text-[#ec4899] p-4 rounded-full active:scale-90 hover:bg-[#ec4899] hover:text-white transition-all shadow-sm"
                    >
                      <Calendar size={18} />
                    </button>
                  </div>
                ))}

                {/* BOTÓN EXCLUSIVO DE WHATSAPP PARA CABELLO */}
                {cat === 'Cabello' && (
                   <button 
                    onClick={handlePresupuestoColor}
                    className="w-full bg-green-50 border-2 border-dashed border-green-200 p-6 rounded-[35px] flex items-center justify-center gap-3 active:scale-95 transition-all group mt-2"
                   >
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-md group-hover:rotate-12 transition-transform">
                      <MessageCircle size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-black uppercase text-green-700">Presupuesto de Color</p>
                      <p className="text-[9px] font-bold text-green-600/60 uppercase">Evaluación por WhatsApp</p>
                    </div>
                   </button>
                )}
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Footer de Asesoría */}
      <div className="px-6 mb-10 mt-10">
        <div className="bg-pink-50 p-8 rounded-[40px] text-center border border-pink-100">
          <p className="text-[10px] font-black uppercase text-[#ec4899] tracking-widest">Martha Cute Studio</p>
          <p className="text-[9px] font-medium text-pink-300 mt-1 uppercase">Realzando tu belleza natural</p>
        </div>
      </div>
    </div>
  );
}
