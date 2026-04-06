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

  if (loading) return <div style={{color:'magenta', textAlign:'center', marginTop:'50px'}}>Cargando...</div>;

  if (!user) {
    return (
      <div style={{textAlign:'center', marginTop:'100px'}}>
        <h1>Martha Cute Studio ✨</h1>
        <button onClick={async () => {
          const email = prompt("Tu correo:");
          const password = prompt("Tu clave:");
          await supabase.auth.signInWithPassword({ email, password });
          window.location.reload();
        }} style={{padding:'10px 20px', borderRadius:'10px', background:'pink'}}>Entrar</button>
      </div>
    );
  }

  return (
    <div style={{padding:'20px', textAlign:'center', backgroundColor: rol === 'admin' ? '#fce4ec' : 'white'}}>
      <h1>{rol === 'admin' ? "¡Hola Jefa Ana! 👑" : "¡Hola Clienta! ✨"}</h1>
      <p>Tu rol es: <b>{rol}</b></p>
      <button onClick={() => supabase.auth.signOut().then(()=>window.location.reload())}>Salir</button>
    </div>
  );
}
