"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

// ✅ CORREÇÃO: Função GA simplificada e segura
function enviarEvento(evento: string, props: Record<string, any> = {}) {
  try {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", evento, props);
      console.log('Evento GA4 enviado:', evento, props);
    }
  } catch (error) {
    console.warn('Erro ao enviar evento GA4:', error);
  }
}

export default function HomePageOptimized() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [spotsLeft] = useState(Math.floor(Math.random() * 15) + 8)
  const pageLoadTimeRef = useRef(Date.now())

  // ✅ CORREÇÃO: useEffect simplificado e seguro
  useEffect(() => {
    try {
      // Evento de page view simples
      enviarEvento("page_view_optimized", {
        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
        timestamp: new Date().toISOString()
      });

      // Status online/offline
      const updateOnlineStatus = () => {
        const online = navigator.onLine;
        setIsOnline(online);
        enviarEvento('status_conexao', { status: online ? 'online' : 'offline' });
      };

      if (typeof window !== "undefined") {
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        return () => {
          window.removeEventListener("online", updateOnlineStatus);
          window.removeEventListener("offline", updateOnlineStatus);
        };
      }
    } catch (error) {
      console.warn('Erro no useEffect inicial:', error);
    }
  }, []);

  // ✅ CORREÇÃO: handleStart com tratamento de erro robusto
  const handleStart = useCallback(async () => {
    if (isLoading || !isOnline) {
      enviarEvento('clicou_cta_desabilitado', {
        motivo: isLoading ? 'loading' : 'offline'
      });
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProgress(20);

      enviarEvento("clicou_cta_principal", {
        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
        timestamp: new Date().toISOString()
      });

      // ✅ CORREÇÃO: Loading mais rápido e confiável
      let progress = 20;
      const interval = setInterval(() => {
        progress += 40; // Incremento maior para ser mais rápido
        setLoadingProgress(Math.min(progress, 100));

        if (progress >= 100) {
          clearInterval(interval);
          
          // ✅ CORREÇÃO: Navegação com tratamento de erro
          setTimeout(() => {
            try {
              let url = "/quiz/1";
              
              if (typeof window !== "undefined" && window.location.search) {
                const params = new URLSearchParams(window.location.search);
                const utms = new URLSearchParams();

                for (const [key, value] of params) {
                  if (key.startsWith("utm_")) {
                    utms.set(key, value);
                  }
                }

                if (utms.toString()) {
                  url += `?${utms.toString()}`;
                }
              }

              console.log('Navegando para:', url);
              router.push(url);
              
            } catch (error) {
              console.error('Erro na navegação:', error);
              // Fallback: navegação simples
              window.location.href = "/quiz/1";
            }
          }, 200);
        }
      }, 50); // 50ms = loading total ~150ms

    } catch (error) {
      console.error('Erro no handleStart:', error);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }, [isLoading, isOnline, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      
      {/* ✅ CORREÇÃO: Loading overlay simplificado */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center text-white max-w-md">
            <div className="text-xl font-bold mb-4">
              Preparando tu análisis personalizado...
            </div>
            <div className="text-sm text-orange-400 mb-6">
              ⚠️ Spot #{Math.floor(Math.random() * 23 + 77)} de 100 reservado
            </div>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ CONTAINER PRINCIPAL */}
      <div className="text-center max-w-4xl mx-auto">
        
        {/* ✅ HEADLINE PRINCIPAL */}
        <div className="mb-12">
          <h1 className="font-black leading-tight mb-6 text-4xl md:text-6xl lg:text-7xl">
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
          
          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl font-light">
            El test psicológico que lo revela en 2 minutos
          </p>
        </div>

        {/* ✅ CTA PRINCIPAL - SIMPLIFICADO */}
        <div className="mb-8">
          <button 
            onClick={handleStart} 
            disabled={isLoading || !isOnline} 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black px-8 py-4 text-lg md:text-xl rounded-full shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full max-w-md"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                PREPARANDO...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                HACER EL TEST AHORA
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </div>

        {/* ✅ ELEMENTOS DE URGÊNCIA */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-300 text-sm font-medium">
              Solo {spotsLeft} spots disponibles hoy
            </span>
          </div>

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
    </div>
  )
}