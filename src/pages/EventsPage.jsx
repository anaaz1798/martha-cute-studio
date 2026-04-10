import Navbar from '../components/Navbar';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-cute pb-24 font-sans text-gray-800">
      <nav className="bg-[#d81b60] text-white p-4 text-center sticky top-0 z-50">
        <span className="font-black uppercase text-[10px] tracking-[0.3em]">Próximos Eventos</span>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-6">No te lo pierdas</p>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-pink-50/50 border-l-4 border-l-[#d81b60]">
          <h3 className="font-black text-[11px] uppercase text-gray-800 leading-tight">Workshop de Automaquillaje</h3>
          <p className="text-[9px] font-bold mt-1 uppercase text-[#d81b60]">Sábado 15 de Mayo - 10:00 AM</p>
          <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">Aprende a resaltar tu belleza con técnicas profesionales de nuestro Team Cute.</p>
          <button className="mt-5 bg-[#d81b60] text-white px-6 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-100 active:scale-95">
            Más información
          </button>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
