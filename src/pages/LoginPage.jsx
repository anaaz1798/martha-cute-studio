import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Clock, ChevronRight, User, Scissors, Wand2, Star, Sparkle, Calendar, Mail, Lock, Phone, Key } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estados del Formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [accessKey, setAccessKey] = useState('');

  useEffect(() => {
    async function cargarServicios() {
      const { data } = await supabase.from('services').select('*');
      setServicios(data || []);
    }
    cargarServicios();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;
        if (authData.user) {
          const finalRole = accessKey.trim() === 'CUTE2026' ? 'staff' : 'client';
          await supabase.from('profiles').insert([{ id: authData.user.id, full_name: fullName, phone, role: finalRole }]);
          alert(`¡Bienvenida! Rol: ${finalRole}`);
          navigate(finalRole === 'staff' ? '/admin' : '/');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/admin');
      }
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const iconMap = { 'CABELLO': Scissors, 'CEJAS': Sparkle, 'PESTAÑAS': Wand2, 'UÑAS': Star, 'DEFAULT': Sparkles };
  const agrupados = servicios.reduce((acc, s) => {
    const cat = s.category ? s.category.toUpperCase() : 'OTROS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const inputClass = "w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#ff85a1] transition-all";

  return (
    <div className="min-h-screen bg-[#fff5f7] pb-20 font-sans">
      <main className="max-w-xl mx-auto p-6 space-y-10">
        
        {/* 1. BIENVENIDA Y BOTÓN PRINCIPAL */}
        <section className="bg-white rounded-[32px] p-8 text-center shadow-sm border border-pink-50 mt-4 space-y-6">
          <div className="bg-[#d81b60] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto rotate-12 shadow-lg shadow-pink-100">
            <Sparkles className="text-white w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Martha Cute Studio</h1>
            <p className="text-gray-400 text-sm font-medium">Reserva tu cita y brilla como nunca antes.</p>
          </div>
          <button className="w-full bg-[#d81b60] text-white font-bold py-5 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-3 active:scale-95 transition-all text-lg uppercase">
            <Calendar className="w-6 h-6" /> Reservar Cita Ahora
          </button>
        </section>

        {/* 2. FORMULARIO DE ACCESO (CARD) */}
        <section className="bg-white rounded-[32px] p-8 shadow-sm border border-pink-50 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
              {isRegistering ? 'Crea tu cuenta' : 'Ingresa a tu cuenta'}
            </h2>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <>
                <div className="relative"><User className="absolute left-4 top-4 text-gray-300 w-5 h-5"/><input className={inputClass} placeholder="Nombre" onChange={e => setFullName(e.target.value)} required /></div>
                <div className="relative"><Phone className="absolute left-4 top-4 text-gray-300 w-5 h-5"/><input className={inputClass} placeholder="Teléfono" onChange={e => setPhone(e.target.value)} required /></div>
              </>
            )}
            <div className="relative"><Mail className="absolute left-4 top-4 text-gray-300 w-5 h-5"/><input className={inputClass} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required /></div>
            <div className="relative"><Lock className="absolute left-4 top-4 text-gray-300 w-5 h-5"/><input className={inputClass} type="password" placeholder="Clave" onChange={e => setPassword(e.target.value)} required /></div>
            
            <button disabled={loading} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs">
              {loading ? 'Cargando...' : isRegistering ? 'Registrarme ✨' : 'Entrar 🔑'}
            </button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-xs font-bold text-[#d81b60] uppercase tracking-widest">
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </section>

        {/* 3. LISTA DE SERVICIOS (ESTILO BOLT) */}
        <div className="space-y-8">
          <h3 className="text-center font-black text-gray-400 text-xs uppercase tracking-[0.4em]">Nuestros Servicios</h3>
          {Object.keys(agrupados).map(cat => {
            const Icono = iconMap[cat] || iconMap['DEFAULT'];
            return (
              <div key={cat} className="space-y-4">
                <div className="flex items-center gap-3 ml-2">
                  <Icono className="w-5 h-5 text-[#d81b60]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat}</span>
                </div>
                <div className="grid gap-3">
                  {agrupados[cat].map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-[28px] shadow-sm flex justify-between items-center border border-transparent hover:border-pink-100 transition-all">
                      <div>
                        <h4 className="font-bold text-gray-800">{s.name}</h4>
                        <span className="text-[9px] font-bold text-gray-300 uppercase italic">{s.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {s.price > 0 ? (
                          <span className="font-black text-xl text-gray-900">${s.price}</span>
                        ) : (
                          <span className="bg-[#2ecc71] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase">Presupuesto</span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
