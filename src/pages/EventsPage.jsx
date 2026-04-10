import Navbar from '../components/Navbar';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      {/* Header idéntico al de la Vitrina */}
      <nav className="bg-[#ec4899] text-white p-8 text-center sticky top-0 z-50 rounded-b-[40px] shadow-md">
        <span className="font-black uppercase text-[12px] tracking-[0.4em]">Próximos Eventos</span>
      </nav>

      <main className="max-w-md mx-auto p-8 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-10">No te lo pierdas</p>
        
        {/* Tarjeta con el mismo estilo de la vitrina */}
        <div className="bg-white rounded-[50px] p-12 shadow-sm border-2 border-[#fbcfe8] flex flex-col items-center">
          
          <h3 className="font-black text-[14px] uppercase text-[#ec4899] text-center leading-tight tracking-widest">
            Workshop de Automaquillaje
          </h3>
          
          <p className="text-[10px] font-bold mt-3 uppercase text-gray-400 tracking-tighter">
            Sábado 15 de Mayo • 10:00 AM
          </p>
          
          <p className="text-[12px] text-gray-500 text-center mt-8 leading-relaxed">
            Aprende a resaltar tu belleza con técnicas profesionales de nuestro equipo Team Cute.
          </p>
          
          {/* Botón igualito al "Lo quiero" de la vitrina */}
          <button className="mt-10 bg-[#ec4899] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-100 active:scale-95 transition-all">
            Más información
          </button>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
