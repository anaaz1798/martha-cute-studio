import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ChevronLeft, MessageCircle, Clock, Sparkles } from 'lucide-react';

export default function Reservar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const catParam = searchParams.get('categoria'); 
  
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', date: '', time: '' });

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('services').select('*');
      if (catParam) {
        setServicios(data?.filter(s => s.category?.toUpperCase() === catParam.toUpperCase()) || []);
      } else {
        setServicios(data || []);
      }
    }
    cargar();
  }, [catParam]);

  // Lógica para mostrar el botón de WhatsApp si hay servicios de cabello o color en la lista
  const mostrarBotonWhatsApp = catParam?.toUpperCase() === 'CABELLO' || 
    servicios.some(s => s.name?.toLowerCase().includes('color') || s.name?.toLowerCase().includes('presupuesto'));

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
      <nav className="bg-[#d81b60] text-white p-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-1.5 bg-white/20 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
        <span className="font-black uppercase text-[9px] tracking-[0.2em]">Martha Cute Studio</span>
        <div className="w-8" />
      </nav>

      <main className="max-w-lg mx-auto mt-4 px-4">
        {/* Cabezal de Reserva Pequeño */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-4 text-center">
            <h2 className="text-[14px] font-black tracking-tight uppercase text-gray-900 leading-none">Reservar Cita</h2>
            <p className="text-[10px] font-bold text-[#d81b60] uppercase tracking-widest mt-1">
              {catParam ? `Categoría: ${catParam}` : 'Todos los servicios'}
            </p>
        </div>

        <div className="bg-white rounded-[28px] p-4 shadow-sm border border-gray-100">
          
          {/* BOTÓN WHATSAPP ARREGLADO: Aparece si entras por botón rosa o por categoría Cabello */}
          {mostrarBotonWhatsApp && (
            <div className="mb-4 p-3 bg-green-50 rounded-2xl border border-green-100 text-center animate-in fade-in duration-500">
              <p className="text-[9px] font-bold text-green-700 uppercase mb-2">¿Buscas un cambio de color?</p>
              <button 
                onClick={() => window.open('https://wa.me/584121663968?text=Hola Martha, quiero un presupuesto de color')}
                className="w-full bg-[#2ecc71] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-sm shadow-green-100"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Color
              </button>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center">Selecciona un servicio</p>
            {servicios.map(s => (
              <div 
                key={s.id} 
                onClick={() => setServicioSeleccionado(s)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${servicioSeleccionado?.id === s.id ? 'border-[#d81b60] bg-pink-50/20' : 'border-gray-50 bg-gray-50/50'}`}
              >
                <div className="flex-1">
                  <h4 className="font-bold text-[12px] uppercase text-gray-800 tracking-tighter">{s.name}</h4>
                  <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> {s.duration_minutes} min</span>
                </div>
                <span className="text-md font-black text-[#d81b60]">${s.price}</span>
              </div>
            ))}
          </div>

          {servicioSeleccionado && (
            <form onSubmit={handleConfirmar} className="space-y-3 pt-4 border-t border-gray-100 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="date" required className="p-3 bg-gray-50 rounded-xl text-[11px] outline-none" onChange={e => setFormData({...formData, date: e.target.value})} />
                <input type="time" required className="p-3 bg-gray-50 rounded-xl text-[11px] outline-none" onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              <input required placeholder="Tu Nombre" className="w-full p-3 bg-gray-50 rounded-xl text-[11px] outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <input required type="tel" placeholder="WhatsApp" className="w-full p-3 bg-gray-50 rounded-xl text-[11px] outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <button className="w-full bg-[#d81b60] text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-100 text-[10px] uppercase tracking-[0.2em]">Confirmar Reserva</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
