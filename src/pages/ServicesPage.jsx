import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ChevronDown, ChevronUp, Scissors, Sparkles, Star } from 'lucide-react';

export default function ServicesPage() {
  const [openCategory, setOpenCategory] = useState(null);

  const categorias = [
    {
      id: 'pestanas',
      nombre: 'Pestañas & Cejas',
      icono: <Sparkles className="w-5 h-5" />,
      servicios: [
        { nombre: 'Lifting de Pestañas', precio: '35.00' },
        { nombre: 'Diseño de Cejas + Henna', precio: '20.00' },
        { nombre: 'Extensiones Punto a Punto', precio: '45.00' }
      ]
    },
    {
      id: 'cabello',
      nombre: 'Cuidado Capilar',
      icono: <Scissors className="w-5 h-5" />,
      servicios: [
        { nombre: 'Hidratación Profunda', precio: '25.00' },
        { nombre: 'Corte de Puntas', precio: '15.00' },
        { nombre: 'Secado + Planchado', precio: '20.00' }
      ]
    },
    {
      id: 'unas',
      nombre: 'Manicura & Pedicura',
      icono: <Star className="w-5 h-5" />,
      servicios: [
        { nombre: 'Semiesmaltado', precio: '18.00' },
        { nombre: 'Uñas Acrílicas', precio: '40.00' },
        { nombre: 'Pedicura Spa', precio: '30.00' }
      ]
    }
  ];

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      {/* Header idéntico al de Vitrina */}
      <nav className="bg-[#ec4899] text-white p-8 text-center sticky top-0 z-50 rounded-b-[40px] shadow-md">
        <span className="font-black uppercase text-[12px] tracking-[0.4em]">Servicios</span>
      </nav>

      <main className="max-w-md mx-auto p-8 pt-12 space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-6">¿Qué nos haremos hoy?</p>

        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[40px] shadow-sm border-2 border-[#fbcfe8] overflow-hidden transition-all duration-300">
            {/* Botón de la Categoría - Súper espacioso */}
            <button 
              onClick={() => toggleCategory(cat.id)}
              className="w-full p-10 flex items-center justify-between active:bg-pink-50/20 transition-colors"
            >
              <div className="flex items-center gap-5 text-[#ec4899]">
                {cat.icono}
                <span className="font-black uppercase text-[13px] tracking-widest">{cat.nombre}</span>
              </div>
              {openCategory === cat.id ? 
                <ChevronUp className="text-gray-300 w-6 h-6" /> : 
                <ChevronDown className="text-gray-300 w-6 h-6" />
              }
            </button>

            {/* Subcategorías Desplegables */}
            {openCategory === cat.id && (
              <div className="px-10 pb-10 space-y-6 animate-fadeIn">
                <div className="h-[1px] bg-pink-50 w-full mb-4" />
                {cat.servicios.map((s, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#fffafa] p-6 rounded-[25px] border border-pink-50/50">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase text-gray-700 tracking-tight">{s.nombre}</span>
                      <span className="text-[14px] font-black text-[#ec4899] mt-1">${s.precio}</span>
                    </div>
                    <button className="bg-[#ec4899] text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md shadow-pink-100 active:scale-95 transition-all">
                      Agendar
                    </button>
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
