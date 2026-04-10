// ... (imports iguales)

export default function LoginPage() {
  // ... (estados iguales)

  return (
    <div className="min-h-screen bg-[#fffafa] pb-24 px-4 font-sans text-gray-800">
      <main className="max-w-md mx-auto pt-4 space-y-4">
        
        {/* CABEZAL */}
        <section className="bg-white rounded-[40px] p-8 text-center relative overflow-hidden shadow-sm border border-pink-50">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <Heart className="w-48 h-48 text-[#ec4899]" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <button 
              onClick={() => navigate('/servicios')}
              className="bg-[#ec4899] text-white px-10 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-pink-100 mb-6 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Agendar Cita</span>
            </button>
            <h1 className="text-xl font-black uppercase tracking-tighter mb-1 text-gray-700 text-center">Martha Cute Studio</h1>
          </div>
        </section>

        {/* LOGIN CLIENTA - BOTÓN ROSADO */}
        <div className="bg-white rounded-[32px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowLogin(!showLogin); setShowRegister(false); setShowStaff(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-[#ec4899]"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest text-center">Ya tengo cuenta</span>
          </button>
          
          {showLogin && (
            <form onSubmit={handleLogin} className="px-6 pb-6 space-y-3">
              {/* Inputs iguales... */}
              <button 
                type="submit"
                className="w-full bg-[#ec4899] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-md"
              >
                Entrar
              </button>
            </form>
          )}
        </div>

        {/* REGISTRO CLIENTA - BOTÓN ROSADO */}
        <div className="bg-white rounded-[32px] border-2 border-[#fbcfe8] overflow-hidden shadow-sm">
          <button 
            onClick={() => { setShowRegister(!showRegister); setShowLogin(false); setShowStaff(false); }}
            className="w-full p-5 flex items-center justify-center gap-3 text-[#ec4899]"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest text-center">Crea tu cuenta</span>
          </button>

          {showRegister && (
            <form onSubmit={handleRegister} className="px-6 pb-6 space-y-3">
              {/* Inputs iguales... */}
              <button 
                type="submit"
                className="w-full bg-[#ec4899] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-md"
              >
                Registrarme
              </button>
            </form>
          )}
        </div>

        {/* ACCESO STAFF - Este es el único que se queda sobrio/oscuro */}
        <div className="pt-4">
          <button 
            onClick={() => { setShowStaff(!showStaff); setShowLogin(false); setShowRegister(false); }}
            className="w-full p-3 flex items-center justify-center gap-2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <Hash className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Acceso Team Cute</span>
          </button>

          {showStaff && (
            <form onSubmit={handleAdminLogin} className="mt-4 px-6 pb-6 space-y-3 bg-white rounded-[32px] border border-gray-100 p-6 shadow-inner">
               <input 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none border border-gray-100" 
                type="email" 
                placeholder="Correo Admin"
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <input 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-[11px] outline-none border border-gray-100" 
                type="password" 
                placeholder="Clave"
                onChange={(e) => setAdminPass(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-gray-800 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest"
              >
                Entrar al Panel
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
