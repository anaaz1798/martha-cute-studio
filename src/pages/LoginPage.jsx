// ... (manten tus otros imports: useState, supabase, useNavigate, etc.)

export default function LoginPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showStaff, setShowStaff] = useState(false);

  // Estados para Admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LOGIN DE ADMINISTRADOR (MARTHA) ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validamos primero que sea el correo de Martha
    if (adminEmail !== 'marthacutestudio@gmail.com') {
      alert("Este correo no tiene permisos de administrador.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPass,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // Si todo bien, va pal' panel de una
      navigate('/admin'); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 px-4 font-sans text-gray-800">
      <main className="max-w-md mx-auto pt-4 space-y-4">
        
        {/* ... (Tus secciones de Agendar, Login Clienta y Registro igual) ... */}

        {/* 3. ACCESO STAFF (ADMIN) */}
        <div className="bg-white rounded-[32px] border-2 border-gray-100 overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowStaff(!showStaff); setShowLogin(false); setShowRegister(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-gray-400"
          >
            <Hash className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest text-center">Acceso Team Cute</span>
          </button>

          {showStaff && (
            <form onSubmit={handleAdminLogin} className="px-6 pb-6 space-y-3">
              <p className="text-[9px] font-black text-center text-gray-400 uppercase tracking-tighter mb-2">
                Área exclusiva para el equipo
              </p>
              <input 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none border border-gray-100" 
                type="email" 
                placeholder="marthacutestudio@gmail.com"
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              <input 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none border border-gray-100 text-center tracking-[0.5em]" 
                type="password" 
                placeholder="****"
                onChange={(e) => setAdminPass(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-md active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Validando...' : 'Entrar al Panel'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
