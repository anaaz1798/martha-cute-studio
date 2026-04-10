import Navbar from '../components/Navbar';

export default function VitrinaPage() {
  const productos = [
    { id: 1, name: 'Aceite de Argán', price: 25, img: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Pestañas VIP', price: 15, img: 'https://via.placeholder.com/150' }
  ];

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-24 font-sans">
      <nav className="bg-[#d81b60] text-white p-4 text-center sticky top-0 z-50 shadow-md">
        <span className="font-black uppercase text-[10px] tracking-[0.3em]">Nuestra Vitrina</span>
      </nav>

      <main className="max-w-md mx-auto p-4">
        <p className="cute-title">Productos Disponibles</p>
        <div className="grid grid-cols-2 gap-3">
          {productos.map(p => (
            <div key={p.id} className="cute-card flex flex-col items-center">
              <div className="w-full aspect-square bg-pink-50 rounded-2xl mb-3 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-[9px] uppercase text-gray-700 text-center leading-tight">{p.name}</h3>
              <p className="text-[11px] font-black text-[#d81b60] mt-1">${p.price}</p>
              <button className="mt-3 w-full bg-[#2ecc71] text-white py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">
                Lo quiero
              </button>
            </div>
          ))}
        </div>
      </main>
      <Navbar />
    </div>
  );
}
};
