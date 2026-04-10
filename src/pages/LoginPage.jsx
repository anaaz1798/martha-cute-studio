import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, LogIn, UserPlus, Hash } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  
  // Control de vistas
  const [view, setView] = useState('none'); // 'login', 'register', 'staff', 'none'
  
  // Estados de inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  // Funciones de Autenticación
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
    if (email !== 'marthacutestudio@gmail.com') {
      alert("Acceso solo para Martha");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    else navigate('/admin');
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: nombre } }
    });
    if (error) alert("Error: " + error.message);
    else alert("¡Cuenta creada! Ya puedes entrar.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 px-6 font-sans text-gray-800">
      <main className="max-w-md mx-auto pt-10 space-y-6">
        
        {/* CABEZAL ROSADO */}
        <section className="bg-white rounded-[40px] p-10 text-center shadow-sm border-2 border-[#fbcfe8] relative">
          <button 
            onClick={() => navigate('/servicios')}
            className="bg-[#ec4899] text-white px-10 py-4 rounded-full flex items-center gap-2 mx-auto mb-6 shadow-lg shadow-pink-100 active:scale-95 transition-all"
          >
            <Calendar size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Agendar Cita</span>
          </button>
          <h1 className="text-[14px] font-black uppercase tracking-[0.3em] text-gray-700">Martha Cute Studio</h1>
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
            <form onSubmit={handleLogin} className="px-10 pb-10 space-y-4 animate-fadeIn">
              <input 
                className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] outline-none border border-pink-100 focus:border-[#ec4899]" 
                type="email" placeholder="Tu correo" onChange={(e) => setEmail(e.target.value)} required 
              />
              <input 
                className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] outline-none border border-pink-100 focus:border-[#ec4899]" 
                type="password" placeholder="Tu clave" onChange={(e) => setPassword(e.target.value)} required 
              />
              <button disabled={loading} className="w-full bg-[#ec4899] text-white font-black py-5 rounded-full text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 disabled:opacity-50">
                {loading ? 'Cargando...' : 'Entrar'}
              </button>
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
            <form onSubmit={handleRegister} className="px-10 pb-10 space-y-4 animate-fadeIn">
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100" placeholder="Nombre completo" onChange={(e) => setNombre(e.target.value)} required />
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
              <input className="w-full px-6 py-4 bg-pink-50/30 rounded-[20px] text-[12px] border border-pink-100" type="password" placeholder="Clave" onChange={(e) => setPassword(e.target.value)} required />
              <button disabled={loading} className="w-full bg-[#ec4899] text-white font-black py-5 rounded-full text-[11px] uppercase tracking-[0.2em]">
                {loading ? 'Creando...' : 'Crear Cuenta'}
              </button>
            </form>
          )}
        </div>

        {/* ACCESO STAFF (DISCRETO) */}
        <div className="text-center pt-4">
          <button 
            onClick={() => setView(view === 'staff' ? 'none' : 'staff')}
            className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-[#ec4899] transition-colors"
          >
            Acceso Team Cute
          </button>
          {view === 'staff' && (
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-inner animate-fadeIn">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Panel de Administración</p>
              <input 
                className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[11px] outline-none" 
                type="email" placeholder="Email Martha" onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                className="w-full px-6 py-4 bg-gray-50 rounded-[20px] text-[11px] outline-none" 
                type="password" placeholder="Clave Staff" onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full bg-gray-800 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest">
                Entrar al Panel
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
