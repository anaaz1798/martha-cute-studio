import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone } from 'lucide-react';
import { supabase } from '../supabase';

export default function ReservarPage() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);

  const horasDisponibles = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleReserva = async () => {
    if (!fecha || !hora || !nombre || !telefono) {
      alert("¡Epa! No dejes campos vacíos. Necesito saber quién eres y cuándo vienes.");
      return;
    }

    setLoading(true);

    // Conectamos con Supabase para guardar la cita de verdad
    const { error } = await supabase.from('appointments').insert([{
      appointment_time: `${fecha}T${hora.includes('PM') ? parseInt(hora)+12 : hora.split(':')[0]}:00:00Z`, 
      status: 'pending',
      notes: `Cliente: ${nombre} - Tel: ${telefono}` // Aquí guardamos quién es
    }]);

    if (!error) {
      setConfirmado(true);
    } else {
      console.error(error);
      alert("Coño, hubo un error al guardar. Revisa la conexión.");
    }
    setLoading(false);
  };

  if (confirmado) {
    return (
      <div className="min-h-screen bg-[#fffafa] flex items-center justify-center p-8 text-center">
        <div className="bg-white rounded-[50px] p-12 shadow-sm border-2 border-[#fbcfe8] flex flex-col items-center w-full max-w-md">
          <CheckCircle2 className="w-20 h-20 text-[#ec4899] mb-6" />
          <h2 className="font-black text-[18px] uppercase text-gray-800 tracking-widest">¡Cita Agendada!</h2>
          <p className="text-[12px] text-gray-500 mt-4 leading-relaxed">
            Te esperamos, <span className="font-black text-[#ec4899]">{nombre}</span>, el día <span className="font-black text-[#ec4899]">{fecha}</span> a las <span className="font-black text-[#ec4899]">{hora}</span>.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-10 bg-[#ec4899] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 font-sans text-gray-800">
      <nav className="bg-[#ec4899] text-white p-8 text-center sticky top-0 z-50 rounded-b-[40px] shadow-md">
        <span className="font-black uppercase text-[12px] tracking-[0.4em]">Reservar Cita</span>
      </nav>

      <main className="max-w-md mx-auto p-8 pt-12 space-y-10">
        
        {/* PASO 1: SELECCIONAR FECHA */}
        <section className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-[#fbcfe8]">
          <div className="flex items-center gap-3 mb-6 text-[#ec4899]">
            <CalendarIcon className="w-5 h-5" />
            <h3 className="font-black text-[12px] uppercase tracking-widest">1. Elige el día</h3>
          </div>
          <input 
            type="date" 
            className="w-full p-4 bg-pink-50/30 border-2 border-pink-100 rounded-[20px] text-[13px] font-bold text-gray-700 outline-none"
            onChange={(e) => setFecha(e.target.value)}
          />
        </section>

        {/* PASO 2: SELECCIONAR HORA */}
        <section className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-[#fbcfe8]">
          <div className="flex items-center gap-3 mb-8 text-[#ec4899]">
            <Clock className="w-5 h-5" />
            <h3 className="font-black text-[12px] uppercase tracking-widest">2. Elige la hora</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {horasDisponibles.map((h) => (
              <button
                key={h}
                onClick={() => setHora(h)}
                className={`py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  hora === h ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-[#fffafa] text-gray-400 border border-pink-50'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </section>

        {/* PASO 3: DATOS DE CONTACTO (¡Lo que faltaba!) */}
        <section className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-[#fbcfe8] space-y-4">
          <div className="flex items-center gap-3 mb-4 text-[#ec4899]">
            <User className="w-5 h-5" />
            <h3 className="font-black text-[12px] uppercase tracking-widest">3. Tus Datos</h3>
          </div>
          <input 
            type="text"
            placeholder="Nombre Completo"
            className="w-full p-4 bg-pink-50/30 border-2 border-pink-100 rounded-[20px] text-[13px] font-bold outline-none"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input 
            type="tel"
            placeholder="Teléfono"
            className="w-full p-4 bg-pink-50/30 border-2 border-pink-100 rounded-[20px] text-[13px] font-bold outline-none"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </section>

        {/* BOTÓN FINAL */}
        <button 
          onClick={handleReserva}
          disabled={loading}
          className="w-full bg-[#ec4899] text-white py-5 rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Confirmar Reserva'}
        </button>

      </main>
      <Navbar />
    </div>
  );
}
