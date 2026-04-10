import Navbar from '../components/Navbar';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#fdfafb] pb-24 font-sans text-gray-800">
      <nav className="bg-[#f472b6] text-white p-4 text-center sticky top-0 z-50">
        <span className="font-black uppercase text-[10px] tracking-[0.3em]">Próximos Eventos</span>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <p className="cute-title">No te lo pierdas</p>
        <div className="cute-card border-l-4 border-l-[#f472b6]">
          <h3 className="font-black text-[11px] uppercase text-gray-800">Workshop de Automaquillaje</h3>
          <p className="text-[9px] font-bold mt-1 uppercase text-[#f472b6]">Sábado 15 de Mayo - 10:00 AM</p>
          <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">
            Aprende a resaltar tu belleza con técnicas profesionales de nuestro equipo Team Cute.
          </p>
          <button className="mt-5 bg-[#f472b6] text-white px-6 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-100">
            Más información
          </button>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
