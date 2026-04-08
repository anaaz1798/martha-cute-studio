import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ChevronLeft, MessageCircle } from 'lucide-react';

export default function Reservar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get('servicio');
  
  const [loading, setLoading] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [whatsappMartha, setWhatsappMartha] = useState('+58 412-1663968'); // Por ahora fijo, luego de config
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', date: '', time: '', notes: ''
  });

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('services').select('*');
      setServicios(data || []);
      
      // Intentar cargar el WhatsApp desde una tabla de configuración si existe
      const { data: config } = await supabase.from('settings').select('value').eq('key', 'whatsapp_number').single();
      if (config) setWhatsappMartha(config.value);
    }
    cargar();
  }, []);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return alert("Por favor selecciona fecha y hora");
    
    setLoading(true);
    try {
      // 1. Upsert del perfil usando el teléfono como identificador
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .upsert({ 
          full_name: formData.fullName, 
          phone: formData.phone, 
          email: formData.email,
          role: 'client' 
        }, { onConflict: 'phone' })
        .select().single();

      if (pError) throw pError;

      // 2. Crear la cita
      const { error: aError } = await supabase.from('appointments').insert([{
        profile_id: profile.id,
        service_id: serviceId,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.notes,
        status: 'pending'
      }]);

      if (aError) throw aError;

      alert("¡Cita reservada con éxito! Martha la revisará pronto.");
      navigate('/');
    } catch (err) { alert("Error: " + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-[#d81b60] text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></button>
        <span className="font-bold uppercase text-xs tracking-widest">Martha Cute Studio</span>
      </div>

      <main className="max-w-3xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Reservar Cita</h2>

          <form onSubmit={handleConfirmar} className="space-y-6">
            {/* Botón WhatsApp de Color (Solo como referencia rápida) */}
            <button 
              type="button"
              onClick={() => window.open(`https://wa.me/${whatsappMartha.replace(/\D/g,'')}?text=Hola! Quiero presupuesto de color`)}
              className="w-full bg-green-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
            >
              <MessageCircle className="w-5 h-5" /> Solicitar Presupuesto de Color
            </button>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Fecha de la Cita</label>
                <input type="date" required className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-pink-200" onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Hora Disponible</label>
                <input type="time" required className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-pink-200" onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>

            {/* Identificación del Cliente (Igual a la imagen) */}
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Tu Nombre Completo" className="p-3 bg-gray-50 rounded-lg border outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
                <input required placeholder="Teléfono" className="p-3 bg-gray-50 rounded-lg border outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <input placeholder="Correo Electrónico (Opcional)" className="w-full p-3 bg-gray-50 rounded-lg border outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
              <textarea placeholder="Notas adicionales (Opcional)" className="w-full p-3 bg-gray-50 rounded-lg border outline-none h-24" onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#d81b60] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#b0164e] transition-colors uppercase text-sm tracking-widest"
            >
              {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
