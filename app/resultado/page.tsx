"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  ArrowRight,
  Check,
  Clock,
  Users,
  Heart,
  Star,
  Zap,
  Target,
  MessageCircle,
  Lock,
  Unlock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"
import { enviarEvento } from "../../lib/analytics" // Importa a função de analytics centralizada

// 
// FUNÇÕES HELPER E DE TRACKING (ROBUSTAS E CENTRALIZADAS)
// 

// ✅ LISTA COMPLETA de parâmetros de tracking
const ALL_TRACKING_PARAMS_LIST = [
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

// ✅ Função para verificar se um parâmetro é de tracking
function isTrackingParam(key: string): boolean {
  return ALL_TRACKING_PARAMS_LIST.some(param => key.toLowerCase().startsWith(param.toLowerCase()));
}

// ✅ Função segura para localStorage - GET
function safeLocalStorageGet(key: string): any | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed;
    }
  } catch (error) {
    console.error(`❌ [RESULT - ERROR] localStorage[${key}] corrompido, removendo:`, error);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error('❌ [RESULT - ERROR] Erro ao remover item corrompido:', e);
    }
  }
  return null;
}

// ✅ Função segura para localStorage - SET
function safeLocalStorageSet(key: string, value: any) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (value === undefined || value === null) {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`❌ [RESULT - ERROR] Erro ao salvar localStorage[${key}]:`, error);
    // Não limpa todo o cache aqui, apenas loga o erro.
    // A limpeza de cache mais agressiva é feita no quiz step se necessário.
  }
}

// ✅ Função para capturar e salvar TODOS os parâmetros de tracking
function captureAndSaveTrackingParams() {
  if (typeof window === 'undefined') return {};
  
  try {
    const currentUrl = new URL(window.location.href);
    const capturedParams: { [key: string]: string } = {};
    
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (isTrackingParam(key)) {
        capturedParams[key] = decodeURIComponent(value);
        console.log(`✅ [RESULT - CAPTURE] Capturado da URL: ${key} = ${value}`);
      }
    }
    
    if (Object.keys(capturedParams).length > 0) {
      safeLocalStorageSet('capturedTrackingParams', capturedParams);
      console.log('✅ [RESULT - BACKUP] Parâmetros salvos no localStorage:', capturedParams);
    }
    
    return capturedParams;
    
  } catch (error) {
    console.error('❌ [RESULT - ERROR] Erro ao capturar parâmetros:', error);
    return {};
  }
}

// ✅ Função para recuperar parâmetros do backup
function getTrackingParamsFromLocalStorage(): { [key: string]: string } {
  if (typeof window === 'undefined') return {};
  
  try {
    const backup = safeLocalStorageGet('capturedTrackingParams');
    if (backup && typeof backup === 'object') {
      console.log('📦 [RESULT - FALLBACK] Parâmetros recuperados do localStorage:', backup);
      return backup;
    }
  } catch (error) {
    console.error('❌ [RESULT - ERROR] Erro ao recuperar backup:', error);
  }
  
  return {};
}

// ✅ Função para construir a query string completa com todos os parâmetros de tracking
function buildTrackingQueryString(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    let trackingParams: { [key: string]: string } = {};

    // 1. Tenta pegar da URL atual
    const currentUrl = new URL(window.location.href);
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (isTrackingParam(key)) {
        trackingParams[key] = decodeURIComponent(value);
      }
    }

    // 2. Se não encontrou nada na URL, usa o backup do localStorage
    if (Object.keys(trackingParams).length === 0) {
      trackingParams = getTrackingParamsFromLocalStorage();
    }

    const queryParts: string[] = [];
    Object.entries(trackingParams).forEach(([key, value]) => {
      if (value && value.trim() !== '' && value.length < 200) { // Limite para evitar URLs muito longas
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });

    // ✅ Geração de xcod, sck e bid (baseado no formato do Hotmart)
    const utmSource = trackingParams['utm_source'] || trackingParams['fbclid'] || 'direct';
    const utmCampaign = trackingParams['utm_campaign'] || 'no_campaign';
    const utmMedium = trackingParams['utm_medium'] || 'no_medium';
    const utmContent = trackingParams['utm_content'] || 'no_content';
    const utmTerm = trackingParams['utm_term'] || 'no_term';

    // Formato Hotmart para xcod/sck: utm_source + hQwK21wXxR + utm_campaign + hQwK21wXxR + ...
    const xcodValue = `${utmSource}hQwK21wXxR${utmCampaign}hQwK21wXxR${utmMedium}hQwK21wXxR${utmContent}hQwK21wXxR${utmTerm}`;
    const sckValue = xcodValue; // Geralmente são iguais ou muito similares

    const bidValue = Date.now().toString(); // Timestamp único

    queryParts.push(`xcod=${encodeURIComponent(xcodValue)}`);
    queryParts.push(`sck=${encodeURIComponent(sckValue)}`);
    queryParts.push(`bid=${encodeURIComponent(bidValue)}`);

    const queryString = queryParts.join('&');
    
    console.log('🔗 [RESULT - QUERY] Query string gerada:', queryString);
    return queryString;

  } catch (error) {
    console.error('❌ [RESULT - ERROR] Erro ao construir query string de tracking:', error);
    return '';
  }
}

