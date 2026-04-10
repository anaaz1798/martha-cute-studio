import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  LogOut, 
  Lock, 
  Settings, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('citas'); // Controla la vista actual
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert("Error: " + error.message);
    else {
      alert("¡Contraseña actualizada!");
      setNewPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* Navbar Superior */}
      <nav className="bg-gray-800 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Team Cute</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Panel de Control</span>
        </div>
        <button onClick={handleLogout} className="p-3 bg-gray-700 rounded-full active:scale-90 transition-all">
          <LogOut size={18} />
        </button>
      </nav>

      {/* Menú de Navegación del Panel */}
      <div className="flex overflow-x-auto gap-4 mt-8 px-6 no-scrollbar">
        {[
          { id: 'citas', label: 'Citas', icon: <Calendar size={14}/> },
          { id: 'clientes', label: 'Clientes', icon: <Users size={14}/> },
          { id: 'servicios', label: 'Servicios', icon: <Sparkles size={14}/> },
          { id: 'config', label: 'Seguridad', icon: <Lock size={14}/> }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              tab === item.id ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <main className="max-w-md mx-auto p-6 mt-4">
        
        {/* VISTA: CITAS */}
        {tab === 'citas' && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Próximas Citas</h2>
            <div className="bg-white rounded-[30px] p-6 border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-pink-50 p-3 rounded-2xl text-[#ec4899]"><Clock size={20}/></div>
                <div>
                  <p className="text-[12px] font-black uppercase">Cita Pendiente</p>
                  <p className="text-[10px] font-bold text-gray-400 tracking-tight">Cargar desde base de datos...</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300"/>
            </div>
          </div>
        )}

        {/* VISTA: CLIENTES */}
        {tab === 'clientes' && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Gestión de Clientes</h2>
            <div className="bg-white rounded-[30px] p-8 text-center border border-gray-100">
              <Users size={32} className="mx-auto text-gray-200 mb-4"/>
              <p className="text-[11px] font-bold text-gray-400 uppercase">Aquí podrás ver y editar tu lista de clientes</p>
            </div>
          </div>
        )}

        {/* VISTA: SERVICIOS */}
        {tab === 'servicios' && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Tus Servicios</h2>
            <button className="w-full py-4 bg-gray-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">+ Agregar Nuevo Servicio</button>
          </div>
        )}

        {/* VISTA: SEGURIDAD / CONTRASEÑA */}
        {tab === 'config' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 text-center">
              <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto mb-4 text-gray-800"><Lock size={24} /></div>
              <h3 className="font-black text-[14px] uppercase tracking-widest">Seguridad</h3>
              <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase mb-8">Cambia tu clave de acceso</p>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
                <input 
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[12px] outline-none border border-gray-100 focus:border-gray-800"
                />
                <button 
                  type="submit"
                  disabled={loading || newPassword.length < 6}
                  className="w-full bg-gray-800 text-white py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Actualizar Clave'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
