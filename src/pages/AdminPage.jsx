import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, ShoppingBag, LogOut, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('citas'); // 'citas' o 'config'

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Error al cambiar la clave: " + error.message);
    } else {
      alert("¡Clave actualizada con éxito, Martha!");
      setNewPassword('');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* HEADER */}
      <nav className="bg-gray-800 text-white p-6 flex justify-between items-center sticky top-0 z-50 rounded-b-[30px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Admin Panel</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Team Cute</span>
        </div>
        <button onClick={handleLogout} className="p-3 bg-gray-700 rounded-full active:scale-90 transition-all">
          <LogOut size={18} />
        </button>
      </nav>

      {/* TABS PARA NAVEGAR EL PANEL */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => setTab('citas')}
          className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'citas' ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          Citas
        </button>
        <button 
          onClick={() => setTab('config')}
          className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'config' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          Configuración
        </button>
      </div>

      <main className="max-w-md mx-auto p-6 pt-8">
        
        {tab === 'citas' ? (
          <section className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Gestión de Citas</h2>
            {/* ... Aquí va tu lista de citas que ya teníamos ... */}
            <div className="bg-white rounded-[35px] p-8 text-center border border-gray-100 shadow-sm">
              <Calendar className="mx-auto text-[#ec4899] mb-4" />
              <p className="text-[11px] font-bold text-gray-400 uppercase">No hay citas nuevas hoy</p>
            </div>
          </section>
        ) : (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 flex flex-col items-center">
              <div className="p-4 bg-gray-50 rounded-full mb-6 text-gray-800">
                <Lock size={32} />
              </div>
              <h3 className="font-black text-[14px] uppercase text-gray-800 tracking-widest">Seguridad</h3>
              <p className="text-[10px] text-gray-400 mt-2 text-center uppercase font-bold">Cambia tu contraseña de acceso</p>

              <form onSubmit={handleUpdatePassword} className="w-full mt-8 space-y-4">
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-[25px] text-[12px] outline-none border border-gray-100 focus:border-gray-800 transition-all"
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
                  className="w-full bg-gray-800 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg disabled:opacity-50 active:scale-95 transition-all"
                >
                  {loading ? 'Actualizando...' : 'Guardar Nueva Clave'}
                </button>
              </form>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
