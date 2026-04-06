import { useState } from 'react';
import { supabase } from '../supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) alert("Error: " + error.message);
    else window.location.reload();
  };

  return (
    <div className="iphone-container">
      <h1 className="greeting">Martha Cute Studio ✨</h1>
      <div className="glass-card">
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo" onChange={(e)=>setEmail(e.target.value)} className="input-luxury" required />
          <input type="password" placeholder="Clave" onChange={(e)=>setPassword(e.target.value)} className="input-luxury" required />
          <button type="submit" className="btn-luxury">Entrar al Studio 🚀</button>
        </form>
      </div>
    </div>
  );
}
