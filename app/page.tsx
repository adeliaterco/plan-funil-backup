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
  const [spotsLeft] = useState(Math.floor(Math.random() * 15) + 8)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus, { passive: true })
    window.addEventListener("offline", updateOnlineStatus, { passive: true })

    const timer = setTimeout(() => {
      enviarEvento("page_view_optimized", {
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        version: "finis_inspired_clean_v2"
      })
    }, 1000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  const handleStart = useCallback(() => {
    if (isLoading || !isOnline) return

    setIsLoading(true)
    setLoadingProgress(20)

    enviarEvento("quiz_start_optimized", {
      version: "finis_inspired_clean_v2",
      spots_left: spotsLeft
    })

    let progress = 20
    const interval = setInterval(() => {
      progress += 30
      setLoadingProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

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
    }, 100)
  }, [isLoading, isOnline, router, spotsLeft])

  return (
    <>
      {/* ✅ FUNDO PRETO LIMPO - SEM EFEITOS */}
      <div 
        className="min-h-screen overflow-x-hidden w-full max-w-[100vw] flex flex-col items-center justify-center relative"
        style={{ backgroundColor: '#000000' }}
      >
        
        {/* Loading overlay */}
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


        {/* ✅ CONTAINER PRINCIPAL */}
        <div className="text-center max-w-4xl mx-auto px-6">
          
          {/* ✅ HEADLINE PRINCIPAL */}
          <div className="mb-12">
            <h1 className="font-black leading-tight mb-6" style={{
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
              lineHeight: '1.1'
            }}>
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
            
            {/* ✅ SUBTÍTULO */}
            <p className="text-gray-300 font-light" style={{
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)'
            }}>
              El test psicológico que lo revela en 2 minutos
            </p>
          </div>

          {/* ✅ CTA PRINCIPAL */}
          <div className="mb-8">
            <button 
              onClick={handleStart} 
              disabled={isLoading || !isOnline} 
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/20 hover:border-white/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                padding: 'clamp(1rem, 4vw, 1.5rem) clamp(1.5rem, 6vw, 3rem)',
                maxWidth: '90vw'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  PREPARANDO...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  HACER EL TEST AHORA
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          {/* ✅ ELEMENTOS DE URGÊNCIA */}
          <div className="space-y-3">
            
            {/* Escassez */}
            <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-300 text-sm font-medium">
                Solo {spotsLeft} spots disponibles hoy
              </span>
            </div>

            {/* Prova social */}
            <div className="text-gray-400 text-sm">
              ✅ +12,847 personas ya conocen la verdad sobre su ex
            </div>
          </div>
        </div>

        {/* ✅ INDICADOR DE CONEXÃO */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
            ⚠️ Sin conexión - Conéctate para continuar
          </div>
        )}

        {/* ✅ CSS LIMPO - SEM EFEITOS PROBLEMÁTICOS */}
        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: #000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          /* Hover sutil no CTA */
          button:hover:not(:disabled) {
            box-shadow: 0 0 30px rgba(249, 115, 22, 0.2);
          }

          /* Responsividade */
          @media (max-width: 640px) {
            .max-w-4xl {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }

          @media (max-width: 480px) {
            button {
              width: 100% !important;
            }
          }
        `}</style>
      </div>
    </>
  )
}