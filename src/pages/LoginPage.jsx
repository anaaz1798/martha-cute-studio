import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Scissors, Wand2, Star, Sparkle, Calendar, MessageCircle, ChevronDown, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const serviciosRef = useRef(null);
  const authRef = useRef(null);
  
  const [servicios, setServicios] = useState([]);
  const [showAuth, setShowAuth] = useState(false); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('services').select('*');
      setServicios(data || []);
    }
    cargar();
  }, []);

  const handleServiceClick = (s) => {
    if (s.price > 0) {
      navigate(`/reservar?servicio=${s.id}&nombre=${encodeURIComponent(s.name)}`);
    } else {
      const tel = "1234567890"; // PONE AQUÍ EL WHATSAPP DE MARTHA
      window.open(`https://wa.me/${tel}?text=Hola! Quiero presupuesto para: ${s.name}`, '_blank');
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
    } catch (err) { alert("Error: " + err.message); }
  };

  const iconMap = { 'CABELLO': Scissors, 'CEJAS': Sparkle, 'PESTAÑAS': Wand2, 'UÑAS': Star, 'DEFAULT': Sparkles };
  const agrupados = servicios.reduce((acc, s) => {
    const cat = s.category?.toUpperCase() || 'OTROS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-20 px-4">
      <main className="max-w-xl mx-auto pt-6 space-y-6">
        
        {/* BOTONES ACCESO */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => {setShowAuth(true); setIsRegistering(false);}} className="bg-white p-4 rounded-[24px] shadow-sm border border-pink-50 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-700 uppercase tracking-widest active:scale-95 transition-all">
            <LogIn className="w-4 h-4 text-[#d81b60]" /> Entrar
          </button>
          <button onClick={() => {setShowAuth(true); setIsRegistering(true);}} className="bg-white p-4 rounded-[24px] shadow-sm border border-pink-50 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-700 uppercase tracking-widest active:scale-95 transition-all">
            <UserPlus className="w-4 h-4 text-[#d81b60]" /> Registro
          </button>
        </div>

        {/* BIENVENIDA */}
        <section className="bg-white rounded-[40px] p-8 text-center shadow-sm border border-pink-50/50">
          <div className="bg-[#d81b60] w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto mb-4 rotate-6 shadow-md shadow-pink-100">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-1">Martha Cute Studio</h1>
          <p className="text-gray-400 text-xs font-medium mb-6">Reserva tu cita o pide presupuesto de color.</p>
          <button onClick={() => serviciosRef.current?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-[#d81b60] text-white font-bold py-4 rounded-[20px] shadow-lg shadow-pink-200 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest">
            <Calendar className="w-4 h-4" /> Ver Menú de Servicios
          </button>
        </section>

        {/* FORMULARIO LOGIN (OCULTO) */}
        {showAuth && (
          <section ref={authRef} className="bg-white rounded-[40px] p-8 shadow-sm border border-pink-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{isRegistering ? 'Crear Cuenta' : 'Acceso'}</h2>
              <button onClick={() => setShowAuth(false)} className="text-gray-300 text-lg">×</button>
            </div>
            <form onSubmit={handleAuth} className="space-y-3">
              <input className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm border-none outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm border-none outline-none" type="password" placeholder="Clave" onChange={e => setPassword(e.target.value)} />
              <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.25em]">Confirmar</button>
            </form>
          </section>
        )}

        {/* LISTA SERVICIOS */}
        <div ref={serviciosRef} className="pt-6 space-y-3">
          <h3 className="text-center font-black text-gray-900 text-xl tracking-tighter uppercase mb-6 underline decoration-[#d81b60] decoration-4 underline-offset-4">Servicios</h3>
          {Object.keys(agrupados).map(cat => {
            const Icono = iconMap[cat] || iconMap['DEFAULT'];
            const isOpen = expandedCat === cat;
            return (
              <div key={cat} className="space-y-2">
                <button onClick={() => setExpandedCat(isOpen ? null : cat)} className="w-full bg-white p-5 rounded-[24px] flex justify-between items-center shadow-sm border border-gray-50 active:scale-[0.99] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-50 p-2 rounded-lg text-[#d81b60]"><Icono className="w-4 h-4" /></div>
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{cat}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="grid gap-2 mt-2 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {agrupados[cat].map(s => (
                      <div key={s.id} onClick={() => handleServiceClick(s)} className="bg-white/70 p-4 rounded-[20px] flex justify-between items-center border border-pink-50/50 shadow-sm cursor-pointer active:scale-[0.98]">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-gray-800 text-sm">{s.name}</h4>
                          <div className="text-gray-400 text-[9px] font-bold uppercase">{s.duration_minutes} min</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {s.price > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="font-black text-lg text-gray-900">${s.price}</span>
                              <ChevronRight className="w-4 h-4 text-[#d81b60]" />
                            </div>
                          ) : (
                            <div className="bg-[#2ecc71] p-2 rounded-full shadow-sm flex items-center gap-2 px-3">
                              <span className="text-[8px] font-black text-white uppercase">WhatsApp</span>
                              <MessageCircle className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
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
