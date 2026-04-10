import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, LogIn, UserPlus, Download, X, Hash } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FUNCIÓN PARA LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      navigate('/servicios'); // Pa' dentro si todo está bien
    }
    setLoading(false);
  };

  // --- FUNCIÓN PARA REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Registra el usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nombre } // Guarda el nombre en los metadatos
      }
    });

    if (authError) {
      alert("Error al registrar: " + authError.message);
    } else {
      alert("¡Cuenta creada! Revisa tu correo o intenta entrar.");
      setShowRegister(false);
      setShowLogin(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 px-4 font-sans text-gray-800">
      <main className="max-w-md mx-auto pt-4 space-y-4">
        
        {/* CABEZAL */}
        <section className="bg-white rounded-[40px] p-8 text-center relative overflow-hidden shadow-sm border border-pink-50">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <Heart className="w-48 h-48 text-[#ec4899]" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <button 
              onClick={() => navigate('/servicios')}
              className="bg-[#ec4899] text-white px-10 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-pink-100 mb-6 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Agendar Cita</span>
            </button>
            <h1 className="text-xl font-black uppercase tracking-tighter mb-1 text-gray-700 text-center">Martha Cute Studio</h1>
          </div>
        </section>

        {/* LOGIN CLIENTA */}
        <div className="bg-white rounded-[32px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowLogin(!showLogin); setShowRegister(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-[#ec4899]"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest text-center">Ya tengo cuenta</span>
          </button>
          
          {showLogin && (
            <form onSubmit={handleLogin} className="px-6 pb-6 space-y-3">
              <input 
                className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" 
                type="email" 
                placeholder="Correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" 
                type="password" 
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#ec4899] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-md disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}
        </div>

        {/* REGISTRO CLIENTA */}
        <div className="bg-white rounded-[32px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowRegister(!showRegister); setShowLogin(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-[#ec4899]"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest text-center">Crea tu cuenta</span>
          </button>

          {showRegister && (
            <form onSubmit={handleRegister} className="px-6 pb-6 space-y-3">
              <input 
                className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" 
                placeholder="Nombre completo"
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input 
                className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" 
                type="email" 
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" 
                type="password" 
                placeholder="Crea una contraseña"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#ec4899] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-md disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrarme'}
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}