// 
// COMPONENTE PRINCIPAL
// 

export default function ResultPageFixed() {
  // ===== ESTADOS =====
  const [isLoaded, setIsLoaded] = useState(false)
  const [userGender, setUserGender] = useState<string>("")
  const [userAnswers, setUserAnswers] = useState<object>({})
  const [currentRevelation, setCurrentRevelation] = useState(0)
  const [showVSL, setShowVSL] = useState(false)
  const [showOffer, setShowOffer] = useState(false)
  const [showFinalCTA, setShowFinalCTA] = useState(false)
  const [decryptedText, setDecryptedText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(true)
  const [activeBuyers, setActiveBuyers] = useState(Math.floor(Math.random() * 5) + 8)
  const [isBrowser, setIsBrowser] = useState(false)

  // ===== REFS =====
  const contentRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())
  const decryptIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const revelationTrackedRef = useRef<Set<number>>(new Set())
  const scrollTrackedRef = useRef<Set<number>>(new Set())

  // ===== VERIFICAÇÃO DE AMBIENTE BROWSER E CAPTURA INICIAL DE PARÂMETROS =====
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined' && typeof document !== 'undefined');
    // ✅ NOVA: Captura e salva parâmetros de tracking na inicialização da página de resultado
    captureAndSaveTrackingParams();
  }, []);

  // ===== PERSONALIZAÇÃO BASEADA NO QUIZ =====
  useEffect(() => {
    if (!isBrowser) return;

    try {
      const savedGender = safeLocalStorageGet("userGender") || "";
      const savedAnswers = safeLocalStorageGet("quizAnswers") || {};
      
      if (!savedGender || Object.keys(savedAnswers).length === 0) {
        console.warn("⚠️ [RESULT - WARNING] Dados do quiz não encontrados no localStorage.");
        enviarEvento('aviso_dados_quiz_nao_encontrados', {
          timestamp: new Date().toISOString()
        });
      }
      
      setUserGender(savedGender);
      setUserAnswers(savedAnswers);

      setTimeout(() => setIsLoaded(true), 300);

      console.log('🔍 [RESULT - DEBUG] UTMs atuais na URL da página resultado:', window.location.search);
      console.log('🔗 [RESULT - DEBUG] Query string que será usada para checkout:', buildTrackingQueryString());

      enviarEvento("viu_resultado_dopamina_v4", {
        timestamp: new Date().toISOString(),
        user_gender: savedGender,
        version: "matrix_continuity",
        tem_dados_quiz: Object.keys(savedAnswers).length > 0,
        utm_params: window.location.search, // Log das UTMs da URL
        tracking_query_string: buildTrackingQueryString() // Log da query string completa
      });

      startTimeRef.current = Date.now();

      const interval = setInterval(() => {
        setActiveBuyers(prev => {
          const newValue = prev + Math.floor(Math.random() * 2) + 1;
          
          enviarEvento('contador_compradores_atualizado', {
            novo_valor: newValue,
            timestamp: new Date().toISOString()
          });
          
          return newValue;
        });
      }, 180000);

      return () => {
        clearInterval(interval);
        if (isBrowser) {
          const timeSpent = (Date.now() - startTimeRef.current) / 1000;
          enviarEvento('tempo_pagina_resultado_dopamina', {
            tempo_segundos: timeSpent,
            conversao: false,
            revelacoes_vistas: currentRevelation,
            viu_vsl: showVSL,
            viu_oferta: showOffer,
            viu_cta_final: showFinalCTA,
            version: "matrix_continuity",
            timestamp: new Date().toISOString()
          });
        }
      };
    } catch (error) {
      console.error("❌ [RESULT - ERROR] Erro na inicialização da página de resultado:", error);
      
      enviarEvento('erro_inicializacao_resultado', {
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    }
  }, [isBrowser, currentRevelation, showVSL, showOffer, showFinalCTA]);

  // ===== PROGRESSÃO AUTOMÁTICA DE REVELAÇÕES ===== 
  useEffect(() => {
    if (!isBrowser) return; // Garante que só roda no cliente

    try {
      if (decryptIntervalRef.current) {
        clearInterval(decryptIntervalRef.current);
      }

      decryptIntervalRef.current = setInterval(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        const randomText = Array.from({length: 30}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setDecryptedText(randomText);
      }, 100);

      const timers = [
        setTimeout(() => {
          if (decryptIntervalRef.current) {
            clearInterval(decryptIntervalRef.current);
            decryptIntervalRef.current = null;
          }
          setIsDecrypting(false);
          setDecryptedText("PLAN COMPLETO LIBERADO");
          setCurrentRevelation(1);
          
          if (!revelationTrackedRef.current.has(1)) {
            revelationTrackedRef.current.add(1);
            enviarEvento('viu_revelacao_1_codigo_incompleto', {
              numero_revelacao: 1,
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
          }
        }, 3000),
        
        setTimeout(() => {
          setShowVSL(true);
          setCurrentRevelation(2);
          
          if (!revelationTrackedRef.current.has(2)) {
            revelationTrackedRef.current.add(2);
            enviarEvento('viu_revelacao_2_vsl', {
              numero_revelacao: 2,
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
          }
        }, 6000),
        
        setTimeout(() => {
          setShowOffer(true);
          setCurrentRevelation(3);
          
          if (!revelationTrackedRef.current.has(3)) {
            revelationTrackedRef.current.add(3);
            enviarEvento('viu_revelacao_3_oferta', {
              numero_revelacao: 3,
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
          }
        }, 9000),
        
        setTimeout(() => {
          setShowFinalCTA(true);
          
          if (!revelationTrackedRef.current.has(4)) {
            revelationTrackedRef.current.add(4);
            enviarEvento('viu_revelacao_4_cta_final', {
              numero_revelacao: 4,
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
          }
        }, 12000),
      ];

      return () => {
        if (decryptIntervalRef.current) {
          clearInterval(decryptIntervalRef.current);
          decryptIntervalRef.current = null;
        }
        timers.forEach(clearTimeout);
      };
    } catch (error) {
      console.error("❌ [RESULT - ERROR] Erro na progressão de revelações:", error);
      
      enviarEvento('erro_progressao_revelacoes', {
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    }
  }, [isBrowser, userGender]);

  // ===== SCROLL TRACKING =====
  useEffect(() => {
    if (!isBrowser) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent % 25 === 0 && scrollPercent > 0 && !scrollTrackedRef.current.has(scrollPercent)) {
        scrollTrackedRef.current.add(scrollPercent);
        
        enviarEvento('scroll_resultado', {
          percentual_scroll: scrollPercent,
          timestamp: new Date().toISOString(),
          user_gender: userGender
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBrowser, userGender]);

  // ===== VSL VIDEO EMBED =====
  useEffect(() => {
    if (!showVSL || !isBrowser || !videoContainerRef.current) return;

    const timer = setTimeout(() => {
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = `
          <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #000; border-radius: 8px; overflow: hidden;">
            <vturb-smartplayer 
              id="vid-6938c3eeb96ec714286a4c2b" 
              style="display: block; margin: 0 auto; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
            ></vturb-smartplayer>
          </div>
        `;

        const videoElement = videoContainerRef.current.querySelector('vturb-smartplayer');
        if (videoElement) {
          videoElement.addEventListener('click', () => {
            enviarEvento('clicou_video_vsl', {
              numero_revelacao: 2,
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
          });
        }

        const existingScript = document.querySelector('script[src="https://scripts.converteai.net/ea3c2dc1-1976-40a2-b0fb-c5055f82bfaf/players/6938c3eeb96ec714286a4c2b/v4/player.js"]');
        
        if (!existingScript) {
          const s = document.createElement("script");
          s.src = "https://scripts.converteai.net/ea3c2dc1-1976-40a2-b0fb-c5055f82bfaf/players/6938c3eeb96ec714286a4c2b/v4/player.js";
          s.async = true;
          
          s.onload = () => {
            console.log("✅ [RESULT - VSL] Script VTurb carregado com sucesso!");
            
            enviarEvento('video_vsl_carregado_sucesso', {
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
          };
          
          s.onerror = () => {
            console.error("❌ [RESULT - VSL] Erro ao carregar script VTurb");
            
            enviarEvento('erro_carregar_video_vsl', {
              timestamp: new Date().toISOString(),
              user_gender: userGender
            });
            
            if (videoContainerRef.current) {
              videoContainerRef.current.innerHTML = `
                <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                  <p>Erro ao carregar vídeo. Tente recarregar a página.</p>
                  <button onclick="location.reload()" style="background: #ffc107; color: black; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Recarregar
                  </button>
                </div>
              `;
            }
          };
          
          document.head.appendChild(s);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [showVSL, isBrowser, userGender]);

  // ===== FUNÇÕES DE PERSONALIZAÇÃO =====
  const getPronoun = useCallback(() => userGender === "SOY MUJER" ? "él" : "ella", [userGender]);
  const getOtherPronoun = useCallback(() => userGender === "SOY MUJER" ? "lo" : "la", [userGender]);

  const getPersonalizedSituation = useCallback(() => {
    const situation = userAnswers?.question7 || "contacto limitado";
    if (typeof situation === 'string') {
      if (situation.includes("contacto cero")) return "Contacto cero";
      if (situation.includes("ignora")) return "Te ignora";
      if (situation.includes("bloqueado")) return "Bloqueado";
      if (situation.includes("cosas necesarias")) return "Solo cosas necesarias";
      if (situation.includes("charlamos")) return "Charlas ocasionales";
      if (situation.includes("amigos")) return "Solo amigos";
    }
    return "Contacto limitado";
  }, [userAnswers]);

  // ✅ CORREÇÃO: Função de compra com detecção assíncrona de bloqueio de popup
  const handlePurchase = useCallback((position = "principal") => {
    if (!isBrowser) return;

    try {
      const timeToAction = (Date.now() - startTimeRef.current) / 1000;
      
      // ✅ Construir URL com TODOS os parâmetros de tracking
      const trackingQueryString = buildTrackingQueryString();
      const baseCheckoutUrl = "https://pay.hotmart.com/F100142422S?off=efckjoa7&checkoutMode=10";
      const fullCheckoutUrl = `${baseCheckoutUrl}&${trackingQueryString}`; // Adiciona com '&' pois base já tem '?'
      
      console.log('🔗 [RESULT - CHECKOUT] URL final do checkout com tracking:', fullCheckoutUrl);
      
      enviarEvento("clicou_comprar_dopamina_v4", {
        posicao: position,
        revelacao_atual: currentRevelation,
        timestamp: new Date().toISOString(),
        user_gender: userGender,
        situacao: getPersonalizedSituation(),
        tempo_ate_acao: timeToAction,
        conversao: true,
        viu_vsl: showVSL,
        viu_oferta: showOffer,
        viu_cta_final: showFinalCTA,
        version: "matrix_continuity",
        utm_data: trackingQueryString // Incluir a query string completa no evento
      });
      
      enviarEvento('tempo_pagina_resultado_dopamina', {
        tempo_segundos: timeToAction,
        conversao: true,
        posicao_cta: position,
        version: "matrix_continuity",
        timestamp: new Date().toISOString(),
        checkout_url: fullCheckoutUrl // Log da URL para debug
      });
      
      // ✅ MELHORIA: Tenta abrir popup IMEDIATAMENTE (sem delay inicial)
      const paymentWindow = window.open(fullCheckoutUrl, "_blank");
      
      // ✅ MELHORIA: Verificação assíncrona em background para detectar bloqueio mais rápido
      setTimeout(() => {
        if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed == 'undefined') {
          console.error("❌ [RESULT - CHECKOUT] Popup bloqueado - redirecionamento imediato");
          
          enviarEvento('popup_bloqueado_resultado', {
            posicao: position,
            timestamp: new Date().toISOString(),
            checkout_url: fullCheckoutUrl
          });
          
          window.location.href = fullCheckoutUrl;
        }
      }, 100);
    } catch (error) {
      console.error("❌ [RESULT - ERROR] Erro na função de compra:", error);
      
      enviarEvento('erro_clicou_comprar', {
        posicao: position,
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    }
  }, [currentRevelation, userGender, getPersonalizedSituation, isBrowser, showVSL, showOffer, showFinalCTA]);

  // ===== FEEDBACK TÁTIL =====
  const handleTouchFeedback = useCallback(() => {
    if (isBrowser && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [isBrowser]);

  // ===== RENDERIZAÇÃO CONDICIONAL DE LOADING SCREEN (CRÍTICO PARA HIDRATAÇÃO) =====
  if (!isBrowser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-xl font-mono animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  // 
  // JSX PRINCIPAL
  // 
  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
      </head>

      <div className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw]">
        
        <div className="matrix-background w-full min-h-screen relative">
          
          <div className="matrix-bg-animation"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
            
            {/* ===== SEÇÃO 1: CONTINUIDADE DO CÓDIGO ===== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
              className="text-center mb-12"
              data-revelation="1"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-6">
                <span className="text-white">PLAN</span> <span className="text-green-500">RESULTADO</span>
              </h1>
              
              <div className="bg-gray-900/90 border-2 border-green-500 rounded-lg p-6 mb-8 font-mono">
                <div className="text-green-400 text-left mb-4">
                  <span className="text-gray-500">$</span> analizando_resultado_quiz.exe
                </div>
                <div className="text-green-400 text-sm mb-4">
                  {isDecrypting ? (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="break-all"
                    >
                      PROCESANDO DATOS... {decryptedText}
                    </motion.div>
                  ) : (
                    <div className="text-green-300 font-bold text-lg">
                      ✅ {decryptedText}
                    </div>
                  )}
                </div>
                
                {!isDecrypting && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-left space-y-2"
                  >
                    <div>→ SITUACIÓN: <span className="text-orange-400">{getPersonalizedSituation()}</span></div>
                    <div>→ PROBABILIDAD: <span className="text-green-400">89%</span></div>
                    <div>→ ESTADO: <span className="text-red-400">PLAN INCOMPLETO</span></div>
                    <div>→ PROGRESO: <span className="text-yellow-400">14% del método total</span></div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ===== REVELACIÓN 1: CÓDIGO INCOMPLETO ===== */}
            <AnimatePresence>
              {currentRevelation >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                  data-revelation="1"
                >
                  <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      {/* MUDANÇA 1 - SEÇÃO 2: NOVA COPY */}
                      <p className="text-white text-xl mb-6">
                        La verdad que nadie te cuenta:
                        <br /><br />
                        En los días 4-7, tu ex toma una decisión.
                        <br />
                        O cambiaste de verdad.
                        <br />
                        O eres el mismo de siempre.
                        <br /><br />
                        Si no sabes exactamente qué hacer...
                        <br />
                        Tu ex se alejará.
                        <br />
                        Para siempre.
                        <br /><br />
                        Pero si sabes...
                        <br />
                        Funciona en el 89% de los casos.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== REVELACIÓN 2: VSL COM VÍDEO CORRIGIDO ===== */}
            <AnimatePresence>
              {showVSL && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-12"
                  data-revelation="2"
                >
                  <div className="bg-blue-900/20 border-2 border-blue-500 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <Unlock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h2 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-4">
                        🔓 DESBLOQUEANDO PLAN COMPLETO
                      </h2>
                      <p className="text-white text-xl mb-6">
                        Vea los <strong className="text-blue-300">86% restantes</strong> del método que no viste
                      </p>
                    </div>

                    {/* ✅ CONTAINER DO VÍDEO COM dangerouslySetInnerHTML */}
                    <div className="max-w-3xl mx-auto mb-6">
                      <div 
                        ref={videoContainerRef}
                        className="w-full min-h-[300px] bg-black rounded-lg"
                      >
                        {/* O vídeo será inserido aqui via innerHTML */}
                      </div>
                    </div>
                    
                    <div className="text-center bg-green-900/30 rounded-lg p-4 border border-green-500">
                      <p className="text-green-300 font-bold">
                        <Check className="inline w-5 h-5 mr-2" />
                        Este video revela el plan completo para reconquistar a {getPronoun()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== REVELAÇÃO 3: OFERTA COMPLETA ===== */}
            <AnimatePresence>
              {showOffer && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                  data-revelation="3"
                >
                  <Card className="bg-black/80 text-white shadow-2xl border-yellow-400/50 border-2 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8 text-center">
                      
                      <div className="bg-yellow-400 text-black font-bold text-sm sm:text-base px-4 py-2 rounded-full inline-block mb-6">
                        PLAN COMPLETO: 21 DÍAS
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 text-white">
                        De $ 297 → $ 12,99
                      </h2>

                      {/* MUDANÇA 2 - SEÇÃO 4: NOVA COPY */}
                      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-6 mb-6 border border-green-500/50">
                        <div className="space-y-4 text-left">
                          <p className="text-white text-lg font-bold">📱 MÓDULO 1: Conversaciones (Días 1-7) - $97</p>
                          <p className="text-white text-lg font-bold">👥 MÓDULO 2: Encuentros (Días 8-14) - $127</p>
                          <p className="text-white text-lg font-bold">❤️ MÓDULO 3: Reconquista (Días 15-21) - $147</p>
                          <p className="text-white text-lg font-bold">🚨 MÓDULO 4: Protocolo de Emergencia - $197</p>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4 mt-6 text-center border border-yellow-500">
                          <p className="text-gray-300 text-sm line-through mb-2">VALOR TOTAL: $568</p>
                          <p className="text-green-400 font-bold text-xl sm:text-2xl mb-2">TU INVERSIÓN HOY: $12,99</p>
                        </div>
                      </div>

                      <p className="text-yellow-300 font-bold mobile-urgency-text mb-2">
                        ⏳ PERO ESPERA:
                      </p>
                      <p className="text-white text-base sm:text-lg mb-4">
                        Este precio es SOLO para quienes vieron el video.
                      </p>
                      <p className="text-red-300 mobile-small-text mb-2">
                        Después de 47 minutos: $67
                      </p>
                      <p className="text-red-300 mobile-small-text mb-4">
                        Después de 100 ventas: $297
                      </p>

                      <p className="text-green-400 font-bold mobile-urgency-text mb-2">
                        ✅ GARANTÍA 30 DÍAS
                      </p>
                      <p className="text-white text-base sm:text-lg mb-2">
                        Si no funciona, te devuelvo el 100% de tu dinero.
                      </p>
                      <p className="text-white text-base sm:text-lg mb-4">
                        Sin preguntas. Sin complicaciones.
                      </p>
                      <p className="text-white text-base sm:text-lg mb-6">
                        Porque estoy tan seguro de que funciona...
                        <br />
                        Que estoy dispuesto a apostar mi dinero en ti.
                      </p>

                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                        className="mb-6 w-full"
                      >
                        <Button
                          onClick={() => handlePurchase("oferta_principal_demostracion")}
                          size="lg"
                          className="mobile-cta-offer"
                          onTouchStart={handleTouchFeedback}
                        >
                          <MessageCircle className="mobile-icon-size mr-2 flex-shrink-0" />
                          <div className="text-center">
                            <div className="mobile-cta-offer-text leading-tight font-black">
                              📱 QUIERO EL PLAN COMPLETO
                            </div>
                            <div className="mobile-small-text mt-1 opacity-90">
                              Los 21 días completos, no solo los primeros 3
                            </div>
                          </div>
                        </Button>
                      </motion.div>

                      <div className="bg-red-900/80 mobile-urgency-padding rounded-lg mb-6 border border-red-500">
                        <p className="text-yellow-300 font-bold mobile-urgency-text mb-2">
                          ⏰ PRECIO ESPECIAL PARA QUIENES VIERON LA DEMOSTRACIÓN:
                        </p>
                        <div className="mobile-countdown font-black text-white mb-2">
                          <CountdownTimer minutes={47} seconds={0} />
                        </div>
                        <p className="text-red-300 mobile-small-text">
                          Después vuelve a $67. Solo para quienes completaron el análisis.
                        </p>
                      </div>
                      {/* A seção de prova social com o contador de compradores (activeBuyers) foi removida */}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== SEÇÃO 4: CTA FINAL IRRESISTÍVEL ===== */}
            <AnimatePresence>
              {showFinalCTA && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                  data-revelation="4"
                >
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-yellow-400">
                    
                    {/* MUDANÇA 3 - SEÇÃO 5: NOVA COPY */}
                    <p className="text-white text-base sm:text-lg mb-6 font-bold">
                      Tienes dos opciones:
                      <br /><br />
                      OPCIÓN 1: Cierras esta página.
                      <br />
                      Esperas a que tu ex vuelva solo.
                      <br />
                      En 6 meses, tu ex está con otra persona.
                      <br /><br />
                      OPCIÓN 2: Haces clic ahora.
                      <br />
                      En 7 días, tu ex va a estar diferente.
                      <br />
                      En 21 días, tu ex va a estar de vuelta.
                      <br />
                      O tu dinero de vuelta.
                    </p>

                    <p className="text-yellow-300 text-sm sm:text-base font-bold mb-2">
                      ---
                      <br />
                      ⏰ TIMER: 47 MINUTOS
                      <br />
                      Después, el precio sube.
                      <br />
                      ---
                    </p>

                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                      className="w-full mb-6"
                    >
                      <Button
                        onClick={() => handlePurchase("cta_final_demostracao")}
                        size="lg"
                        className="mobile-cta-final"
                        onTouchStart={handleTouchFeedback}
                      >
                        <div className="text-center">
                          <div className="mobile-cta-final-text leading-tight font-black">
                            🎬 SÍ, QUIERO RECUPERAR A MI EX AHORA
                          </div>
                          <div className="mobile-small-text mt-1 opacity-90">
                            Los 21 días completos para reconquistar a {getPronoun()}
                          </div>
                        </div>
                        <ArrowRight className="mobile-icon-size ml-2 flex-shrink-0" />
                      </Button>
                    </motion.div>

                    <p className="text-yellow-300 text-sm sm:text-base font-bold mt-4">
                      En 21 días, tu ex está de vuelta.
                      <br />
                      O tu dinero de vuelta.
                      <br />
                      Sin riesgo. Sin complicaciones.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* A seção de "GARANTÍA RÁPIDA" separada foi removida */}

          </div>
        </div>

        {/* ===== CSS GLOBAL ===== */}
        <style jsx global>{`
          * {
            box-sizing: border-box !important;
            max-width: 100% !important;
          }

          html {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            -webkit-text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          body {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          @keyframes matrix-fall {
            from { background-position: 0 0; }
            to { background-position: -1000px -1000px; }
          }
          .matrix-bg-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              rgba(0, 255, 0, 0.05) 1px,
              transparent 1px
            ), repeating-linear-gradient(
              to right,
              rgba(0, 255, 0, 0.05) 1px,
              transparent 1px
            );
            background-size: 20px 20px;
            animation: matrix-fall 10s linear infinite;
            opacity: 0.2;
            z-index: 0;
          }

          .mobile-padding {
            padding: clamp(1rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem);
          }

          .mobile-offer-padding {
            padding: clamp(1rem, 4vw, 2rem);
          }

          .mobile-urgency-padding {
            padding: clamp(0.75rem, 3vw, 1rem);
          }

          .mobile-guarantee-padding {
            padding: clamp(1rem, 4vw, 1.5rem);
          }

          .mobile-final-padding {
            padding: clamp(1rem, 4vw, 1.5rem);
          }

          .mobile-headline {
            font-size: clamp(1.5rem, 6vw, 3rem);
            line-height: 1.2;
            font-weight: 900;
          }

          .mobile-section-title {
            font-size: clamp(1.25rem, 5vw, 2rem);
            line-height: 1.3;
          }

          .mobile-subsection-title {
            font-size: clamp(1.125rem, 4vw, 1.5rem);
            line-height: 1.3;
          }

          .mobile-offer-title {
            font-size: clamp(1.5rem, 5vw, 2.5rem);
            line-height: 1.2;
          }

          .mobile-final-title {
            font-size: clamp(1.5rem, 5vw, 2rem);
            line-height: 1.2;
          }

          .mobile-guarantee-title {
            font-size: clamp(1.125rem, 4vw, 1.5rem);
            line-height: 1.3;
          }

          .mobile-description {
            font-size: clamp(1rem, 3vw, 1.125rem);
            line-height: 1.5;
          }

          .mobile-info-text {
            font-size: clamp(0.875rem, 3vw, 1rem);
            line-height: 1.4;
          }

          .mobile-small-text {
            font-size: clamp(0.75rem, 2.5vw, 0.875rem);
            line-height: 1.4;
          }

          .mobile-stats-number {
            font-size: clamp(1.25rem, 4vw, 1.5rem);
            line-height: 1.2;
          }

          .mobile-stats-text {
            font-size: clamp(0.75rem, 2.5vw, 0.875rem);
            line-height: 1.3;
          }

          .mobile-countdown {
            font-size: clamp(1.5rem, 5vw, 2rem);
            line-height: 1.2;
          }

          .mobile-urgency-text {
            font-size: clamp(0.875rem, 3vw, 1.125rem);
            line-height: 1.3;
          }

          .mobile-guarantee-text {
            font-size: clamp(1rem, 3vw, 1.125rem);
            line-height: 1.4;
          }

          .mobile-guarantee-desc {
            font-size: clamp(0.875rem, 3vw, 1rem);
            line-height: 1.4;
          }

          .mobile-final-subtitle {
            font-size: clamp(1rem, 3vw, 1.25rem);
            line-height: 1.4;
          }

          .mobile-final-warning {
            font-size: clamp(0.75rem, 2.5vw, 0.875rem);
            line-height: 1.3;
          }

          .mobile-icon-size {
            width: clamp(1.25rem, 4vw, 1.5rem);
            height: clamp(1.25rem, 4vw, 1.5rem);
          }

          .mobile-social-icon {
            width: clamp(0.75rem, 2.5vw, 1rem);
            height: clamp(0.75rem, 2.5vw, 1rem);
          }

          .mobile-shield-icon {
            width: clamp(3rem, 8vw, 4rem);
            height: clamp(3rem, 8vw, 4rem);
          }

          .mobile-border-yellow {
            border: clamp(2px, 1vw, 4px) solid rgb(250 204 21) !important;
          }

          .mobile-border-green {
            border: clamp(2px, 1vw, 4px) solid rgb(34 197 94) !important;
          }

          .mobile-cta-offer,
          .mobile-cta-final {
            width: 100% !important;
            box-sizing: border-box !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
            user-select: none !important;
            transition: all 0.3s ease !important;
          }

          .mobile-cta-offer {
            background: rgb(234 179 8) !important;
            color: black !important;
            font-weight: 900 !important;
            padding: clamp(1rem, 4vw, 1.5rem) clamp(1rem, 4vw, 2rem) !important;
            border-radius: 9999px !important;
            font-size: clamp(1.125rem, 4vw, 1.5rem) !important;
            border: clamp(2px, 1vw, 4px) solid white !important;
            min-height: clamp(3.75rem, 14vw, 4.5rem) !important;
            max-width: 32rem !important;
            margin: 0 auto !important;
          }

          .mobile-cta-final {
            background: rgb(234 179 8) !important;
            color: black !important;
            font-weight: 900 !important;
            padding: clamp(1rem, 4vw, 1.5rem) clamp(1rem, 4vw, 2rem) !important;
            border-radius: 9999px !important;
            font-size: clamp(1.125rem, 4vw, 1.5rem) !important;
            border: clamp(2px, 1vw, 4px) solid white !important;
            min-height: clamp(3.75rem, 14vw, 4.5rem) !important;
            max-width: 28rem !important;
            margin: 0 auto !important;
          }

          .mobile-cta-offer:hover,
          .mobile-cta-final:hover {
            background: rgb(202 138 4) !important;
            transform: scale(1.02) !important;
          }

          .mobile-cta-final:hover {
            transform: scale(1.05) !important;
          }

          .mobile-cta-offer-text,
          .mobile-cta-final-text {
            font-size: clamp(1rem, 3.5vw, 1.25rem) !important;
            line-height: 1.2 !important;
            font-weight: 800 !important;
          }

          .bg-gradient-to-r,
          .bg-gradient-to-br {
            will-change: transform !important;
            backface-visibility: hidden !important;
            transform: translateZ(0) !important;
          }

          .break-words {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
          }

          .break-all {
            word-break: break-all !important;
            overflow-wrap: anywhere !important;
          }

          img,
          video {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
          }

          .min-h-screen {
            max-width: 100vw !important;
            width: 100% !important;
          }

          .max-w-4xl {
            max-width: 100% !important;
            width: 100% !important;
          }

          @media (min-width: 640px) {
            .max-w-4xl { max-width: 56rem !important; }
            .max-w-3xl { max-width: 48rem !important; }
            .max-w-2xl { max-w: 42rem !important; }
            .max-w-md { max-w: 28rem !important; }
          }

          @media (prefers-color-scheme: dark) {
            .bg-green-50 {
              background-color: rgb(20 83 45) !important;
            }

            .text-green-800 {
              color: rgb(187 247 208) !important;
            }

            .text-green-700 {
              color: rgb(134 239 172) !important;
            }
          }

          @media (max-width: 375px) {
            .mobile-headline {
              font-size: 1.25rem !important;
            }

            .mobile-section-title {
              font-size: 1.125rem !important;
            }

            .mobile-offer-title {
              font-size: 1.25rem !important;
            }
          }

          @media (min-width: 640px) {
            .mobile-padding {
              padding: 2rem 1rem !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}