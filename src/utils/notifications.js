export const sonarBrillitos = () => {
  // Cambia este link por la ruta de tu archivo real
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3'); 
  audio.volume = 0.5; // Para que no aturda
  audio.play().catch(error => console.log("El navegador bloqueó el audio inicial:", error));
};
