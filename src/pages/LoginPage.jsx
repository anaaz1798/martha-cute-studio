import { useState } from 'react';
import { supabase } from '../supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error: " + error.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="bolt-screen">
      <div className="bolt-card">
        {/* Círculo rosa con icono de Bolt */}
        <div className="bolt-icon-circle">
          <span className="bolt-sparkle">✨</span>
        </div>
        
        <h1 className="bolt-title">TheCute</h1>
        <p className="bolt-welcome">Bienvenida de vuelta</p>

        <form onSubmit={handleLogin} className="bolt-form">
          <div className="bolt-input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Escribe tu correo" 
              required 
            />
          </div>

          <div className="bolt-input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="bolt-btn">Ingresar</button>
        </form>

        <p className="bolt-footer">
          ¿No tienes cuenta? <span className="bolt-link">Regístrate</span>
        </p>
      </div>
    </div>
  );
}
