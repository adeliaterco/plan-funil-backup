// lib/analytics.js
export function enviarEvento(nome_evento, propriedades = {}) {
  // Verifica se o gtag está disponível (só funciona no navegador, não durante SSR)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', nome_evento, propriedades);
    console.log('Evento enviado:', nome_evento, propriedades);
  }
}
