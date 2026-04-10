import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, LogOut, Lock, Sparkles, 
  Plus, Key, Image as ImageIcon, Link as LinkIcon, 
  Instagram, Phone, Save, Clock, Trash2, Edit, Star, Camera, ChevronRight
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('citas');

  // --- DATA AGRUPADA POR CATEGORÍAS ---
  const [servicios] = useState({
    'Pestañas': [
      { id: 1, nombre: 'Lifting', precio: '$45' },
      { id: 2, nombre: 'Pelo a Pelo', precio: '$60' }
    ],
    'Cejas': [
      { id: 3, nombre: 'Diseño Pro', precio: '$25' },
      { id: 4, nombre: 'Laminado', precio: '$40' }
    ],
    'Facial': [
      { id: 5, nombre: 'Limpieza', precio: '$65' }
    ]
  });

  const categorias = Object.keys(servicios);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32 font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-gray-800 text-white p-8 flex justify-between items-center sticky top-0 z-50 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400">Admin Panel</span>
          <span className="text-[14px] font-black uppercase tracking-widest">Martha Cute Studio</span>
        </div>
        <button onClick={() => navigate('/')} className="p-3 bg-gray-700 rounded-full text-pink-400">
          <LogOut size={18} />
        </button>
      </nav>

      {/* MENÚ DE NAVEGACIÓN */}
      <div className="flex overflow-x-auto gap-4 mt-8 px-6 no-scrollbar">
        {['citas', 'servicios', 'vitrina', 'eventos', 'staff', 'ajustes'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === item ? 'bg-[#ec4899] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <main className="max-w-md mx-auto p-6 mt-4">
        
        {/* VISTA: SERVICIOS AGRUPADOS */}
        {tab === 'servicios' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Menú de Servicios</h2>
              <button className="bg-gray-800 text-white p-2 rounded-full shadow-lg"><Plus size={16}/></button>
            </div>

            {categorias.map(cat => (
              <section key={cat} className="space-y-4">
                {/* Título de la Categoría */}
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-1 h-4 bg-[#ec4899] rounded-full"></div>
                  <h3 className="text-[12px] font-black uppercase tracking-tighter text-gray-700">{cat}</h3>
                </div>

                {/* Lista de esta categoría */}
                <div className="space-y-3">
                  {servicios[cat].map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-[30px] border border-gray-100 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-[12px] font-black uppercase">{s.nombre}</p>
                        <p className="text-[11px] font-black text-[#ec4899]">{s.precio}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 bg-gray-50 rounded-full text-gray-300 hover:text-gray-800"><Edit size={14}/></button>
                        <button className="p-3 bg-gray-50 rounded-full text-red-200 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ... (Las otras pestañas se mantienen igual que el código anterior) ... */}
        {tab === 'citas' && <div className="text-[10px] uppercase font-bold text-gray-400 text-center py-20">Selecciona una categoría para gestionar</div>}
      </main>
    </div>
  );
}
