import { useState } from 'react';
import { supabase } from '../supabase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("¡Revisa tu correo para confirmar!");
  };

  return (
    <div className="bolt-screen">
      <div className="bolt-card">
        <h1 className="bolt-title">Crear Cuenta</h1>
        <p className="bolt-welcome">Únete a TheCute Studio</p>
        <form onSubmit={handleRegister} className="bolt-form">
          <div className="bolt-input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="bolt-input-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="bolt-btn">Registrarme</button>
        </form>
      </div>
    </div>
  );
}
