import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function HomeClient() {
  const [perfil, setPerfil] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [config, setConfig] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    // 1. Obtener sesión y perfil
    const { data: { user } } = await supabase.auth.getUser();
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setPerfil(p);

    // 2. Cargar Configuración (Logo, redes, etc)
    const { data: c } = await supabase.from('global_config').select('*').single();
    setConfig(c || {});

    // 3. Cargar Servicios activos
    const { data: s } = await supabase.from('services').select('*').eq('is_active', true);
    setServicios(s || []);
  }

  const solicitarPresupuestoColor = () => {
    const mensaje = encodeURIComponent(
      `¡Hola Martha! ✨ Soy ${perfil?.full_name}. Me encantaría pedir un presupuesto de color para mi cabello. 💖 ¿Me podrías ayudar?`
    );
    window.open(`https://wa.me/${config.whatsapp_master?.replace(/\D/g,'')}?text=${mensaje}`, '_blank');
    
    // Aquí puedes disparar la notificación nativa de "En espera" si quieres
    alert("¡Solicitud enviada! ✨ Martha revisará tu caso y te notificará pronto.");
  };

  return (
    <div style={pageStyle}>
      {/* Header con saludo personalizado */}
      <header style={headerStyle}>
        <img src={config.logo_url || 'https://via.placeholder.com/80'} alt="Logo" style={logoImg} />
        <h2 style={{ margin: '10px 0 5px', color: '#000' }}>Hola, {perfil?.full_name?.split(' ')[0]} ✨</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>¿Qué nos haremos hoy para brillar?</p>
      </header>

      {/* Secciones de Servicios */}
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Servicios Disponibles</h3>
        <div style={gridStyle}>
          {['Cejas', 'Pestañas', 'Uñas'].map(cat => (
            <div key={cat} style={catCard}>
              <span style={{fontSize: '24px'}}>{cat === 'Cejas' ? '✒️' : cat === 'Pestañas' ? '👁️' : '💅'}</span>
              <p style={{fontWeight: 'bold', margin: '5px 0'}}>{cat}</p>
              <button style={btnSmall}>Agendar</button>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN ESPECIAL: CABELLO */}
      <section style={{...sectionStyle, backgroundColor: '#000', borderRadius: '25px', padding: '20px', color: '#fff'}}>
        <h3 style={{color: '#ff85a1', marginTop: 0}}>💇‍♀️ Cabello</h3>
        <p style={{fontSize: '14px'}}>Cambios de look y tratamientos profundos.</p>
        
        <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
          <button style={btnAgendarCabello}>Citas Normales</button>
          
          {/* BOTÓN MÁGICO DE PRESUPUESTO */}
          <button onClick={solicitarPresupuestoColor} style={btnPresupuesto}>
            Presupuesto de Color ✨
          </button>
        </div>
      </section>

      {/* Redes Sociales fijas abajo */}
      <footer style={footerStyle}>
        <a href={config.instagram_url} style={iconLink}>Instagram</a>
        <a href={config.tiktok_url} style={iconLink}>TikTok</a>
        <a href={`https://wa.me/${config.whatsapp_master}`} style={iconLink}>WhatsApp</a>
      </footer>
    </div>
  );
}

// --- ESTILOS "MARTHA CUTE" ---
const pageStyle = { minHeight: '100vh', backgroundColor: '#fff', padding: '20px', paddingBottom: '100px', fontFamily: 'sans-serif' };
const headerStyle = { textAlign: 'center', marginBottom: '30px' };
const logoImg = { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff85a1' };
const sectionStyle = { marginBottom: '30px' };
const titleStyle = { fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' };
const catCard = { textAlign: 'center', padding: '15px', border: '1px solid #f0f0f0', borderRadius: '15px' };
const btnSmall = { backgroundColor: '#ff85a1', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '12px' };
const btnAgendarCabello = { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ff85a1', backgroundColor: 'transparent', color: '#ff85a1', fontWeight: 'bold' };
const btnPresupuesto = { flex: 1.5, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ff85a1', color: '#000', fontWeight: 'bold', boxShadow: '0 0 15px rgba(255, 133, 161, 0.4)' };
const footerStyle = { position: 'fixed', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-around', backgroundColor: '#000', padding: '15px', borderRadius: '20px' };
const iconLink = { color: '#ff85a1', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' };
