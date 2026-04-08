import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ChevronLeft, MessageCircle, Clock } from 'lucide-react';

export default function Reservar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const catParam = searchParams.get('categoria'); 
  
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', date: '', time: '' });

  useEffect(() => {
    async function cargar() {
      let query = supabase.from('services').select('*');
      if (catParam) query = query.eq('category', catParam);
      const { data } = await query;
      setServicios(data || []);
    }
    cargar();
  }, [catParam]);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!servicioSeleccionado) return alert("Selecciona un servicio");
    try {
      const { data: profile } = await supabase.from('profiles').upsert({ 
        full_name: formData.fullName, phone: formData.phone, role: 'client' 
      }, { onConflict: 'phone' }).select().single();

      await supabase.from('appointments').insert([{
        profile_id: profile.id,
        service_id: servicioSeleccionado.id,
        appointment_date: formData.date,
        appointment_time: formData.time,
        status: 'pending'
      }]);

      alert("¡Cita agendada! Martha te contactará pronto.");
      navigate('/');
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <nav className="bg-[#d81b60] text-white p-5 flex items-center justify-between shadow-md">
        <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
        <span className="font-black uppercase text-[10px] tracking-[0.4em]">Martha Cute Studio</span>
        <div className="w-9" />
      </nav>

      <main className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-8 italic">Reservar Cita</h2>

          {/* BOTÓN VERDE SÓLO SI ES CATEGORÍA CABELLO */}
          {catParam === 'CABELLO' && (
            <div className="mb-10 p-6 bg-green-50 rounded-[32px] border border-green-100 text-center space-y-4">
              <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">¿Buscas un cambio de color?</p>
              <button 
                onClick={() => window.open('https://wa.me/584121663968?text=Hola Martha! Quiero presupuesto de color ✨')}
                className="w-full bg-[#2ecc71] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs shadow-md shadow-green-200 uppercase tracking-widest active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" /> Presupuesto de Color
              </button>
            </div>
          )}

          {/* LISTA DE SERVICIOS */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Selecciona un servicio</p>
            {servicios.map(s => (
              <div 
                key={s.id} 
                onClick={() => setServicioSeleccionado(s)}
                className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer flex justify-between items-center ${servicioSeleccionado?.id === s.id ? 'border-[#d81b60] bg-pink-50/30' : 'border-gray-50 bg-gray-50/50 hover:border-pink-100'}`}
              >
                <div>
                  <h4 className="font-bold text-sm uppercase">{s.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> {s.duration_minutes} min</span>
                </div>
                <span className="text-xl font-black text-gray-900">${s.price}</span>
              </div>
            ))}
          </div>

          {/* PANEL DE DATOS (image_be0a9f.jpg) */}
          {servicioSeleccionado && (
            <form onSubmit={handleConfirmar} className="mt-12 pt-10 border-t border-gray-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <input type="date" required className="p-4 bg-gray-50 rounded-2xl border-none text-sm outline-none" onChange={e => setFormData({...formData, date: e.target.value})} />
                <input type="time" required className="p-4 bg-gray-50 rounded-2xl border-none text-sm outline-none" onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              <input required placeholder="Nombre Completo" className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <input required type="tel" placeholder="WhatsApp (Ej: +58412...)" className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
              
              <button className="w-full bg-[#d81b60] text-white font-black py-5 rounded-[24px] shadow-lg shadow-pink-100 uppercase text-xs tracking-[0.3em] active:scale-95 transition-all mt-4">
                Confirmar Mi Cita ✨
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
