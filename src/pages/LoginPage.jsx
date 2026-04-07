// ... (mismos imports de antes)

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [accessKey, setAccessKey] = useState(''); // Nueva pieza del rompecabezas
  // ... (otros estados igual)

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      // 1. Validar si la llave existe (si escribió algo)
      let finalRole = 'client';
      if (accessKey.trim() !== "") {
        const { data: keyData } = await supabase
          .from('access_keys')
          .select('*')
          .eq('key_value', accessKey)
          .single();
        
        if (keyData) {
          finalRole = 'staff';
        } else {
          alert("Esa llave no es válida. Te registraremos como clienta.");
        }
      }

      // 2. Crear el usuario en Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) alert(error.message);
      else {
        // 3. Guardar en Profiles con el ROL AUTOMÁTICO ✨
        await supabase.from('profiles').insert([
          { 
            id: data.user.id, 
            full_name: fullName, 
            phone: phone, 
            role: finalRole, // Aquí se asigna solo
            security_question: question,
            security_answer: answer.toLowerCase().trim()
          }
        ]);
        alert(`¡Bienvenida al Team! Rol asignado: ${finalRole} ✨`);
        navigate(finalRole === 'staff' ? '/team' : '/');
      }
    } else {
      // ... (Login normal igual al anterior)
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={logoStyle}>Martha Cute Studio</h1>
        
        <form onSubmit={handleAuth}>
          {/* ... inputs de Nombre, Teléfono, Correo, Clave ... */}

          {isRegistering && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <p style={{ fontSize: '11px', color: '#888' }}>¿Eres del Team Cute? Pon tu llave aquí:</p>
              <input 
                style={{...inputStyle, borderColor: '#ff85a1'}} 
                placeholder="Llave TeamCute (Opcional)" 
                onChange={e => setAccessKey(e.target.value)} 
              />
            </div>
          )}

          {/* ... resto del formulario ... */}
        </form>
      </div>
    </div>
  );
}
