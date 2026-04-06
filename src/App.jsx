import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase.from('perfiles').select('rol').eq('id', session.user.id).single();
        setRol(data?.rol || 'cliente');
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div style={{color:'magenta', textAlign:'center', marginTop:'50px', fontFamily:'sans-serif'}}>Cargando Martha Cute Studio... ✨</div>;

  if (!user) {
    return (
      <div style={{textAlign:'center', marginTop:'100px', fontFamily:'sans-serif', padding:'20px'}}>
        <h1 style={{color: '#ad1457'}}>Martha Cute Studio ✨</h1>
        <div style={{background:'#fff0f6', padding:'30px', borderRadius:'20px', border:'2px solid #ffc1e3', display:'inline-block'}}>
            <p>Bienvenida, por favor inicia sesión</p>
            <button onClick={async () => {
              const email = prompt("Tu correo:");
              const password = prompt("Tu clave:");
              if (email && password) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) alert("Error: " + error.message);
                else window.location.reload();
              }
            }} style={{padding:'12px 25px', borderRadius:'10px', border:'none', cursor:'pointer', background:'#ad1457', color:'white', fontWeight:'bold'}}>
              ENTRAR
            </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:'20px', textAlign:'center', fontFamily:'sans-serif', backgroundColor: '#fce4ec', minHeight:'100vh'}}>
      <h1 style={{color: '#880e4f'}}>¡Hola {rol === 'admin' ? "Jefa Ana 👑" : "Bella ✨"}!</h1>
      <div style={{background:'white', padding:'30px', borderRadius:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)', display:'inline-block', maxWidth:'400px'}}>
        <p style={{fontSize:'18px'}}>Tu perfil está configurado como: <br/><b style={{color: '#ad1457', fontSize:'24px'}}>{rol?.toUpperCase()}</b></p>
        <hr style={{border:'0.5px solid #eee', margin:'20px 0'}}/>
        {rol === 'admin' ? (
            <div style={{background:'#e8f5e9', padding:'10px', borderRadius:'10px', color:'#2e7d32'}}>
              ✅ Tienes todos los permisos de Jefa activados.
            </div>
        ) : (
            <p>Estás viendo la vista de cliente.</p>
        )}
        <button onClick={() => supabase.auth.signOut().then(()=>window.location.reload())} style={{marginTop:'30px', color:'#ad1457', border:'1px solid #ad1457', background:'none', padding:'8px 15px', borderRadius:'8px', cursor:'pointer'}}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
