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
import { enviarEvento } from "../../lib/analytics"

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
  
  // ✅ CORREÇÃO CRÍTICA: Estados simplificados para o vídeo
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)
  const [forceReload, setForceReload] = useState(0) // Para forçar recarregamento

  const contentRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())
  
  // ✅ CORREÇÃO CRÍTICA: Refs para controle preciso
  const decryptIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const playerInstanceRef = useRef<any>(null)

  // ===== VERIFICAÇÃO DE AMBIENTE BROWSER =====
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined' && typeof document !== 'undefined')
  }, [])

  // ===== PERSONALIZAÇÃO BASEADA NO QUIZ =====
  useEffect(() => {
    if (!isBrowser) return

    try {
      const savedGender = localStorage.getItem("userGender") || ""
      const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "{}")
      
      setUserGender(savedGender)
      setUserAnswers(savedAnswers)

      setTimeout(() => setIsLoaded(true), 300)

      enviarEvento("viu_resultado_dopamina_v4", {
        timestamp: new Date().toISOString(),
        user_gender: savedGender,
        version: "matrix_continuity"
      })

      startTimeRef.current = Date.now()

      // Simular compradores em tempo real
      const interval = setInterval(() => {
        setActiveBuyers(prev => prev + Math.floor(Math.random() * 2) + 1)
      }, 45000)

      return () => {
        clearInterval(interval)
        if (isBrowser) {
          const timeSpent = (Date.now() - startTimeRef.current) / 1000
          enviarEvento('tempo_pagina_resultado_dopamina', {
            tempo_segundos: timeSpent,
            conversao: false,
            version: "matrix_continuity"
          })
        }
      }
    } catch (error) {
      console.error("Erro na inicialização:", error)
    }
  }, [isBrowser])

  // ===== PROGRESSÃO AUTOMÁTICA DE REVELAÇÕES ===== 
  useEffect(() => {
    try {
      // ✅ CORREÇÃO CRÍTICA DO LOOP: Limpeza adequada do interval
      if (decryptIntervalRef.current) {
        clearInterval(decryptIntervalRef.current)
      }

      // Animação de descriptografia inicial CONTROLADA
      decryptIntervalRef.current = setInterval(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        const randomText = Array.from({length: 30}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setDecryptedText(randomText);
      }, 100);

      // Sequência de revelações
      const timers = [
        setTimeout(() => {
          // ✅ CORREÇÃO CRÍTICA DO LOOP: Para o interval quando termina
          if (decryptIntervalRef.current) {
            clearInterval(decryptIntervalRef.current);
            decryptIntervalRef.current = null;
          }
          setIsDecrypting(false);
          setDecryptedText("CÓDIGO COMPLETO LIBERADO");
          setCurrentRevelation(1);
        }, 3000),
        
        setTimeout(() => {
          setShowVSL(true);
          setCurrentRevelation(2);
        }, 6000),
        
        setTimeout(() => {
          setShowOffer(true);
          setCurrentRevelation(3);
        }, 9000),
        
        setTimeout(() => {
          setShowFinalCTA(true);
        }, 12000),
      ]

      return () => {
        // ✅ CORREÇÃO CRÍTICA DO LOOP: Limpeza completa na desmontagem
        if (decryptIntervalRef.current) {
          clearInterval(decryptIntervalRef.current);
          decryptIntervalRef.current = null;
        }
        timers.forEach(clearTimeout);
      }
    } catch (error) {
      console.error("Erro na progressão de revelações:", error)
    }
  }, [])

  // ✅ CORREÇÃO CRÍTICA DO VÍDEO: Abordagem mais direta e simples
  useEffect(() => {
    if (!showVSL || !isBrowser) return

    const initializeVideo = () => {
      try {
        setVideoError(null)
        
        // ✅ LIMPA COMPLETAMENTE QUALQUER RESÍDUO ANTERIOR
        const existingScripts = document.querySelectorAll('script[src*="converteai.net"]')
        existingScripts.forEach(script => script.remove())
        
        // Limpa window.smartplayer se existir
        if (typeof window !== 'undefined') {
          // @ts-ignore
          delete window.smartplayer
          // @ts-ignore  
          delete window.vturb
        }

        if (!videoContainerRef.current) return

        // ✅ FORÇA LIMPEZA TOTAL DO CONTAINER
        videoContainerRef.current.innerHTML = ''
        
        // ✅ AGUARDA UM POUCO PARA GARANTIR LIMPEZA
        setTimeout(() => {
          if (!videoContainerRef.current) return

          // ✅ CRIA O ELEMENTO VTURB DE FORMA MAIS SIMPLES
          const playerId = `vid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          
          videoContainerRef.current.innerHTML = `
            <div style="width: 100%; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
              <vturb-smartplayer 
                id="vid-692ef1c85df8a7aaec7c6000" 
                data-setup='{"autoplay":false,"controls":true}'
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
              ></vturb-smartplayer>
            </div>
          `

          // ✅ CARREGA O SCRIPT COM DELAY MAIOR
          setTimeout(() => {
            const script = document.createElement("script")
            script.src = "https://scripts.converteai.net/15be01a4-4462-4736-aeb9-b95eda21b8b8/players/692ef1c85df8a7aaec7c6000/v4/player.js"
            script.async = true
            
            script.onload = () => {
              console.log("Script VSL carregado com sucesso")
              
              // ✅ AGUARDA MAIS TEMPO PARA INICIALIZAÇÃO COMPLETA
              setTimeout(() => {
                setIsVideoReady(true)
                
                // ✅ FORÇA REFRESH DO PLAYER SE NECESSÁRIO
                setTimeout(() => {
                  const vturbElement = document.getElementById('vid-692ef1c85df8a7aaec7c6000')
                  if (vturbElement && !vturbElement.querySelector('iframe, video')) {
                    console.log("Forçando reload do player...")
                    setForceReload(prev => prev + 1)
                  }
                }, 3000)
              }, 2000) // 2 segundos para garantir inicialização
            }
            
            script.onerror = (error) => {
              console.error("Erro ao carregar script VSL:", error)
              setVideoError("Erro ao carregar o vídeo. Tentando novamente...")
              
              // ✅ RETRY AUTOMÁTICO EM CASO DE ERRO
              setTimeout(() => {
                setForceReload(prev => prev + 1)
              }, 2000)
            }
            
            document.head.appendChild(script)
          }, 500) // Delay antes de carregar o script
          
        }, 200) // Delay após limpeza
        
      } catch (error) {
        console.error("Erro na inicialização do vídeo:", error)
        setVideoError("Erro inesperado. Tentando novamente...")
        setTimeout(() => setForceReload(prev => prev + 1), 1000)
      }
    }

    initializeVideo()
  }, [showVSL, isBrowser, forceReload])

  // ===== FUNÇÕES DE PERSONALIZAÇÃO =====
  const getPronoun = useCallback(() => userGender === "SOY MUJER" ? "él" : "ella", [userGender])
  const getOtherPronoun = useCallback(() => userGender === "SOY MUJER" ? "lo" : "la", [userGender])

  const getPersonalizedSituation = useCallback(() => {
    const situation = userAnswers?.question7 || "contacto limitado"
    if (typeof situation === 'string') {
      if (situation.includes("contacto cero")) return "Contacto cero"
      if (situation.includes("ignora")) return "Te ignora"
      if (situation.includes("bloqueado")) return "Bloqueado"
      if (situation.includes("cosas necesarias")) return "Solo cosas necesarias"
      if (situation.includes("charlamos")) return "Charlas ocasionales"
      if (situation.includes("amigos")) return "Solo amigos"
    }
    return "Contacto limitado"
  }, [userAnswers])

  // ===== FUNÇÃO DE COMPRA OTIMIZADA =====
  const handlePurchase = useCallback((position = "principal") => {
    if (!isBrowser) return

    try {
      const timeToAction = (Date.now() - startTimeRef.current) / 1000
      
      enviarEvento("clicou_comprar_dopamina_v4", {
        posicao: position,
        revelacao_atual: currentRevelation,
        timestamp: new Date().toISOString(),
        user_gender: userGender,
        situacao: getPersonalizedSituation(),
        tempo_ate_acao: timeToAction,
        conversao: true,
        version: "matrix_continuity"
      })
      
      enviarEvento('tempo_pagina_resultado_dopamina', {
        tempo_segundos: timeToAction,
        conversao: true,
        version: "matrix_continuity"
      })
      
      setTimeout(() => {
        window.open("https://pay.hotmart.com/F100142422S?off=efckjoa7&checkoutMode=10", "_blank")
      }, 100)
    } catch (error) {
      console.error("Erro na função de compra:", error)
    }
  }, [currentRevelation, userGender, getPersonalizedSituation, isBrowser])

  // ===== FEEDBACK TÁTIL =====
  const handleTouchFeedback = useCallback(() => {
    if (isBrowser && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }, [isBrowser])

  // ===== FUNÇÃO PARA RETRY MANUAL =====
  const handleRetryVideo = () => {
    setVideoError(null)
    setIsVideoReady(false)
    setForceReload(prev => prev + 1)
  }

  // ===== COMPONENTE DE VÍDEO OTIMIZADO =====
  const VideoPlayer = () => {
    if (!isBrowser || !showVSL) {
      return null
    }

    if (videoError) {
      return (
        <div className="flex items-center justify-center h-64 bg-red-900/30 rounded-lg text-white border border-red-500">
          <div className="text-center p-4">
            <p className="text-red-300 mb-3">⚠️ {videoError}</p>
            <button 
              onClick={handleRetryVideo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden">
        <div 
          ref={videoContainerRef}
          className="w-full min-h-[300px] flex items-center justify-center"
        >
          {!isVideoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg text-white z-20">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="mb-2">Cargando video...</p>
                <p className="text-sm text-gray-400">Esto puede tomar unos segundos</p>
              </div>
            </div>
          )}
        </div>
        
        {/* ✅ BOTÃO DE RETRY SEMPRE VISÍVEL */}
        <div className="absolute bottom-2 right-2 z-30">
          <button 
            onClick={handleRetryVideo}
            className="bg-black/50 hover:bg-black/70 text-white px-2 py-1 rounded text-xs transition-colors"
            title="Recargar video"
          >
            🔄
          </button>
        </div>
      </div>
    )
  }

  if (!isBrowser) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando...</div>
  }

  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
      </head>

      <div className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw]">
        
        {/* ===== TRANSIÇÃO MATRIX DO QUIZ ===== */}
        <div className="matrix-background w-full min-h-screen relative">
          
          {/* Background Matrix Effect */}
          <div className="matrix-bg-animation"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
            
            {/* ===== SEÇÃO 1: CONTINUIDADE DO CÓDIGO ===== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-6">
                <span className="text-white">CÓDIGO</span> <span className="text-green-500">RESULTADO</span>
              </h1>
              
              {/* Terminal de Código */}
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
                    <div>→ ESTADO: <span className="text-red-400">CÓDIGO INCOMPLETO</span></div>
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
                >
                  <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <h2 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">
                        🚨 ACCESO DENEGADO
                      </h2>
                      <p className="text-white text-xl mb-6">
                        El código que viste era solo el <strong className="text-red-300">14%</strong> del método completo
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-green-900/30 rounded-lg p-4 border border-green-500">
                        <h4 className="text-green-400 font-bold mb-3">✅ LO QUE YA TIENES:</h4>
                        <ul className="text-white space-y-2 text-sm">
                          <li>→ Primer mensaje (Día 1)</li>
                          <li>→ Respuesta simulada</li>
                          <li>→ Follow-up básico</li>
                          <li>→ Análisis inicial</li>
                        </ul>
                        <div className="bg-green-800/30 rounded p-2 mt-3">
                          <p className="text-green-300 text-xs font-bold">Solo 14% del código</p>
                        </div>
                      </div>
                      
                      <div className="bg-red-900/30 rounded-lg p-4 border border-red-500">
                        <h4 className="text-red-400 font-bold mb-3">❌ CÓDIGO FALTANTE:</h4>
                        <ul className="text-white space-y-2 text-sm">
                          <li>→ Días 2-21 del método</li>
                          <li>→ Protocolo anti-rechazo</li>
                          <li>→ Estrategias de emergencia</li>
                          <li>→ Scripts para cada situación</li>
                        </ul>
                        <div className="bg-red-800/30 rounded p-2 mt-3">
                          <p className="text-red-300 text-xs font-bold">86% del código bloqueado</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center bg-yellow-900/30 rounded-lg p-4 border border-yellow-500">
                      <p className="text-yellow-300 font-bold">
                        <Zap className="inline w-5 h-5 mr-2" />
                        Sin el código completo, fallarás en la semana 2
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== REVELACIÓN 2: VSL ESTRATÉGICO (VÍDEO SUPER OTIMIZADO) ===== */}
            <AnimatePresence>
              {showVSL && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-12"
                >
                  <div className="bg-blue-900/20 border-2 border-blue-500 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <Unlock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h2 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-4">
                        🔓 DESBLOQUEANDO CÓDIGO COMPLETO
                      </h2>
                      <p className="text-white text-xl mb-6">
                        Vea los <strong className="text-blue-300">86% restantes</strong> del método que no viste
                      </p>
                    </div>

                    {/* ✅ CORREÇÃO CRÍTICA DO VÍDEO: Container super otimizado */}
                    <div className="max-w-3xl mx-auto mb-6">
                      <div className="relative bg-black rounded-xl p-4 border-2 border-blue-500 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-xl animate-pulse"></div>
                        
                        <div className="relative z-10">
                          <VideoPlayer />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center bg-green-900/30 rounded-lg p-4 border border-green-500">
                      <p className="text-green-300 font-bold">
                        <Check className="inline w-5 h-5 mr-2" />
                        Este video revela el código completo para reconquistar a {getPronoun()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== RESTO DO CÓDIGO IGUAL... ===== */}
            {/* ===== REVELACIÓN 3: OFERTA IRRESISTÍVEL ===== */}
            <AnimatePresence>
              {showOffer && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <Card className="bg-black/80 text-white shadow-2xl border-yellow-400/50 border-2 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8 text-center">
                      
                      <div className="bg-yellow-400 text-black font-bold text-sm sm:text-base px-4 py-2 rounded-full inline-block mb-6">
                        📱 PLAN A COMPLETO: DEL CÓDIGO DEMO A LA RECONQUISTA REAL
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 text-white">
                        LOS 21 DÍAS COMPLETOS PARA RECUPERAR A {getPronoun().toUpperCase()}
                      </h2>

                      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-6 mb-6 border border-green-500/50">
                        <h3 className="text-green-400 font-bold text-lg sm:text-xl mb-4">
                          🎁 MÉTODO COMPLETO DIVIDIDO EN MÓDULOS:
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-400 text-left">
                            <h4 className="text-blue-400 font-bold mb-2 text-base sm:text-lg">
                              <MessageCircle className="inline w-4 h-4 mr-2" />
                              MÓDULO 1: CONVERSACIONES (Días 1-7)
                            </h4>
                            <p className="text-white text-sm mb-2">→ El código que viste + 6 escenarios adicionales</p>
                            <p className="text-white text-sm mb-2">→ ¿Qué hacer si no responde? ¿Si responde seco? ¿Si te deja en visto?</p>
                            <p className="text-gray-400 text-xs">Valor: $97</p>
                          </div>
                          
                          <div className="bg-purple-900/30 rounded-lg p-4 border-l-4 border-purple-400 text-left">
                            <h4 className="text-purple-400 font-bold mb-2 text-base sm:text-lg">
                              <Users className="inline w-4 h-4 mr-2" />
                              MÓDULO 2: ENCUENTROS (Días 8-14)
                            </h4>
                            <p className="text-white text-sm mb-2">→ Del chat al encuentro real</p>
                            <p className="text-white text-sm mb-2">→ Scripts exactos para cada tipo de encuentro</p>
                            <p className="text-gray-400 text-xs">Valor: $127</p>
                          </div>
                          
                          <div className="bg-orange-900/30 rounded-lg p-4 border-l-4 border-orange-400 text-left">
                            <h4 className="text-orange-400 font-bold mb-2 text-base sm:text-lg">
                              <Heart className="inline w-4 h-4 mr-2" />
                              MÓDULO 3: RECONQUISTA (Días 15-21)
                            </h4>
                            <p className="text-white text-sm mb-2">→ Del encuentro a la relación oficial</p>
                            <p className="text-white text-sm mb-2">→ Protocolo anti-rechazo + Plan de relación 2.0</p>
                            <p className="text-gray-400 text-xs">Valor: $147</p>
                          </div>
                          
                          <div className="bg-red-900/30 rounded-lg p-4 border-l-4 border-red-400 text-left">
                            <h4 className="text-red-400 font-bold mb-2 text-base sm:text-lg">
                              <Target className="inline w-4 h-4 mr-2" />
                              MÓDULO 4: PROTOCOLO DE EMERGENCIA
                            </h4>
                            <p className="text-white text-sm mb-2">→ ¿Qué hacer si {getPronoun()} está con otra persona?</p>
                            <p className="text-white text-sm mb-2">→ Técnicas avanzadas para casos "imposibles"</p>
                            <p className="text-gray-400 text-xs">Valor: $197</p>
                          </div>
                        </div>
                        
                        <div className="bg-black/50 rounded-lg p-4 mt-6 text-center border border-yellow-500">
                          <p className="text-gray-300 text-sm line-through mb-2">Valor Total: $568</p>
                          <p className="text-green-400 font-bold text-xl sm:text-2xl mb-2">Tu inversión HOY: $12,99</p>
                          <p className="text-yellow-300 text-sm font-bold">96% de descuento solo por haber visto la vista previa</p>
                        </div>
                      </div>

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
                              📱 QUIERO EL CÓDIGO COMPLETO
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

                      <div className="flex justify-center items-center space-x-4 text-gray-300 text-sm flex-wrap gap-2">
                        <div className="flex items-center">
                          <Users className="mobile-social-icon text-green-400 mr-1" />
                          <span><strong className="text-white">{activeBuyers}</strong> personas compraron hoy</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="mobile-social-icon text-red-400 mr-1" />
                          <span><strong className="text-white">87%</strong> ya vio resultados</span>
                        </div>
                      </div>
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
                >
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-yellow-400">
                    
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
                      ⚡ ÚLTIMO AVISO - COMPLETA EL CÓDIGO EN LA VIDA REAL
                    </h2>
                    
                    <p className="text-white text-base sm:text-lg mb-6 font-bold">
                      Viste cómo funciona en el ejemplo práctico. Ahora hazlo realidad con {getPronoun()}.
                    </p>
                    
                    <div className="bg-yellow-600/20 border border-yellow-400 rounded-lg p-4 mb-6">
                      <p className="text-yellow-300 text-base font-bold mb-2">
                        🎬 EL CÓDIGO DEMOSTRÓ LOS DÍAS 1-3:
                      </p>
                      <p className="text-white text-sm sm:text-base">
                        Ahora necesitas los días 4-21 para completar la reconquista real. 
                        ¿Vale la pena $12,99 recuperar a quien amas?
                      </p>
                    </div>

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
                            🎬 SÍ, QUIERO COMPLETAR AHORA
                          </div>
                          <div className="mobile-small-text mt-1 opacity-90">
                            Los 21 días completos para reconquistar a {getPronoun()}
                          </div>
                        </div>
                        <ArrowRight className="mobile-icon-size ml-2 flex-shrink-0" />
                      </Button>
                    </motion.div>

                    <p className="text-yellow-300 text-sm sm:text-base font-bold">
                      El ejemplo práctico fue perfecto. Ahora hazlo realidad antes de que sea tarde.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== SEÇÃO 5: GARANTIA RÁPIDA ===== */}
            <AnimatePresence>
              {showFinalCTA && ( // Mostra a garantia junto com o CTA final
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <Card className="bg-green-50 border-green-500 border-2 shadow-2xl">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 mb-4">
                        GARANTÍA INCONDICIONAL DE 30 DÍAS
                      </h2>
                      
                      <p className="text-green-700 text-base sm:text-lg font-bold mb-4">
                        Si el método completo no funciona mejor que el ejemplo práctico, te devuelvo el 100% de tu dinero
                      </p>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                        <p className="text-green-800 text-sm sm:text-base font-semibold">
                          <strong>Mi promesa personal:</strong> Si sigues los 21 días completos del Plan A y no ves 
                          progreso real con {getPronoun()}, no solo te devuelvo el dinero, te doy una consulta personal 
                          gratuita para revisar tu caso específico.
                        </p>
                      </div>
                      
                      <p className="text-green-600 text-xs sm:text-sm mt-4">
                        Tienes 30 días completos para probarlo. La demostración fue solo el inicio.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          </div> {/* Fim do max-w-4xl */}
        </div> {/* Fim do matrix-background */}

        {/* ===== CSS GLOBAL (MANTIDO IGUAL) ===== */}
        <style jsx global>{`
          /* Reset e Base Mobile-First */
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

          /* Matrix Background Effect */
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

          /* ✅ CORREÇÃO CRÍTICA: CSS FORÇADO PARA O VÍDEO */
          vturb-smartplayer {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 0 auto !important;
            position: relative !important;
            z-index: 1 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            contain: layout style paint !important;
          }

          /* ✅ FORÇA O PLAYER A FICAR NO CONTAINER */
          vturb-smartplayer iframe,
          vturb-smartplayer video {
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            border-radius: 8px !important;
          }

          /* Padding e Spacing */
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

          /* CSS para Vídeo */
          .mobile-video-padding {
            padding: clamp(0.5rem, 2vw, 1rem);
          }

          .mobile-video-container {
            width: 100% !important;
            max-width: 100% !important;
            position: relative !important;
            overflow: hidden !important;
            border-radius: clamp(0.5rem, 2vw, 1rem) !important;
          }

          .mobile-border-orange {
            border: clamp(1px, 0.5vw, 2px) solid rgb(249 115 22);
          }

          /* Tipografia */
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

          /* Ícones */
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

          /* Bordas */
          .mobile-border-yellow {
            border: clamp(2px, 1vw, 4px) solid rgb(250 204 21) !important;
          }

          .mobile-border-green {
            border: clamp(2px, 1vw, 4px) solid rgb(34 197 94) !important;
          }

          /* Botões */
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

          /* Performance */
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            will-change: transform !important;
            backface-visibility: hidden !important;
            transform: translateZ(0) !important;
          }

          /* Texto */
          .break-words {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
          }

          .break-all {
            word-break: break-all !important;
            overflow-wrap: anywhere !important;
          }

          /* Imagens */
          img,
          video {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
          }

          /* Container limits */
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
            .max-w-2xl { max-width: 42rem !important; }
            .max-w-md { max-width: 28rem !important; }
          }

          /* Dark mode compatibility */
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

          /* Mobile pequeno */
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
  )
}