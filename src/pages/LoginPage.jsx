import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, ChevronRight, Scissors, Wand2, Star, Sparkle, Calendar, Mail, Lock, User, Phone, MessageCircle, ChevronDown, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const serviciosRef = useRef(null);
  const authRef = useRef(null); // Para bajar al formulario cuando toquen los botones de arriba
  
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('services').select('*');
      setServicios(data || []);
    }
    cargar();
  }, []);

  const toggleCategory = (cat) => {
    setExpandedCat(expandedCat === cat ? null : cat);
  };

  const openAuth = (mode) => {
    setIsRegistering(mode === 'register');
    authRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        const { data: authData, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        await supabase.from('profiles').insert([{ id: authData.user.id, full_name: fullName, phone, role: 'client' }]);
        alert("¡Registro exitoso!");
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
    const cat = s.category?.toUpperCase() || 'OTROS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-20 px-4 font-sans">
      <main className="max-w-xl mx-auto pt-6 space-y-6">
        
        {/* 1. BOTONES DE ACCESO RÁPIDO (ARRIBA DE TODO) */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => openAuth('login')}
            className="bg-white p-4 rounded-[24px] shadow-sm border border-pink-50 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-700 uppercase tracking-widest active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4 text-[#d81b60]" /> Iniciar Sesión
          </button>
          <button 
            onClick={() => openAuth('register')}
            className="bg-white p-4 rounded-[24px] shadow-sm border border-pink-50 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-700 uppercase tracking-widest active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4 text-[#d81b60]" /> Registrarme
          </button>
        </div>

        {/* 2. TARJETA DE BIENVENIDA */}
        <section className="bg-white rounded-[40px] p-8 text-center shadow-sm border border-pink-50/50">
          <div className="bg-[#d81b60] w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto mb-4 rotate-6 shadow-md shadow-pink-100">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-1">Martha Cute Studio</h1>
          <p className="text-gray-400 text-xs font-medium mb-6 px-4">Reserva tu cita y brilla como nunca antes.</p>
          <button 
            onClick={() => serviciosRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full bg-[#d81b60] text-white font-bold py-4 rounded-[20px] shadow-lg shadow-pink-200 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest"
          >
            <Calendar className="w-4 h-4" /> Reservar Cita Ahora
          </button>
        </section>

        {/* 3. FORMULARIO DE ACCESO (CARD DINÁMICA) */}
        <section ref={authRef} className="bg-white rounded-[40px] p-8 shadow-sm border border-pink-50/50 scroll-mt-6">
          <h2 className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">
            {isRegistering ? 'Crear Cuenta Nueva' : 'Ingresar al Portal'}
          </h2>
          <form onSubmit={handleAuth} className="space-y-3">
            {isRegistering && (
              <>
                <div className="relative"><User className="absolute left-4 top-4 text-gray-300 w-4 h-4"/><input className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none border-none focus:ring-1 focus:ring-[#ff85a1]" placeholder="Nombre completo" onChange={e => setFullName(e.target.value)} /></div>
                <div className="relative"><Phone className="absolute left-4 top-4 text-gray-300 w-4 h-4"/><input className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none border-none focus:ring-1 focus:ring-[#ff85a1]" placeholder="Teléfono" onChange={e => setPhone(e.target.value)} /></div>
              </>
            )}
            <div className="relative"><Mail className="absolute left-4 top-4 text-gray-300 w-4 h-4"/><input className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none border-none focus:ring-1 focus:ring-[#ff85a1]" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} /></div>
            <div className="relative"><Lock className="absolute left-4 top-4 text-gray-300 w-4 h-4"/><input className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none border-none focus:ring-1 focus:ring-[#ff85a1]" type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} /></div>
            <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-xl mt-2 active:scale-95 transition-all text-[10px] uppercase tracking-[0.25em]">
              {isRegistering ? 'Completar Registro ✨' : 'Acceder al Studio 🔑'}
            </button>
          </form>
        </section>

        {/* 4. LISTA DE SERVICIOS COLAPSABLE */}
        <div ref={serviciosRef} className="pt-6 space-y-3 scroll-mt-6">
          <h3 className="text-center font-black text-gray-900 text-xl tracking-tighter uppercase mb-6 underline decoration-[#d81b60] decoration-4 underline-offset-4">Nuestros Servicios</h3>
          
          {Object.keys(agrupados).map(cat => {
            const Icono = iconMap[cat] || iconMap['DEFAULT'];
            const isOpen = expandedCat === cat;

            return (
              <div key={cat} className="space-y-2">
                <button 
                  onClick={() => toggleCategory(cat)}
                  className="w-full bg-white p-5 rounded-[24px] flex justify-between items-center shadow-sm border border-gray-50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-50 p-2 rounded-lg text-[#d81b60]">
                      <Icono className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{cat}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="grid gap-2 mt-2 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {agrupados[cat].map(s => (
                      <div key={s.id} className="bg-white/70 p-4 rounded-[20px] flex justify-between items-center border border-pink-50/50 shadow-sm">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-gray-800 text-sm">{s.name}</h4>
                          <div className="text-gray-400 text-[9px] font-bold uppercase">{s.duration_minutes} min</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {s.price > 0 ? (
                            <span className="font-black text-lg text-gray-900">${s.price}</span>
                          ) : (
                            <div className="bg-[#2ecc71] p-2 rounded-full shadow-sm shadow-green-100">
                              <MessageCircle className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                          <ChevronRight className="w-3 h-3 text-gray-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
