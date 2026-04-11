import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { 
  Users, Calendar, LogOut, Sparkles, Plus, Key, 
  Trash2, Edit, Camera, Phone, Save, Bell, Settings, EyeOff, CheckCircle
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('calendario');
  const [citas, setCitas] = useState([]);
  const [clientas, setClientas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    const { data: citasData } = await supabase.from('citas').select('*').order('fecha', { ascending: true });
    const { data: clientasData } = await supabase.from('clientas').select('*');
    const { data: servData } = await supabase.from('servicios').select('*');
    
    if (citasData) setCitas(citasData);
    if (clientasData) setClientas(clientasData);
    if (servData) setServicios(servData);
    setLoading(false);
  }

  // LÓGICA DE WHATSAPP: RECORDATORIO MANUAL
  const enviarRecordatorio = (cita) => {
    const tlf = cita.telefono.replace(/\D/g, ''); // Limpia guiones y espacios
    const mensaje = `Hola ${cita.nombre_clienta}! ✨ Te recordamos tu cita en Martha Cute Studio para el día ${cita.fecha} a las ${cita.hora}. ¡Te esperamos para brillar! 💖`;
    window.open(`https://wa.me/${tlf}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  // CAMBIAR ESTADO DE PRESUPUESTO (EN REVISIÓN / LISTO)
  const actualizarEstadoCita = async (id, nuevoEstado) => {
    await supabase.from('citas').update({ estado: nuevoEstado }).eq('id', id);
    fetchAdminData();
    // Aquí dispararías la notificación push (Lógica de OneSignal o similar)
    console.log(`Notificación Push: ¡Buenas noticias! Tu servicio está ${nuevoEstado}.`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* NAVBAR MASTER */}
      <nav className="bg-gray-900 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400">The Boss Control</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Martha Cute Studio</span>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setTab('configuracion')} className="p-3 bg-gray-800 rounded-full text-pink-400"><Settings size={18} /></button>
           <button onClick={() => navigate('/')} className="p-3 bg-gray-800 rounded-full text-white"><LogOut size={18} /></button>
        </div>
      </nav>

      {/* MENÚ DE SECCIONES (DINÁMICO SEGÚN ROL) */}
      <div className="flex overflow-x-auto gap-4 mt-8 px-6 no-scrollbar">
        {[
          { id: 'calendario', label: 'Calendario Maestro', icon: <Calendar size={14}/> },
          { id: 'clientas', label: 'Clientas', icon: <Users size={14}/> },
          { id: 'servicios', label: 'Servicios', icon: <Sparkles size={14}/> },
          { id: 'vitrina', label: 'Vitrina/Productos', icon: <Camera size={14}/> }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === item.id ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <main className="max-w-4xl mx-auto p-6 mt-4">
        
        {/* VISTA: CALENDARIO MAESTRO (SOLO MARTHA Y TEAM) */}
        {tab === 'calendario' && (
          <div className="space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Agenda del TeamCute</h2>
            {citas.map(cita => (
              <div key={cita.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-pink-50 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[14px] font-black uppercase">{cita.nombre_clienta}</p>
                    <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">{cita.servicio}</p>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full font-black">{cita.hora}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => enviarRecordatorio(cita)}
                    className="flex-1 bg-green-50 text-green-600 p-3 rounded-2xl text-[9px] font-black uppercase flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Phone size={14}/> Enviar Recordatorio
                  </button>
                  <button 
                    onClick={() => actualizarEstadoCita(cita.id, 'Confirmada')}
                    className="bg-pink-50 text-pink-500 p-3 rounded-2xl active:scale-95"
                  >
                    <CheckCircle size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTA: CLIENTAS (CON BOTÓN DE WHATSAPP DIRECTO) */}
        {tab === 'clientas' && (
          <div className="space-y-4">
             {clientas.map(c => (
               <div key={c.id} className="bg-white p-5 rounded-[30px] flex justify-between items-center border border-gray-100">
                  <div>
                    <p className="text-[12px] font-black uppercase">{c.nombre}</p>
                    <p className="text-[10px] text-gray-400">{c.email}</p>
                  </div>
                  <button 
                    onClick={() => window.open(`https://wa.me/${c.telefono.replace(/\D/g,'')}`, '_blank')}
                    className="p-3 bg-pink-50 text-pink-500 rounded-full"
                  >
                    <MessageCircle size={18}/>
                  </button>
               </div>
             ))}
          </div>
        )}

        {/* VISTA: CONFIGURACIÓN (SOLO MARTHA) */}
        {tab === 'configuracion' && (
          <div className="bg-white p-8 rounded-[40px] shadow-xl space-y-6">
            <h2 className="text-[14px] font-black uppercase">Ajustes de la Marca</h2>
            <div className="space-y-4">
               <div className="p-4 bg-gray-50 rounded-2xl">
                 <p className="text-[10px] font-black uppercase mb-2 text-gray-400">Credenciales Master</p>
                 <button className="flex items-center gap-2 text-[11px] font-bold text-pink-600"><Key size={14}/> Cambiar contraseña de acceso</button>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl">
                 <p className="text-[10px] font-black uppercase mb-2 text-gray-400">Activos Visuales</p>
                 <button className="flex items-center gap-2 text-[11px] font-bold text-gray-700"><Camera size={14}/> Cambiar Logo y Favicon</button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
