import Navbar from '../components/Navbar';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      {/* Header con el rosado del botón de agendar */}
      <nav className="bg-[#ec4899] text-white p-6 text-center sticky top-0 z-50 rounded-b-[40px] shadow-md">
        <span className="font-black uppercase text-[12px] tracking-[0.4em]">Próximos Eventos</span>
      </nav>

      <main className="max-w-md mx-auto p-8 pt-12 space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center">No te lo pierdas</p>
        
        {/* Tarjeta con aire (p-8) y el borde del login */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-[#fbcfe8] relative overflow-hidden">
          {/* Detalle lateral con tu rosado */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#ec4899]"></div>
          
          <h3 className="font-black text-[14px] uppercase text-gray-800 leading-tight">Workshop de Automaquillaje</h3>
          <p className="text-[10px] font-bold mt-2 uppercase text-[#ec4899] tracking-wider">Sábado 15 de Mayo - 10:00 AM</p>
          
          <p className="text-[12px] text-gray-500 mt-6 leading-relaxed">
            Aprende a resaltar tu belleza con técnicas profesionales de nuestro equipo Team Cute.
          </p>
          
          {/* Botón idéntico al de Agendar Cita */}
          <button className="mt-8 w-full bg-[#ec4899] text-white py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-200 active:scale-95 transition-all">
            Más información
          </button>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
