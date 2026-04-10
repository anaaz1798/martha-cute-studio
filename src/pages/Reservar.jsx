import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

export default function ReservarPage() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  const horasDisponibles = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleReserva = () => {
    if (fecha && hora) {
      setConfirmado(true);
      // Aquí luego conectamos con Supabase para guardar la cita
    } else {
      alert("Porfa, selecciona fecha y hora");
    }
  };

  if (confirmado) {
    return (
      <div className="min-h-screen bg-[#fffafa] flex items-center justify-center p-8 text-center">
        <div className="bg-white rounded-[50px] p-12 shadow-sm border-2 border-[#fbcfe8] flex flex-col items-center w-full max-w-md">
          <CheckCircle2 className="w-20 h-20 text-[#ec4899] mb-6" />
          <h2 className="font-black text-[18px] uppercase text-gray-800 tracking-widest">¡Cita Agendada!</h2>
          <p className="text-[12px] text-gray-500 mt-4 leading-relaxed">
            Te esperamos el día <span className="font-black text-[#ec4899]">{fecha}</span> a las <span className="font-black text-[#ec4899]">{hora}</span>.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-10 bg-[#ec4899] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-100"
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
            className="w-full p-4 bg-pink-50/30 border-2 border-pink-100 rounded-[20px] text-[13px] font-bold text-gray-700 outline-none focus:border-[#ec4899] transition-all"
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
                  hora === h 
                  ? 'bg-[#ec4899] text-white shadow-lg shadow-pink-200 scale-95' 
                  : 'bg-[#fffafa] text-gray-400 border border-pink-50'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </section>

        {/* BOTÓN FINAL */}
        <button 
          onClick={handleReserva}
          className="w-full bg-[#ec4899] text-white py-5 rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-xl shadow-pink-100 active:scale-95 transition-all"
        >
          Confirmar Reserva
        </button>

      </main>
      <Navbar />
    </div>
  );
}
