import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, ShoppingBag, LogOut, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('citas'); // Controla qué ver: 'citas' o 'config'
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Función para cambiar la clave (lo que pediste)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("¡Clave actualizada con éxito!");
      setNewPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* Navbar de Admin - El color oscuro para que sepa que es la jefa */}
      <nav className="bg-gray-800 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Panel Control</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Team Cute Admin</span>
        </div>
        <button onClick={handleLogout} className="p-3 bg-gray-700 rounded-full active:scale-90 transition-all">
          <LogOut size={18} />
        </button>
      </nav>

      {/* Selector de Pantallas */}
      <div className="flex justify-center gap-4 mt-10 px-6">
        <button 
          onClick={() => setTab('citas')}
          className={`flex-1 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'citas' ? 'bg-[#ec4899] text-white shadow-lg shadow-pink-100' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          Citas
        </button>
        <button 
          onClick={() => setTab('config')}
          className={`flex-1 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'config' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          Configuración
        </button>
      </div>

      <main className="max-w-md mx-auto p-8">
        
        {/* VISTA DE CITAS */}
        {tab === 'citas' && (
          <section className="space-y-6 animate-fadeIn">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Próximas Citas</h2>
            {/* Tarjeta de ejemplo */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-black uppercase text-gray-700">Cita de Ejemplo</p>
                <p className="text-[10px] font-bold text-[#ec4899] mt-1 tracking-tight">Lifting de Pestañas</p>
              </div>
              <div className="bg-green-50 text-green-500 p-3 rounded-full">
                <CheckCircle size={20} />
              </div>
            </div>
          </section>
        )}

        {/* VISTA DE CONFIGURACIÓN (PARA CAMBIAR CLAVE) */}
        {tab === 'config' && (
          <section className="animate-fadeIn">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="p-4 bg-gray-50 rounded-full mb-4 text-gray-800">
                  <Lock size={28} />
                </div>
                <h3 className="font-black text-[14px] uppercase tracking-widest text-gray-800">Seguridad</h3>
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Actualiza tu contraseña de acceso</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"}
                    placeholder="Nueva clave"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[12px] outline-none border border-gray-100 focus:border-gray-800 transition-all"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-4 text-gray-400"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={loading || newPassword.length < 6}
                  className="w-full bg-gray-800 text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg disabled:opacity-50 active:scale-95 transition-all"
                >
                  {loading ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
