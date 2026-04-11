import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function ReservarPage() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const horasDisponibles = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleReserva = async () => {
    // Validación sin alertas feas
    if (!fecha || !hora || !nombre || !telefono || !email || !password) {
      setErrorMsg('Porfa, rellena todos los campos para continuar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Registro del usuario (Silent SignUp)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: nombre, phone: telefono } }
      });

      let userId = authData?.user?.id;

      // Si ya existe, intentamos login rápido para sacar el ID
      if (authError && authError.message.includes("already registered")) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw new Error("Este correo ya tiene cuenta, pero la clave no coincide.");
        userId = loginData?.user?.id;
      } else if (authError) {
        throw authError;
      }

      // 2. Insertar cita en Supabase
      const { error: appoError } = await supabase.from('appointments').insert([{
        client_id: userId,
        appointment_time: `${fecha}T${hora.split(':')[0]}:00:00Z`,
        status: 'pending',
        notes: `TEL: ${telefono}`
      }]);

      if (appoError) throw appoError;
      setConfirmado(true);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmado) {
    return (
      <div className="min-h-screen bg-[#fffafa] flex items-center justify-center p-8">
        <div className="bg-white rounded-[50px] p-12 shadow-xl border-2 border-pink-100 w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-20 h-20 text-[#ec4899] mb-6 mx-auto" />
          <h2 className="font-black text-[20px] uppercase tracking-tighter text-gray-800">¡Todo listo, Ana!</h2>
          <p className="text-[13px] text-gray-500 mt-4">
            Tu cita está agendada y tu cuenta activa. ¡Te esperamos!
          </p>
          <button onClick={() => navigate('/')} className="mt-10 bg-[#ec4899] text-white w-full py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      <nav className="bg-[#ec4899] text-white p-8 text-center sticky top-0 z-50 rounded-b-[40px] shadow-md">
        <span className="font-black uppercase text-[12px] tracking-[0.4em]">Reserva tu espacio</span>
      </nav>

      <main className="max-w-md mx-auto p-8 pt-12 space-y-8">
        
        {/* MENSAJE DE ERROR ESTILIZADO (Adiós alertas feas) */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-5 rounded-[25px] flex items-center gap-3 border border-red-100 text-[11px] font-bold animate-in slide-in-from-top duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PASOS 1 Y 2 */}
        <section className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-pink-50 space-y-6">
          <div className="flex items-center gap-3 text-[#ec4899]">
            <CalendarIcon size={18} /> <h3 className="font-black text-[11px] uppercase tracking-widest">Fecha y Hora</h3>
          </div>
          <input type="date" className="w-full p-5 bg-pink-50/30 border-2 border-pink-100 rounded-[25px] font-bold outline-none focus:border-[#ec4899] transition-all" onChange={(e) => setFecha(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            {horasDisponibles.map((h) => (
              <button key={h} onClick={() => setHora(h)} className={`py-4 rounded-[20px] text-[10px] font-black transition-all ${hora === h ? 'bg-[#ec4899] text-white shadow-md' : 'bg-white text-gray-300 border border-pink-50'}`}>
                {h}
              </button>
            ))}
          </div>
        </section>

        {/* PASO 3: REGISTRO */}
        <section className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-pink-50 space-y-4">
          <div className="flex items-center gap-3 mb-2 text-[#ec4899]">
            <User size={18} /> <h3 className="font-black text-[11px] uppercase tracking-widest">Tus Datos</h3>
          </div>
          <input type="text" placeholder="Nombre completo" className="w-full p-5 bg-pink-50/30 border-2 border-pink-100 rounded-[25px] font-bold outline-none" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input type="tel" placeholder="Teléfono" className="w-full p-5 bg-pink-50/30 border-2 border-pink-100 rounded-[25px] font-bold outline-none" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          
          <div className="relative">
            <Mail size={18} className="absolute left-5 top-5 text-pink-300" />
            <input type="email" placeholder="Correo electrónico" className="w-full p-5 pl-14 bg-pink-50/30 border-2 border-pink-100 rounded-[25px] font-bold outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-5 top-5 text-pink-300" />
            <input type="password" placeholder="Crea tu contraseña" className="w-full p-5 pl-14 bg-pink-50/30 border-2 border-pink-100 rounded-[25px] font-bold outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </section>

        <button 
          onClick={handleReserva} 
          disabled={loading} 
          className="w-full bg-[#ec4899] text-white py-6 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 disabled:opacity-50 transition-all"
        >
          {loading ? 'Procesando...' : 'Confirmar Cita'}
        </button>
      </main>
      <Navbar />
    </div>
  );
}
