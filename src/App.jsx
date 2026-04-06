import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase.from('perfiles').select('rol').eq('id', session.user.id).single();
        setRol(data?.rol || 'cliente');
      }
      setLoading(false);
    };
    check();
  }, []);

  if (loading) return <div style={{color:'magenta', textAlign:'center', marginTop:'50px'}}>Cargando Martha Cute Studio... ✨</div>;

  if (!user) {
    return (
      <div style={{textAlign:'center', marginTop:'100px', fontFamily:'sans-serif'}}>
        <h1 style={{color: '#ad1457'}}>Martha Cute Studio ✨</h1>
        <div style={{background:'pink', padding:'20px', borderRadius:'15px', display:'inline-block'}}>
            <p>Por favor, entra para continuar</p>
            <button onClick={async () => {
              const email = prompt("Tu correo:");
              const password = prompt("Tu clave:");
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) alert("Error: " + error.message);
              else window.location.reload();
            }} style={{padding:'10px 20px', borderRadius:'10px', border:'none', cursor:'pointer', background:'white', fontWeight:'bold'}}>
              ENTRAR
            </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:'20px', textAlign:'center', fontFamily:'sans-serif', backgroundColor: '#fce4ec', minHeight:'100vh'}}>
      <h1 style={{color: '#880e4f'}}>{rol === 'admin' ? "¡Hola Jefa Ana! 👑" : "¡Bienvenida! ✨"}</h1>
      <div style={{background:'white', padding:'30px', borderRadius:'20px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)', display:'inline-block'}}>
        <p>Tu rol detectado es: <b style={{fontSize:'20px', color: '#ad1457'}}>{rol}</b></p>
        <hr/>
        {rol === 'admin' ? (
            <p>✅ Tienes acceso total al panel.</p>
        ) : (
            <p>Estás en modo cliente.</p>
        )}
        <button onClick={() => supabase.auth.signOut().then(()=>window.location.reload())} style={{marginTop:'20px', color:'red', border:'none', background:'none', cursor:'pointer'}}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
