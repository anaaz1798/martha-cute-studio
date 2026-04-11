import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Tu conexión de siempre
import { 
  Users, Calendar, LogOut, Sparkles, Plus, Key, 
  Trash2, Edit, Star, Camera, Phone, Save, Link as LinkIcon 
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('citas');
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS REALES DE SUPABASE
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: serviciosData } = await supabase.from('servicios').select('*');
    if (serviciosData) setServicios(serviciosData);
    setLoading(false);
  }

  // 2. FUNCIÓN PARA EDITAR/GUARDAR (Lo que me pediste)
  async function actualizarPrecio(id, nuevoPrecio) {
    const { error } = await supabase
      .from('servicios')
      .update({ precio: nuevoPrecio })
      .eq('id', id);
    
    if (!error) fetchData(); // Refrescar para ver el cambio
  }

  // 3. FUNCIÓN PARA BORRAR
  async function eliminarServicio(id) {
    const { error } = await supabase.from('servicios').delete().eq('id', id);
    if (!error) fetchData();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      <nav className="bg-gray-800 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400">Admin Panel</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Martha Cute Studio</span>
        </div>
        <button onClick={() => navigate('/')} className="p-3 bg-gray-700 rounded-full text-pink-400 transition-all active:scale-90">
          <LogOut size={18} />
        </button>
      </nav>

      {/* Menú de Navegación */}
      <div className="flex overflow-x-auto gap-4 mt-8 px-6 no-scrollbar">
        {[
          { id: 'citas', label: 'Citas', icon: <Calendar size={14}/> },
          { id: 'servicios', label: 'Servicios', icon: <Sparkles size={14}/> },
          { id: 'eventos', label: 'Eventos', icon: <Star size={14}/> },
          { id: 'vitrina', label: 'Vitrina', icon: <Camera size={14}/> },
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
        
        {/* VISTA: SERVICIOS CON EDICIÓN REAL */}
        {tab === 'servicios' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Gestionar Servicios</h2>
            {loading ? <p className="text-center text-[10px] uppercase font-bold text-pink-300">Cargando Supabase...</p> : 
              servicios.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-[35px] border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[12px] font-black uppercase">{s.nombre}</p>
                    <p className="text-[11px] font-black text-[#ec4899]">{s.precio}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => {
                      const p = prompt("Nuevo precio:", s.precio);
                      if(p) actualizarPrecio(s.id, p);
                    }} className="text-gray-300 hover:text-blue-500 transition-colors"><Edit size={18}/></button>
                    <button onClick={() => eliminarServicio(s.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))
            }
            <button className="w-full border-2 border-dashed border-gray-200 p-6 rounded-[35px] text-gray-300 flex justify-center active:scale-95">
              <Plus size={24}/>
            </button>
          </div>
        )}

        {/* ... (Aquí puedes seguir añadiendo las vistas de Eventos y Citas con la misma lógica de Supabase) */}
      </main>
    </div>
  );
}
