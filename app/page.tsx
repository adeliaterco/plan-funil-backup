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

// ✅ NOVA: Função para capturar e salvar TODOS os parâmetros de tracking
function captureAllTrackingParams() {
  if (typeof window === 'undefined') return {};
  
  try {
    const currentUrl = new URL(window.location.href);
    const capturedParams = {};
    
    // ✅ LISTA COMPLETA de parâmetros de tracking (Facebook, Google, UTMs, etc.)
    const trackingParams = [
      // UTMs tradicionais
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      // Facebook
      'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source',
      // Google
      'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
      // Microsoft/Bing
      'msclkid',
      // Twitter
      'twclid',
      // LinkedIn
      'li_fat_id',
      // TikTok
      'ttclid',
      // Instagram
      'igshid',
      // Snapchat
      'sclid',
      // Outros parâmetros comuns
      'ref', 'source', 'medium', 'campaign', 'term', 'content',
      'adgroup', 'keyword', 'placement', 'network', 'device', 'creative',
      'matchtype', 'adposition', 'feeditemid', 'targetid'
    ];
    
    // Captura TODOS os parâmetros de tracking encontrados
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (trackingParams.some(param => key.toLowerCase().startsWith(param.toLowerCase())) || 
          key.toLowerCase().includes('utm') || 
          key.toLowerCase().includes('clid') || 
          key.toLowerCase().includes('campaign') || 
          key.toLowerCase().includes('source')) {
        capturedParams[key] = decodeURIComponent(value);
        console.log(`✅ [TRACKING] Capturado: ${key} = ${value}`);
      }
    }
    
    // Salva no localStorage como backup
    if (Object.keys(capturedParams).length > 0) {
      localStorage.setItem('capturedTrackingParams', JSON.stringify(capturedParams));
      console.log('✅ [BACKUP] Parâmetros salvos no localStorage:', capturedParams);
    }
    
    return capturedParams;
    
  } catch (error) {
    console.error('❌ [ERROR] Erro ao capturar parâmetros:', error);
    return {};
  }
}

// ✅ NOVA: Função para recuperar parâmetros do backup
function getTrackingParamsFromBackup() {
  if (typeof window === 'undefined') return {};
  
  try {
    const backup = localStorage.getItem('capturedTrackingParams');
    if (backup) {
      const parsed = JSON.parse(backup);
      console.log('✅ [BACKUP] Parâmetros recuperados do localStorage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ [ERROR] Erro ao recuperar backup:', error);
  }
  
  return {};
}

// ✅ NOVA: Função para construir URL com todos os parâmetros
function buildUrlWithAllParams(baseUrl: string) {
  try {
    // Primeiro: tenta pegar da URL atual
    let trackingParams = captureAllTrackingParams();
    
    // Segundo: se não encontrou nada, usa o backup
    if (Object.keys(trackingParams).length === 0) {
      trackingParams = getTrackingParamsFromBackup();
      console.log('📦 [FALLBACK] Usando backup do localStorage');
    }
    
    // Terceiro: constrói a URL final
    if (Object.keys(trackingParams).length > 0) {
      const params = new URLSearchParams(trackingParams);
      const finalUrl = `${baseUrl}?${params.toString()}`;
      
      console.log('🔗 [URL FINAL] Navegando para:', finalUrl);
      console.log('📊 [PARAMS] Total de parâmetros preservados:', Object.keys(trackingParams).length);
      
      return finalUrl;
    }
    
    console.log('⚠️ [WARNING] Nenhum parâmetro de tracking encontrado');
    return baseUrl;
    
  } catch (error) {
    console.error('❌ [ERROR] Erro ao construir URL:', error);
    return baseUrl;
  }
}

export default function HomePageOptimized() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [spotsLeft] = useState(Math.floor(Math.random() * 15) + 8)
  const pageLoadTimeRef = useRef(Date.now())

  // ✅ CORREÇÃO: useEffect com captura inicial de parâmetros
  useEffect(() => {
    try {
      // ✅ NOVA: Captura parâmetros logo na inicialização
      captureAllTrackingParams();
      
      // Evento de page view simples
      enviarEvento("page_view_optimized", {
        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
        timestamp: new Date().toISOString(),
        url_params: typeof window !== "undefined" ? window.location.search : ''
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

  // ✅ CORREÇÃO CRÍTICA: handleStart com captura COMPLETA de parâmetros
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

      // ✅ NOVA: Log detalhado do que está sendo capturado
      console.log('🚀 [START] Iniciando captura de parâmetros...');
      console.log('📍 [URL ATUAL]', window.location.href);

      enviarEvento("clicou_cta_principal", {
        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
        timestamp: new Date().toISOString(),
        url_original: typeof window !== "undefined" ? window.location.href : ''
      });

      // ✅ CORREÇÃO: Loading mais rápido e confiável
      let progress = 20;
      const interval = setInterval(() => {
        progress += 40;
        setLoadingProgress(Math.min(progress, 100));

        if (progress >= 100) {
          clearInterval(interval);
          
          // ✅ CORREÇÃO CRÍTICA: Navegação com captura COMPLETA
          setTimeout(() => {
            try {
              // ✅ NOVA: Usa a função robusta para construir URL
              const finalUrl = buildUrlWithAllParams("/quiz/1");
              
              console.log('🎯 [NAVIGATION] URL final construída:', finalUrl);
              router.push(finalUrl);
              
            } catch (error) {
              console.error('❌ [ERROR] Erro na navegação:', error);
              
              // ✅ FALLBACK: Tenta construir URL simples
              try {
                const backupParams = getTrackingParamsFromBackup();
                const backupUrl = Object.keys(backupParams).length > 0 
                  ? `/quiz/1?${new URLSearchParams(backupParams).toString()}`
                  : "/quiz/1";
                
                console.log('🆘 [FALLBACK] Usando URL de backup:', backupUrl);
                window.location.href = backupUrl;
              } catch (fallbackError) {
                console.error('❌ [FALLBACK ERROR] Erro no fallback:', fallbackError);
                window.location.href = "/quiz/1";
              }
            }
          }, 200);
        }
      }, 50);

    } catch (error) {
      console.error('❌ [ERROR] Erro no handleStart:', error);
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