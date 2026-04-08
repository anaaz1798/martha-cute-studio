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
  const [formData, setFormData] = useState({ fullName: '', phone: '', date: '', time: '' });

  useEffect(() => {
    async function cargar() {
      // Cargamos servicios y filtramos para asegurar que siempre haya contenido
      const { data } = await supabase.from('services').select('*');
      if (catParam) {
        // Filtrado insensible a mayúsculas para evitar errores
        const filtrados = data?.filter(s => s.category?.toUpperCase() === catParam.toUpperCase()) || [];
        setServicios(filtrados);
      } else {
        setServicios(data || []);
      }
    }
    cargar();
  }, [catParam]);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!servicioSeleccionado) return;
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
      alert("¡Cita agendada!");
      navigate('/');
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 font-sans">
      {/* HEADER MÁS FINO */}
      <nav className="bg-[#d81b60] text-white p-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-1.5 bg-white/10 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
        <span className="font-black uppercase text-[8px] tracking-[0.3em]">RESERVA TU CITA</span>
        <div className="w-8" />
      </nav>

      <main className="max-w-lg mx-auto mt-2 px-3">
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100">
          
          <h2 className="text-lg font-black tracking-tighter uppercase mb-4 italic text-gray-800">Selecciona un servicio</h2>

          {/* BOTÓN WHATSAPP INDEPENDIENTE (Solo en Cabello) */}
          {catParam?.toUpperCase() === 'CABELLO' && (
            <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-100">
              <p className="text-[8px] font-black text-green-700 uppercase tracking-widest text-center mb-2">¿Buscas presupuesto de color?</p>
              <button 
                onClick={() => window.open('https://wa.me/584121663968?text=Hola Martha! Quiero presupuesto de color')}
                className="w-full bg-[#2ecc71] text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Color
              </button>
            </div>
          )}

          {/* LISTA DE SERVICIOS MÁS COMPACTA */}
          <div className="grid gap-2 mb-6">
            {servicios.map(s => (
              <div 
                key={s.id} 
                onClick={() => setServicioSeleccionado(s)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${servicioSeleccionado?.id === s.id ? 'border-[#d81b60] bg-pink-50/20' : 'border-gray-50 bg-gray-50/50 hover:border-pink-50'}`}
              >
                <div className="pr-2">
                  <h4 className="font-bold text-[10px] uppercase text-gray-700">{s.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[7px] text-gray-400 font-bold uppercase flex items-center gap-1"><Clock className="w-2 h-2"/> {s.duration_minutes} min</span>
                  </div>
                </div>
                <span className="text-xs font-black text-gray-900">${s.price}</span>
              </div>
            ))}
          </div>

          {/* FORMULARIO COMPACTO (Aparece cuando eliges servicio) */}
          {servicioSeleccionado && (
            <form onSubmit={handleConfirmar} className="space-y-2 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[8px] font-black text-pink-600 uppercase tracking-widest">Tus datos para la cita:</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" required className="p-2.5 bg-gray-50 rounded-lg text-[10px] outline-none border-none focus:ring-1 focus:ring-pink-200" onChange={e => setFormData({...formData, date: e.target.value})} />
                <input type="time" required className="p-2.5 bg-gray-50 rounded-lg text-[10px] outline-none border-none focus:ring-1 focus:ring-pink-200" onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              <input required placeholder="Nombre Completo" className="w-full p-2.5 bg-gray-50 rounded-lg text-[10px] outline-none border-none focus:ring-1 focus:ring-pink-200" onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <input required type="tel" placeholder="WhatsApp (+58...)" className="w-full p-2.5 bg-gray-50 rounded-lg text-[10px] outline-none border-none focus:ring-1 focus:ring-pink-200" onChange={e => setFormData({...formData, phone: e.target.value})} />
              
              <button className="w-full bg-[#d81b60] text-white font-black py-3 rounded-xl shadow-md text-[9px] uppercase tracking-[0.2em] active:scale-95 transition-all mt-2">
                Confirmar Reserva
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
