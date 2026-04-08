import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ChevronLeft, Calendar as CalendarIcon, Clock, User } from 'lucide-react';

export default function Reservar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get('servicio');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: ''
  });

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Intentamos crear/obtener el perfil del cliente por su teléfono
      // Usamos 'upsert' para que si el número ya existe, solo lo identifique
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .upsert({ 
          full_name: formData.fullName, 
          phone: formData.phone, 
          email: formData.email,
          role: 'client' 
        }, { onConflict: 'phone' })
        .select()
        .single();

      if (pError) throw pError;

      // 2. Creamos la cita vinculada a ese perfil
      const { error: aError } = await supabase
        .from('appointments')
        .insert([{
          profile_id: profile.id,
          service_id: serviceId,
          appointment_date: formData.date,
          appointment_time: formData.time,
          status: 'pending'
        }]);

      if (aError) throw aError;

      alert("¡Cita agendada con éxito! Martha te contactará pronto.");
      navigate('/');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfafb] pb-10 px-4 font-sans">
      <nav className="py-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h1 className="font-black uppercase text-sm tracking-widest">Finalizar Reserva</h1>
      </nav>

      <form onSubmit={handleConfirmar} className="max-w-xl mx-auto space-y-6">
        {/* AQUÍ IRÍA TU CALENDARIO Y SELECTOR DE HORA (Como en la imagen) */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-50">
           <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 text-center tracking-widest">Selecciona Fecha y Hora</p>
           <input type="date" required className="w-full mb-3 p-3 bg-gray-50 rounded-xl" onChange={e => setFormData({...formData, date: e.target.value})} />
           <input type="time" required className="w-full p-3 bg-gray-50 rounded-xl" onChange={e => setFormData({...formData, time: e.target.value})} />
        </section>

        {/* EL PANEL DE IDENTIFICACIÓN (El que me mostraste) */}
        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-pink-50 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center mb-2">Tus Datos</h3>
          <input required placeholder="Nombre Completo" className="w-full pl-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
          <input required type="tel" placeholder="Teléfono (WhatsApp)" className="w-full pl-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input type="email" placeholder="Correo (Opcional)" className="w-full pl-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <button disabled={loading} className="w-full bg-[#d81b60] text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-100 uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all">
            {loading ? 'Procesando...' : 'Confirmar Cita ✨'}
          </button>
        </section>
      </form>
    </div>
  );
}
