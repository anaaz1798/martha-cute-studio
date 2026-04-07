import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      // REGISTRO
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        // Guardamos los datos extras en la tabla profiles
        await supabase.from('profiles').insert([
          { 
            id: data.user.id, 
            full_name: fullName, 
            phone: phone, 
            role: 'client',
            security_question: question,
            security_answer: answer.toLowerCase().trim()
          }
        ]);
        alert("¡Bienvenida a Martha Cute Studio! ✨");
        navigate('/');
      }
    } else {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Credenciales incorrectas");
      else {
        // Redirigir según el rol
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile?.role === 'admin') navigate('/admin');
        else if (profile?.role === 'staff') navigate('/team');
        else navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={logoStyle}>Martha Cute Studio</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>{isRegistering ? 'Crea tu perfil ✨' : '¡Hola, hermosa! 💖'}</p>
        
        <form onSubmit={handleAuth}>
          {isRegistering && (
            <>
              <input style={inputStyle} placeholder="Nombre completo" onChange={e => setFullName(e.target.value)} required />
              <input style={inputStyle} placeholder="WhatsApp (ej: +58 424...)" onChange={e => setPhone(e.target.value)} required />
            </>
          )}
          
          <input style={inputStyle} type="email" placeholder="Correo electrónico" onChange={e => setEmail(e.target.value)} required />
          <input style={inputStyle} type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />

          {isRegistering && (
            <>
              <p style={{fontSize: '12px', margin: '10px 0 5px'}}>Pregunta de Seguridad (para recuperar cuenta):</p>
              <input style={inputStyle} placeholder="Ej: ¿Nombre de mi primera mascota?" onChange={e => setQuestion(e.target.value)} required />
              <input style={inputStyle} placeholder="Respuesta" onChange={e => setAnswer(e.target.value)} required />
            </>
          )}

          <button style={mainBtn} disabled={loading}>
            {loading ? 'Cargando...' : isRegistering ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: '15px', cursor: 'pointer', color: '#ff85a1' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </p>
      </div>
    </div>
  );
}

// --- ESTILOS NATIVOS ---
const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', padding: '20px' };
const cardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(255, 133, 161, 0.2)' };
const logoStyle = { fontFamily: 'serif', color: '#000', fontSize: '28px', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box' };
const mainBtn = { width: '100%', padding: '12px', backgroundColor: '#000', color: '#ff85a1', border: '1px solid #ff85a1', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
