// Asegúrate de que tu LoginPage.jsx tenga esta estructura
return (
  // El fondo se aplica al body, este contenedor ayuda a centrar
  <div className="login-container"> 
    <div className="glass-card"> {/* La tarjeta blanca */}
      <h1>TheCute</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" className="input-luxury" required />
        <input type="password" placeholder="Contraseña" className="input-luxury" required />
        <button type="submit" className="btn-luxury">Ingresar</button>
      </form>
      <p className="switch-text">¿No tienes cuenta? Regístrate</p>
    </div>
  </div>
);
