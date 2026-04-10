import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Sparkles, Star, Calendar } from 'lucide-react';

export default function ServicesPage() {
  const navigate = useNavigate();

  const servicios = [
    { id: 1, nombre: 'Lifting de Pestañas', precio: '$45', tiempo: '45 min', icon: '✨' },
    { id: 2, nombre: 'Diseño de Cejas', precio: '$25', tiempo: '30 min', icon: '🖋️' },
    { id: 3, nombre: 'Limpieza Facial', precio: '$60', tiempo: '60 min', icon: '🧖‍♀️' },
  ];

  return (
    <div className="min-h-screen bg-[#fffafa] pb-20 font-sans">
      {/* Header */}
      <nav className="bg-white p-6 flex items-center gap-4 sticky top-0 z-50 border-b border-pink-50">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[14px] font-black uppercase tracking-widest text-gray-700">Reservar Cita</h1>
      </nav>

      <main className="p-6 space-y-6">
        <div className="bg-[#ec4899] p-8 rounded-[40px] text-white shadow-lg shadow-pink-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Bienvenida a</p>
            <h2 className="text-[20px] font-black uppercase leading-tight mt-1">Tu momento <br/> de brillar</h2>
          </div>
          <Sparkles className="absolute right-[-10px] bottom-[-10px] opacity-20" size={120} />
        </div>

        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Nuestros Servicios</h3>

        <div className="space-y-4">
          {servicios.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-[30px] border-2 border-pink-50 flex items-center justify-between group active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-[12px] font-black uppercase text-gray-700">{s.nombre}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#ec4899]">
                      <Clock size={12} /> {s.tiempo}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-700">{s.precio}</span>
                  </div>
                </div>
              </div>
              <button className="bg-pink-50 p-3 rounded-full text-[#ec4899]">
                <Calendar size={18} />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Botón flotante de ayuda */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-gray-800 text-white p-4 rounded-full shadow-xl">
          <Star size={20} />
        </button>
      </div>
    </div>
  );
}
