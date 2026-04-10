import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Calendar } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="bg-gray-800 text-white p-6 rounded-[30px] flex justify-between items-center shadow-lg">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Panel</p>
          <h1 className="text-[14px] font-black uppercase">Administración Martha</h1>
        </div>
        <button onClick={() => navigate('/')} className="p-3 bg-gray-700 rounded-full">
          <LogOut size={18} />
        </button>
      </nav>

      <main className="mt-10 grid grid-cols-1 gap-6">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 text-center">
          <Calendar className="mx-auto text-[#ec4899] mb-4" size={32} />
          <h2 className="font-black uppercase text-[12px]">Gestión de Citas</h2>
          <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold">Aquí aparecerán las clientas agendadas</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 text-center">
          <Settings className="mx-auto text-gray-800 mb-4" size={32} />
          <h2 className="font-black uppercase text-[12px]">Configuración</h2>
          <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold">Cambiar claves y horarios</p>
        </div>
      </main>
    </div>
  );
}
