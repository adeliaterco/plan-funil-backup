"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const enviarEvento = (() => {
  let queue = []
  let timeout

  return (evento, props = {}) => {
    queue.push({ evento, props })
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (typeof window !== "undefined" && window.gtag && queue.length) {
        queue.forEach(({ evento, props }) => {
          window.gtag("event", evento, props)
        })
        queue = []
      }
    }, 500)
  }
})()

export default function HomePageOptimized() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [spotsLeft] = useState(Math.floor(Math.random() * 15) + 8) // 8-22 spots

  // Detecção de conexão minimalista
  useEffect(() => {
    if (typeof window === "undefined") return

    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus, { passive: true })
    window.addEventListener("offline", updateOnlineStatus, { passive: true })

    // Tracking inicial
    const timer = setTimeout(() => {
      enviarEvento("page_view_optimized", {
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        version: "finis_inspired_v1"
      })
    }, 1000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Função de início ultra-otimizada
  const handleStart = useCallback(() => {
    if (isLoading || !isOnline) return

    setIsLoading(true)
    setLoadingProgress(20)

    enviarEvento("quiz_start_optimized", {
      version: "finis_inspired_v1",
      spots_left: spotsLeft
    })

    let progress = 20
    const interval = setInterval(() => {
      progress += 15
      setLoadingProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Preservar UTMs
        let url = "/quiz/1"
        if (typeof window !== "undefined" && window.location.search) {
          const params = new URLSearchParams(window.location.search)
          const utms = new URLSearchParams()

          for (const [key, value] of params) {
            if (key.startsWith("utm_")) utms.set(key, value)
          }

          if (utms.toString()) url += `?${utms.toString()}`
        }

        router.push(url)
      }
    }, 200)
  }, [isLoading, isOnline, router, spotsLeft])

  return (
    <>
      {/* ✅ INSPIRAÇÃO FINIS: FUNDO PRETO TOTAL */}
      <div className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw] flex flex-col items-center justify-center relative">
        
        {/* Loading overlay - INSPIRAÇÃO FINIS */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="text-center text-white">
              <div className="text-xl font-bold mb-4">
                Preparando tu análisis personalizado...
              </div>
              <div className="text-sm text-orange-400 mb-6">
                ⚠️ Spot #{Math.floor(Math.random() * 23 + 77)} de 100 reservado
              </div>
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ✅ LOGO PEQUENO - INSPIRAÇÃO FINIS (canto superior) */}
        <div className="absolute top-6 left-6">
          <div className="text-orange-500 font-bold text-lg tracking-wider">
            PLAN <span className="text-white">/</span> <span className="text-red-500">A</span>
          </div>
        </div>

        {/* ✅ CONTAINER PRINCIPAL - INSPIRAÇÃO FINIS */}
        <div className="text-center max-w-4xl mx-auto px-6">
          
          {/* ✅ HEADLINE PRINCIPAL - INSPIRAÇÃO FINIS */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <div className="text-white mb-2">
                Descubre si ella
              </div>
              <div className="text-orange-500 mb-2">
                sigue pensando
              </div>
              <div className="text-red-500">
                en ti
              </div>
            </h1>
            
            {/* ✅ SUBTÍTULO MÍNIMO - INSPIRAÇÃO FINIS */}
            <p className="text-gray-300 text-xl sm:text-2xl font-light">
              El test psicológico que lo revela en 2 minutos
            </p>
          </div>

          {/* ✅ CTA GIGANTE - INSPIRAÇÃO FINIS */}
          <div className="mb-8">
            <button 
              onClick={handleStart} 
              disabled={isLoading || !isOnline} 
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-xl sm:text-2xl px-12 sm:px-16 py-6 sm:py-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/20 hover:border-white/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  PREPARANDO...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  HACER EL TEST AHORA
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          {/* ✅ ELEMENTOS DE URGÊNCIA MÍNIMOS - INSPIRAÇÃO FINIS */}
          <div className="space-y-3">
            
            {/* Escassez sutil */}
            <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-300 text-sm font-medium">
                Solo {spotsLeft} spots disponibles hoy
              </span>
            </div>

            {/* Prova social mínima */}
            <div className="text-gray-400 text-sm">
              ✅ +12,847 personas ya conocen la verdad sobre su ex
            </div>
          </div>
        </div>

        {/* ✅ INDICADOR DE CONEXÃO - INSPIRAÇÃO FINIS */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
            ⚠️ Sin conexión - Conéctate para continuar
          </div>
        )}

        {/* ✅ CSS GLOBAL - INSPIRAÇÃO FINIS */}
        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: #000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          /* Animação sutil para o fundo */
          @keyframes subtle-pulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.2; }
          }

          .bg-black {
            background: radial-gradient(circle at 50% 50%, rgba(15, 15, 15, 1) 0%, rgba(0, 0, 0, 1) 100%);
            animation: subtle-pulse 8s ease-in-out infinite;
          }

          /* Efeito hover no CTA */
          button:hover {
            box-shadow: 0 0 50px rgba(249, 115, 22, 0.3);
          }

          /* Responsividade extrema */
          @media (max-width: 640px) {
            h1 {
              font-size: 2.5rem !important;
              line-height: 1.1 !important;
            }
            
            button {
              font-size: 1.25rem !important;
              padding: 1.25rem 2rem !important;
              width: 100% !important;
              max-width: 320px !important;
            }
          }

          @media (max-width: 480px) {
            h1 {
              font-size: 2rem !important;
            }
            
            button {
              font-size: 1.125rem !important;
              padding: 1rem 1.5rem !important;
            }
          }
        `}</style>
      </div>
    </>
  )
}