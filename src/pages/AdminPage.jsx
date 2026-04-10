import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, LogOut, Lock, Sparkles, 
  Plus, Key, Image as ImageIcon, Link as LinkIcon, 
  Instagram, Phone, MapPin, Save, Clock, CheckCircle, Trash2, Edit
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('citas');
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE DATOS (EJEMPLOS) ---
  const [citas] = useState([
    { id: 1, cliente: 'Ana Cecilia', servicio: 'Lifting de Pestañas', fecha: '15 Abr', hora: '10:00 AM', telefono: '12560000000', status: 'Confirmado' },
    { id: 2, cliente: 'Karla R.', servicio: 'Diseño de Cejas', fecha: '16 Abr', hora: '11:30 AM', telefono: '584120000000', status: 'Pendiente' }
  ]);

  const [servicios] = useState([
    { id: 1, cat: 'Pestañas', nombre: 'Lifting', precio: '$45' },
    { id: 2, cat: 'Cejas', nombre: 'Laminado', precio: '$40' }
  ]);

  const [links, setLinks] = useState({
    instagram: 'https://instagram.com/marthacutestudio',
    whatsapp: '12560000000', 
    facebook: ''
  });

  const [fotos, setFotos] = useState({
    bannerPrincipal: '',
    vitrina1: '',
    eventoProximo: ''
  });

  // --- FUNCIONES ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const enviarRecordatorio = (cita) => {
    const mensaje = `Hola ${cita.cliente}, ✨ te escribimos de Martha Cute Studio para recordarte tu cita de ${cita.servicio} el día ${cita.fecha} a las ${cita.hora}. ¡Te esperamos!`;
    // Limpia el número de cualquier caracter que no sea número
    const numeroLimpio = cita.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-gray-800 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400 opacity-70">Admin Panel</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Martha Cute Studio</span>
        </div>
        <button onClick={handleLogout} className="p-3 bg-gray-700 rounded-full active:scale-90 text-pink-400 transition-all">
          <LogOut size={18} />
        </button>
      </nav>

      {/* MENÚ DE NAVEGACIÓN */}
      <div className="flex overflow-x-auto gap-4 mt-8 px-6 no-scrollbar">
        {[
          { id: 'citas', label: 'Citas', icon: <Calendar size={14}/> },
          { id: 'servicios', label: 'Servicios', icon: <Sparkles size={14}/> },
          { id: 'multimedia', label: 'Ajustes y Fotos', icon: <ImageIcon size={14}/> },
          { id: 'staff', label: 'Equipo', icon: <Key size={14}/> }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              tab === item.id ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <main className="max-w-md mx-auto p-6 mt-4">
        
        {/* VISTA: CITAS */}
        {tab === 'citas' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Agenda</h2>
            {citas.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-black uppercase">{c.cliente}</p>
                  <p className="text-[10px] font-bold text-[#ec4899] uppercase">{c.servicio}</p>
                  <p className="text-[10px] font-bold text-gray-300 mt-1">{c.hora} - {c.fecha}</p>
                </div>
                <button 
                  onClick={() => enviarRecordatorio(c)}
                  className="bg-green-50 text-green-600 p-4 rounded-full active:scale-90 transition-all"
                >
                  <Phone size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VISTA: SERVICIOS */}
        {tab === 'servicios' && (
          <div className="space-y-4 animate-fadeIn">
             <div className="flex justify-between items-center px-2">
               <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Lista de Precios</h2>
               <button className="bg-gray-800 text-white p-2 rounded-full"><Plus size={16}/></button>
             </div>
             {servicios.map(s => (
               <div key={s.id} className="bg-white p-6 rounded-[30px] border border-gray-100 flex items-center justify-between">
                 <div>
                   <span className="text-[8px] font-black uppercase bg-pink-50 text-[#ec4899] px-2 py-1 rounded-full">{s.cat}</span>
                   <p className="text-[12px] font-black uppercase mt-2">{s.nombre}</p>
                   <p className="text-[11px] font-black text-gray-800">{s.precio}</p>
                 </div>
                 <div className="flex gap-2">
                   <button className="p-2 text-gray-300"><Edit size={16}/></button>
                   <button className="p-2 text-red-200"><Trash2 size={16}/></button>
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* VISTA: AJUSTES Y FOTOS */}
        {tab === 'multimedia' && (
          <div className="animate-fadeIn space-y-6">
            <section className="bg-white p-8 rounded-[40px] border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <LinkIcon size={14}/> Enlaces Sociales
              </h3>
              <div className="space-y-4">
                <input 
                  className="w-full bg-gray-50 p-4 rounded-2xl text-[12px] outline-none border border-gray-100" 
                  placeholder="Instagram Link"
                  value={links.instagram}
                  onChange={(e) => setLinks({...links, instagram: e.target.value})}
                />
                <input 
                  className="w-full bg-gray-50 p-4 rounded-2xl text-[12px] outline-none border border-gray-100" 
                  placeholder="WhatsApp de Contacto (con código de país)"
                  value={links.whatsapp}
                  onChange={(e) => setLinks({...links, whatsapp: e.target.value})}
                />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[40px] border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <ImageIcon size={14}/> Fotos y Banners
              </h3>
              <div className="space-y-4">
                <input 
                  className="w-full bg-gray-50 p-4 rounded-2xl text-[10px] outline-none border border-gray-100" 
                  placeholder="URL Banner Principal"
                  onChange={(e) => setFotos({...fotos, bannerPrincipal: e.target.value})}
                />
                <input 
                  className="w-full bg-gray-50 p-4 rounded-2xl text-[10px] outline-none border border-gray-100" 
                  placeholder="URL Foto Vitrina"
                  onChange={(e) => setFotos({...fotos, vitrina1: e.target.value})}
                />
              </div>
            </section>
            
            <button className="w-full bg-gray-800 text-white py-5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3">
              <Save size={18} className="text-pink-400"/> Guardar Ajustes
            </button>
          </div>
        )}

        {/* VISTA: STAFF */}
        {tab === 'staff' && (
          <div className="animate-fadeIn space-y-4 text-center py-10">
            <Key size={40} className="mx-auto text-gray-200 mb-4"/>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gestión de accesos próximamente</p>
          </div>
        )}

      </main>
    </div>
  );
}
