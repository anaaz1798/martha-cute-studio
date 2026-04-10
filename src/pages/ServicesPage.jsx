import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronDown, ChevronUp, Scissors, Sparkles, Star } from 'lucide-react';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);

  const categorias = [
    {
      id: 'pestanas',
      nombre: 'Pestañas & Cejas',
      icono: <Sparkles className="w-5 h-5" />,
      servicios: [
        { nombre: 'Lifting de Pestañas', precio: '35.00', tipo: 'fijo' },
        { nombre: 'Diseño de Cejas + Henna', precio: '20.00', tipo: 'fijo' }
      ]
    },
    {
      id: 'cabello',
      nombre: 'Cuidado Capilar',
      icono: <Scissors className="w-5 h-5" />,
      servicios: [
        { nombre: 'Color Global / Balayage', precio: 'Variable', tipo: 'presupuesto' },
        { nombre: 'Hidratación Profunda', precio: '25.00', tipo: 'fijo' },
        { nombre: 'Corte de Puntas', precio: '15.00', tipo: 'fijo' }
      ]
    },
    {
      id: 'unas',
      nombre: 'Manicura & Pedicura',
      icono: <Star className="w-5 h-5" />,
      servicios: [
        { nombre: 'Semiesmaltado', precio: '18.00', tipo: 'fijo' },
        { nombre: 'Pedicura Spa', precio: '30.00', tipo: 'fijo' }
      ]
    }
  ];

  const handlePresupuesto = (servicio) => {
    const mensaje = `Hola! Me gustaría pedir un presupuesto para: ${servicio}`;
    window.open(`https://wa.me/584121663968?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      <nav className="bg-[#ec4899] text-white p-8 text-center sticky top-0 z-50 rounded-b-[40px] shadow-md">
        <span className="font-black uppercase text-[12px] tracking-[0.4em]">Servicios</span>
      </nav>

      <main className="max-w-md mx-auto p-8 pt-12 space-y-8">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[40px] shadow-sm border-2 border-[#fbcfe8] overflow-hidden">
            <button 
              onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              className="w-full p-10 flex items-center justify-between active:bg-pink-50/20"
            >
              <div className="flex items-center gap-5 text-[#ec4899]">
                {cat.icono}
                <span className="font-black uppercase text-[13px] tracking-widest">{cat.nombre}</span>
              </div>
              {openCategory === cat.id ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
            </button>

            {openCategory === cat.id && (
              <div className="px-10 pb-10 space-y-6 animate-fadeIn">
                <div className="h-[1px] bg-pink-50 w-full mb-4" />
                {cat.servicios.map((s, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#fffafa] p-6 rounded-[25px] border border-pink-50/50">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase text-gray-700">{s.nombre}</span>
                      <span className="text-[14px] font-black text-[#ec4899] mt-1">
                        {s.tipo === 'presupuesto' ? 'Por evaluar' : `$${s.precio}`}
                      </span>
                    </div>
                    
                    {s.tipo === 'presupuesto' ? (
                      <button 
                        onClick={() => handlePresupuesto(s.nombre)}
                        className="bg-gray-800 text-white px-5 py-3 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"
                      >
                        Presupuesto
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/reservar')}
                        className="bg-[#ec4899] text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 active:scale-95 transition-all"
                      >
                        Agendar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
      <Navbar />
    </div>
  );
}
