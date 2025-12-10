/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ CORREÇÃO: Configuração para mobile
  experimental: {
    optimizeCss: false,
    forceSwcTransforms: true
  },
  // ✅ CORREÇÃO: Desabilitar alguns recursos problemáticos
  swcMinify: false,
  compiler: {
    removeConsole: false
  }
}

module.exports = nextConfig