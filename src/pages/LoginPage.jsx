import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, LogIn, UserPlus, Download, X, Hash } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [staffCode, setStaffCode] = useState('');

  // Función para ir a servicios
  const goToServices = () => {
    navigate('/servicios');
  };

  const handleStaffLogin = () => {
    if (staffCode === 'MARTHA2026') {
      navigate('/eventos');
    } else {
      alert("Código de Staff inválido");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 px-4 font-sans text-gray-800">
      <main className="max-w-md mx-auto pt-4 space-y-4">
        
        {/* BOTÓN INSTALAR APP - Rosado suave */}
        <div className="bg-white border border-pink-100 rounded-2xl p-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 text-[#f472b6]">
            <Download className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Instalar App</span>
          </div>
          <X className="w-4 h-4 text-gray-300 cursor-pointer" />
        </div>

        {/* CABEZAL CON CORAZÓN TRASLÚCIDO */}
        <section className="bg-white rounded-[40px] p-8 text-center relative overflow-hidden shadow-sm border border-pink-50">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <Heart className="w-48 h-48 text-[#f472b6]" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            {/* BOTÓN AGENDAR - Ahora sí navega */}
            <button 
              onClick={goToServices}
              className="bg-[#ec4899] text-white px-10 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-pink-100 mb-6 active:scale-95 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Agendar Cita</span>
            </button>
            <h1 className="text-xl font-black uppercase tracking-tighter mb-1 text-gray-700">Martha Cute Studio</h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tu belleza, nuestra pasión</p>
          </div>
        </section>

        {/* 1. LOGIN CLIENTA - Borde rosado pastel */}
        <div className="bg-white rounded-[32px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowLogin(!showLogin); setShowRegister(false); setShowStaff(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-[#f472b6]"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest">Ya tengo cuenta</span>
          </button>
          
          {showLogin && (
            <div className="px-6 pb-6 space-y-3">
              <input className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" type="email" placeholder="Correo electrónico" />
              <input className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" type="password" placeholder="Contraseña" />
              <button className="w-full bg-[#ec4899] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest">Entrar</button>
            </div>
          )}
        </div>

        {/* 2. REGISTRO CLIENTA */}
        <div className="bg-white rounded-[32px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowRegister(!showRegister); setShowLogin(false); setShowStaff(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-[#f472b6]"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest">¿Eres nueva? Crea tu cuenta</span>
          </button>

          {showRegister && (
            <div className="px-6 pb-6 space-y-3">
              <input className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" placeholder="Nombre completo" />
              <input className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" placeholder="Teléfono" />
              <input className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" placeholder="Email" />
              <input className="w-full px-5 py-4 bg-pink-50/30 rounded-2xl text-[11px] outline-none border border-pink-50" type="password" placeholder="Contraseña" />
              <button className="w-full bg-[#ec4899] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest">Registrarme</button>
            </div>
          )}
        </div>

        {/* 3. ACCESO STAFF */}
        <div className="bg-white rounded-[32px] border-2 border-gray-100 overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowStaff(!showStaff); setShowLogin(false); setShowRegister(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-gray-400"
          >
            <Hash className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest">Acceso Staff</span>
          </button>

          {showStaff && (
            <div className="px-6 pb-6 space-y-3">
              <input 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none text-center tracking-[0.5em]" 
                type="password" 
                placeholder="****" 
                onChange={(e) => setStaffCode(e.target.value)}
              />
              <button 
                onClick={handleStaffLogin}
                className="w-full bg-gray-700 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest"
              >
                Validar Código
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
