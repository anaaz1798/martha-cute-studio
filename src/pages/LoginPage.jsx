import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, LogIn, UserPlus, Download } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Lógica para simular la instalación de la App
  const handleInstallApp = () => {
    alert("¡Iniciando la descarga de Martha Cute Studio App! Revisa tus notificaciones.");
  };

  const handleAuth = async (type) => {
    setLoading(true);
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: 'client'
            }
          }
        });
    
    if (error) alert(error.message);
    else {
      alert(type === 'login' ? "¡Bienvenida de vuelta!" : "¡Cuenta creada! Revisa tu email.");
      navigate('/servicios'); // Lo mandamos a servicios después de loguearse
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-24 px-4 font-sans text-gray-900">
      <main className="max-w-md mx-auto pt-4 space-y-6">
        
        {/* BOTÓN DE INSTALAR APP */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleInstallApp}
            className="flex items-center gap-2 bg-[#d81b60]/10 text-[#d81b60] font-bold px-6 py-2 rounded-full text-[10px] uppercase tracking-widest active:scale-95 transition-all border border-pink-100 shadow-sm"
          >
            <Download className="w-4 h-4" /> Instalar App
          </button>
        </div>

        {/* CABEZAL CON BANNER Y CORAZÓN TRASLÚCIDO */}
        <header className="relative bg-white rounded-[32px] p-10 text-center shadow-lg shadow-pink-100/50 border border-pink-50 overflow-hidden">
          {/* El CORAZÓN Traslúcido detrás */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 rotate-[-15deg]">
            <Heart className="w-64 h-64 text-[#d81b60]" />
          </div>

          {/* El Banner Rosa (Pill shape) con el nombre */}
          <div className="relative z-10 inline-flex items-center gap-3 bg-[#d81b60] text-white px-8 py-3 rounded-full shadow-md shadow-pink-200">
            <Heart className="w-5 h-5 text-white" />
            <h1 className="text-xl font-black uppercase tracking-tighter">Martha Cute Studio</h1>
          </div>
          
          <p className="relative z-10 text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">Realzamos tu belleza natural</p>
        </header>

        {/* BOTÓN PRINCIPAL DE AGENDAR CITA */}
        <button 
          onClick={() => navigate('/servicios')} 
          className="w-full bg-[#d81b60] text-white font-black py-5 rounded-[24px] text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white"
        >
          <Calendar className="w-5 h-5" /> Agendar Cita
        </button>

        {/* FORMULARIO DE INICIO DE SESIÓN */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-[#d81b60]">
            <LogIn className="w-4 h-4" />
            <h2 className="text-[11px] font-black uppercase tracking-widest">Ya tengo cuenta</h2>
          </div>
          <div className="space-y-3">
            <input className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none border-none focus:ring-2 ring-pink-100 transition-all" type="email" placeholder="Correo electrónico" onChange={e => setEmail(e.target.value)} />
            <input className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none border-none focus:ring-2 ring-pink-100 transition-all" type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
            <button onClick={() => handleAuth('login')} disabled={loading} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest mt-2 active:bg-black">Entrar</button>
          </div>
        </div>

        {/* FORMULARIO DE REGISTRO (Completo) */}
        <div className="bg-[#fff5f8] rounded-[32px] p-6 border border-dashed border-pink-200">
          <div className="flex items-center gap-2 mb-6 text-gray-500">
            <UserPlus className="w-4 h-4" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-pink-700/60">¿Eres nueva? Crea tu cuenta</h2>
          </div>
          <div className="space-y-3">
            <input className="w-full px-5 py-4 bg-white rounded-2xl text-[11px] outline-none border border-pink-50" type="text" placeholder="Nombre completo" onChange={e => setFullName(e.target.value)} />
            <input className="w-full px-5 py-4 bg-white rounded-2xl text-[11px] outline-none border border-pink-50" type="tel" placeholder="Teléfono" onChange={e => setPhone(e.target.value)} />
            <input className="w-full px-5 py-4 bg-white rounded-2xl text-[11px] outline-none border border-pink-50" type="email" placeholder="Correo electrónico" onChange={e => setEmail(e.target.value)} />
            <input className="w-full px-5 py-4 bg-white rounded-2xl text-[11px] outline-none border border-pink-50" type="password" placeholder="Crea una contraseña" onChange={e => setPassword(e.target.value)} />
            <button onClick={() => handleAuth('signup')} className="w-full bg-white text-[#d81b60] border border-[#d81b60] font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-sm active:bg-pink-50">Registrarme ✨</button>
          </div>
        </div>

      </main>
    </div>
  );
}
