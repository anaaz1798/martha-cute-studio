import { useState } from 'react';
import { supabase } from '../supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    else window.location.reload();
  };

  return (
    <div className="login-screen">
      <div className="glass-card">
        {/* El Icono Rosa de arriba */}
        <div className="icon-container">
          <span className="sparkle-icon">✨</span>
        </div>
        
        <h1 className="brand-title">TheCute</h1>
        <p className="brand-subtitle">Bienvenida de vuelta</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="btn-pink">Ingresar</button>
        </form>

        <p className="footer-text">
          ¿No tienes cuenta? <span className="link-pink">Regístrate</span>
        </p>
      </div>
    </div>
  );
}
