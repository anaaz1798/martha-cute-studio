import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, Phone, User, Key } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [accessKey, setAccessKey] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        // 1. Registro en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Lógica de Rol (Si la llave es 'CUTE2026' entra como staff, si no como client)
          // Esto evita tener que consultar otra tabla y que dé error de pantalla negra
          const finalRole = accessKey.trim() === 'CUTE2026' ? 'staff' : 'client';

          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: authData.user.id,
              full_name: fullName,
              phone: phone,
              role: finalRole,
            },
          ]);

          if (profileError) console.error("Error perfil:", profileError.message);
          
          alert(`¡Registro exitoso como ${finalRole}!`);
          navigate(finalRole === 'staff' ? '/admin' : '/');
        }
      } else {
        // 3. Login Normal
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;
        navigate('/admin');
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f7] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-pink-100">
        <div className="text-center mb-8">
          <div className="bg-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-lg shadow-pink-200">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Martha Cute Studio</h1>
          <p className="text-gray-400 text-sm">{isRegistering ? 'Crea tu cuenta' : 'Bienvenida de nuevo'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
                  placeholder="Nombre completo" onChange={e => setFullName(e.target.value)} required />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
                  placeholder="Teléfono" onChange={e => setPhone(e.target.value)} required />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
            <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
              type="email" placeholder="Correo electrónico" onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
            <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
              type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />
          </div>

          {isRegistering && (
            <div className="relative border-t pt-4 mt-2">
              <Key className="absolute left-4 top-8 text-pink-300 w-5 h-5" />
              <input className="w-full pl-12 pr-4 py-4 bg-pink-50/50 rounded-2xl text-sm border border-pink-100 outline-none" 
                placeholder="Llave del Team (Opcional)" onChange={e => setAccessKey(e.target.value)} />
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95">
            {loading ? 'Procesando...' : isRegistering ? 'REGISTRARME ✨' : 'ENTRAR 🔑'}
          </button>
        </form>

        <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-6 text-sm font-bold text-pink-400 hover:text-pink-600">
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
        
        <Link to="/" className="block text-center mt-4 text-xs text-gray-400 underline">Volver a servicios</Link>
      </div>
    </div>
  );
}
