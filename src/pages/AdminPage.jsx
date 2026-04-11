import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, LogOut, Sparkles, Plus, Key, 
  Image as ImageIcon, Link as LinkIcon, Trash2, Edit, Star, Camera, Phone, Save, CheckCircle, Clock
} from 'lucide-react';

// Data compartida con la página de servicios
export const DATA_SERVICIOS = {
  'Pestañas': [
    { id: 1, nombre: 'Lifting de Pestañas', precio: '$45', tiempo: '45 min', tlf: '12560000000' },
    { id: 2, nombre: 'Pelo a Pelo', precio: '$60', tiempo: '90 min', tlf: '12560000000' }
  ],
  'Cejas': [
    { id: 3, nombre: 'Diseño + Depilación', precio: '$25', tiempo: '30 min', tlf: '12560000000' }
  ],
  'Cabello': [
    { id: 4, nombre: 'Corte Dama', precio: '$35', tiempo: '45 min', tlf: '12560000000' }
  ]
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('citas');

  // Estados de ejemplo para las nuevas secciones
  const [staff] = useState([{ id: 1, nombre: 'Martha', rol: 'Dueña', email: 'marthacutestudio@gmail.com' }]);
  const [vitrina] = useState([{ id: 1, titulo: 'Trabajo Realizado', url: 'https://via.placeholder.com/150' }]);
  const [citas] = useState([
    { id: 1, cliente: 'Ana Cecilia', servicio: 'Lifting', fecha: '15 Abr', hora: '10:00 AM', telefono: '12560000000' }
  ]);

  // Función Universal de WhatsApp (Usa el número que me diste para el remitente)
  const enviarRecordatorio = (cita) => {
    const mensaje = `Hola ${cita.cliente}, ✨ recordatorio de Martha Cute Studio para tu cita de ${cita.servicio} el ${cita.fecha} a las ${cita.hora}.`;
    const numLimpio = cita.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${numLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400">Admin Panel</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Martha Cute Studio</span>
        </div>
        <button onClick={() => navigate('/')} className="p-3 bg-gray-700 rounded-full text-pink-400 transition-all active:scale-90">
          <LogOut size={18} />
        </button>
      </nav>

      {/* Menú Deslizable */}
      <div className="flex overflow-x-auto gap-4 mt-8 px-6 no-scrollbar">
        {[
          { id: 'citas', label: 'Citas', icon: <Calendar size={14}/> },
          { id: 'servicios', label: 'Servicios', icon: <Sparkles size={14}/> },
          { id: 'vitrina', label: 'Vitrina', icon: <Camera size={14}/> },
          { id: 'staff', label: 'Equipo', icon: <Key size={14}/> },
          { id: 'ajustes', label: 'Ajustes', icon: <LinkIcon size={14}/> }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              tab === item.id ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <main className="max-w-md mx-auto p-6 mt-4">
        
        {/* VISTA: CITAS CON WHATSAPP */}
        {tab === 'citas' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Agenda</h2>
            {citas.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-[35px] border border-gray-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[13px] font-black uppercase">{c.cliente}</p>
                  <p className="text-[10px] font-bold text-[#ec4899] uppercase">{c.servicio}</p>
                  <p className="text-[10px] font-bold text-gray-300 mt-1">{c.hora} - {c.fecha}</p>
                </div>
                <button onClick={() => enviarRecordatorio(c)} className="bg-green-50 text-green-600 p-4 rounded-full active:scale-90 transition-all">
                  <Phone size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VISTA: SERVICIOS AGRUPADOS */}
        {tab === 'servicios' && (
          <div className="space-y-8 animate-fadeIn">
            {Object.keys(DATA_SERVICIOS).map(cat => (
              <section key={cat} className="space-y-4">
                <h3 className="text-[12px] font-black uppercase text-gray-700 ml-2 border-l-4 border-pink-500 pl-3">{cat}</h3>
                <div className="space-y-3">
                  {DATA_SERVICIOS[cat].map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-[30px] border border-gray-100 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-[12px] font-black uppercase">{s.nombre}</p>
                        <p className="text-[11px] font-black text-[#ec4899]">{s.precio}</p>
                      </div>
                      <div className="flex gap-2 text-gray-200">
                        <Edit size={16}/> <Trash2 size={16}/>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* VISTA: EQUIPO (LLAVES) */}
        {tab === 'staff' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gray-800 p-8 rounded-[40px] text-white">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-pink-400 mb-4">Crear Nueva Llave</h3>
              <input className="w-full bg-gray-700 p-4 rounded-2xl text-[12px] mb-4 outline-none" placeholder="Nombre" />
              <button className="w-full bg-[#ec4899] py-4 rounded-full text-[10px] font-black uppercase">Generar Acceso</button>
            </div>
            {staff.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[30px] border border-gray-100 flex justify-between items-center">
                <p className="text-[12px] font-black uppercase">{s.nombre} - <span className="text-gray-400">{s.rol}</span></p>
                <Key size={16} className="text-gray-300"/>
              </div>
            ))}
          </div>
        )}

        {/* VISTA: VITRINA */}
        {tab === 'vitrina' && (
          <div className="grid grid-cols-2 gap-4 animate-fadeIn">
            {vitrina.map(img => (
              <div key={img.id} className="bg-white p-2 rounded-[25px] border border-gray-100 relative shadow-sm">
                <img src={img.url} className="w-full h-32 object-cover rounded-[20px]" alt="Vitrina" />
                <button className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full"><Trash2 size={12}/></button>
              </div>
            ))}
            <button className="h-32 border-2 border-dashed border-gray-200 rounded-[25px] flex items-center justify-center text-gray-300"><Plus/></button>
          </div>
        )}

        {/* VISTA: AJUSTES (REDES) */}
        {tab === 'ajustes' && (
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 space-y-4 animate-fadeIn">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Redes Sociales</h3>
            <input className="w-full bg-gray-50 p-4 rounded-2xl text-[12px] outline-none" placeholder="Instagram URL" />
            <input className="w-full bg-gray-50 p-4 rounded-2xl text-[12px] outline-none" placeholder="WhatsApp Principal" defaultValue="+584121663968" />
            <button className="w-full bg-gray-800 text-white py-5 rounded-full mt-4 flex items-center justify-center gap-3 active:scale-95 transition-all">
              <Save size={18} className="text-pink-400"/> <span className="text-[10px] font-black uppercase tracking-widest">Guardar Cambios</span>
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
