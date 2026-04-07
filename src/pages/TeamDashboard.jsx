import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function TeamDashboard() {
  const [tab, setTab] = useState('calendario');
  const [citas, setCitas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombreStaff, setNombreStaff] = useState('Chama'); // Saludo inicial

  useEffect(() => {
    cargarDatosEquipo();
  }, [tab]);

  async function cargarDatosEquipo() {
    // 1. Buscamos quién es la que está entrando
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfil } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      // Agarramos solo el primer nombre para que sea más cercano
      if (perfil?.full_name) setNombreStaff(perfil.full_name.split(' ')[0]);
    }

    // 2. Cargamos la agenda y productos
    const { data: c } = await supabase.from('appointments')
      .select('*, profiles(full_name, phone), services(name)')
      .order('appointment_time');
    
    const { data: pr } = await supabase.from('products').select('*');
    
    setCitas(c || []);
    setProductos(pr || []);
  }

  // ... (el resto de las funciones de estatus y whatsapp se quedan igual)

  return (
    <div style={teamPage}>
      <header style={teamHeader}>
        {/* AQUÍ ESTÁ EL SALUDO PERSONALIZADO ✨ */}
        <h2 style={{ color: '#000', margin: 0, fontFamily: 'serif' }}>
          ¡Hola, {nombreStaff}! ✨
        </h2>
        <p style={{ fontSize: '13px', color: '#ff85a1', fontWeight: 'bold', marginTop: '5px' }}>
          TeamCute Workspace
        </p>
      </header>

      {/* ... Resto del menú y las pestañas (Agenda/Vitrina) ... */}
    </div>
  );
}

// --- ESTILOS (Ajuste pequeño para el header) ---
const teamPage = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', paddingBottom: '40px' };
const teamHeader = { 
  textAlign: 'center', 
  marginBottom: '25px', 
  padding: '20px', 
  backgroundColor: '#fff',
  borderRadius: '20px',
  boxShadow: '0 4px 15px rgba(255, 133, 161, 0.1)' 
};
// ... (los demás estilos que ya tenías)
