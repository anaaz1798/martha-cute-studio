import Navbar from '../components/Navbar';

export default function VitrinaPage() {
  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 px-4 font-sans text-gray-800">
      {/* Header con el rosa del botón de agendar */}
      <nav className="bg-[#ec4899] text-white p-4 text-center sticky top-0 z-50 rounded-b-[30px] shadow-md">
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Nuestra Vitrina</span>
      </nav>

      <main className="max-w-md mx-auto pt-6 space-y-4">
        <div className="cute-card">
          <div className="p-5 flex flex-col items-center">
            <div className="w-24 h-24 bg-pink-50 rounded-full mb-4"></div>
            <h3 className="text-[#f472b6] text-[11px] font-black uppercase tracking-widest">Aceite de Argán</h3>
            <p className="text-gray-400 text-[10px] font-bold mt-1">$25.00</p>
            {/* Botón igualito al de Agendar Cita */}
            <button className="mt-4 bg-[#ec4899] text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 active:scale-95">
              Lo quiero
            </button>
          </div>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
