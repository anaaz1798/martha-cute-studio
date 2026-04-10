import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogIn, UserPlus, Hash } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('none'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    else navigate('/servicios');
    setLoading(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      if (data.user.email === 'marthacutestudio@gmail.com') {
        navigate('/admin');
      } else {
        alert("Acceso denegado");
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 px-6 font-sans">
      <main className="max-w-md mx-auto pt-10 space-y-6">
        
        {/* CABEZAL */}
        <section className="bg-white rounded-[40px] p-10 text-center shadow-sm border-2 border-[#fbcfe8]">
          <button onClick={() => navigate('/servicios')} className="bg-[#ec4899] text-white px-10 py-4 rounded-full flex items-center gap-2 mx-auto mb-6 active:scale-95 transition-all">
            <Calendar size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Agendar Cita</span>
          </button>
          <h1 className="text-[14px] font-black uppercase tracking-[0.3em] text-gray-700">Martha Cute Studio</h1>
        </section>

        {/* BOTÓN VITRINA (Para que no se pierda) */}
        <button onClick={() => navigate('/vitrina')} className="w-full bg-white p-6 rounded-[30px] border-2 border-[#fbcfe8] text-[#ec4899] font-black uppercase text-[10px] tracking-widest shadow-sm">
          Ver Vitrina
        </button>

        {/* BOTÓN EVENTOS */}
        <button onClick={() => navigate('/eventos')} className="w-full bg-white p-6 rounded-[30px] border-2 border-[#fbcfe8] text-[#ec4899] font-black uppercase text-[10px] tracking-widest shadow-sm">
          Eventos Especiales
        </button>

        {/* LOGIN CLIENTA */}
        <div className="bg-white rounded-[40px] border-2 border-[#fbcfe8] overflow-hidden">
          <button onClick={() => setView(view === 'login' ? 'none' : 'login')} className="w-full p-8 flex items-center justify-center gap-3 text-[#ec4899]">
            <LogIn size={22} /><span className="text-[11px] font-black uppercase tracking-[0.2em]">Ya tengo cuenta</span>
          </button>
          {view === 'login' && (
            <form onSubmit={handleLogin} className="px-10 pb-10 space-y-4">
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100 outline-none" type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} required />
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100 outline-none" type="password" placeholder="Clave" onChange={(e) => setPassword(e.target.value)} required />
              <button disabled={loading} className="w-full bg-[#ec4899] text-white font-black py-5 rounded-full text-[11px] uppercase tracking-[0.2em]">{loading ? 'Entrando...' : 'Entrar'}</button>
            </form>
          )}
        </div>

        {/* ACCESO STAFF */}
        <div className="text-center pt-4">
          <button onClick={() => setView(view === 'staff' ? 'none' : 'staff')} className="text-[9px] font-black uppercase tracking-widest text-gray-300">Acceso Team Cute</button>
          {view === 'staff' && (
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 bg-white p-8 rounded-[40px] border border-gray-100">
              <input className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[11px] outline-none" type="email" placeholder="marthacutestudio@gmail.com" onChange={(e) => setEmail(e.target.value)} required />
              <input className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[11px] outline-none" type="password" placeholder="Clave de Admin" onChange={(e) => setPassword(e.target.value)} required />
              <button disabled={loading} className="w-full bg-gray-800 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                {loading ? 'Verificando...' : 'Entrar al Panel'}
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}
