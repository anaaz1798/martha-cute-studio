import { useState } from 'react';
import { supabase } from '../supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // 1. Crea el usuario en la autenticación de Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return alert(authError.message);

    // 2. Si se creó bien, guarda sus datos en la tabla 'profiles'
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            full_name: fullName, 
            phone: phone,
            role: 'client' 
          }
        ]);

      if (profileError) alert("Error guardando perfil: " + profileError.message);
      else alert("¡Cuenta creada con éxito! Ya puedes entrar.");
    }
  };

  return (
    <div className="bolt-card" style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <h2 style={{ color: '#d15690', textAlign: 'center' }}>Crear Cuenta en The Cute</h2>
      <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Nombre Completo" className="bolt-input" onChange={(e) => setFullName(e.target.value)} required />
        <input type="tel" placeholder="Teléfono" className="bolt-input" onChange={(e) => setPhone(e.target.value)} required />
        <input type="email" placeholder="Correo" className="bolt-input" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="bolt-input" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bolt-btn">Registrarme</button>
      </form>
    </div>
  );
}
