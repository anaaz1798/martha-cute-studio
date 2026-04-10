import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, LogIn, UserPlus, Hash } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('none'); 

  // Esto es solo para que los botones "funcionen" visualmente por ahora
  const handleSimpleNavigation = (e) => {
    e.preventDefault();
    navigate('/servicios');
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 px-6 font-sans text-gray-800">
      <main className="max-w-md mx-auto pt-10 space-y-6">
        
        {/* CABEZAL ROSADO */}
        <section className="bg-white rounded-[40px] p-10 text-center shadow-sm border-2 border-[#fbcfe8]">
          <button 
            onClick={() => navigate('/servicios')}
            className="bg-[#ec4899] text-white px-10 py-4 rounded-full flex items-center gap-2 mx-auto mb-6 shadow-lg shadow-pink-100 active:scale-95"
          >
            <Calendar size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Agendar Cita</span>
          </button>
          <h1 className="text-[14px] font-black uppercase tracking-[0.3em] text-gray-700 text-center">Martha Cute Studio</h1>
        </section>

        {/* LOGIN CLIENTA */}
        <div className="bg-white rounded-[40px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => setView(view === 'login' ? 'none' : 'login')}
            className="w-full p-8 flex items-center justify-center gap-3 text-[#ec4899]"
          >
            <LogIn size={22} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ya tengo cuenta</span>
          </button>
          
          {view === 'login' && (
            <form onSubmit={handleSimpleNavigation} className="px-10 pb-10 space-y-4">
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100 outline-none" type="email" placeholder="Correo" required />
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100 outline-none" type="password" placeholder="Clave" required />
              <button className="w-full bg-[#ec4899] text-white font-black py-5 rounded-full text-[11px] uppercase tracking-[0.2em]">Entrar</button>
            </form>
          )}
        </div>

        {/* REGISTRO CLIENTA */}
        <div className="bg-white rounded-[40px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => setView(view === 'register' ? 'none' : 'register')}
            className="w-full p-8 flex items-center justify-center gap-3 text-[#ec4899]"
          >
            <UserPlus size={22} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Registrarme</span>
          </button>
          {view === 'register' && (
            <form onSubmit={handleSimpleNavigation} className="px-10 pb-10 space-y-4">
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100" placeholder="Nombre completo" required />
              <button className="w-full bg-[#ec4899] text-white font-black py-5 rounded-full text-[11px] uppercase tracking-[0.2em]">Crear Cuenta</button>
            </form>
          )}
        </div>

        {/* ACCESO STAFF */}
        <div className="text-center pt-4">
          <button 
            onClick={() => setView(view === 'staff' ? 'none' : 'staff')}
            className="text-[9px] font-black uppercase tracking-widest text-gray-300"
          >
            Acceso Team Cute
          </button>
          {view === 'staff' && (
            <form onSubmit={() => navigate('/admin')} className="mt-6 space-y-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-inner">
              <input className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[11px] outline-none" type="password" placeholder="Código de Acceso" />
              <button className="w-full bg-gray-800 text-white py-4 rounded-full text-[10px] font-black uppercase">Entrar al Panel</button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}
