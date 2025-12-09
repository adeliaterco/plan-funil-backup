"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  ArrowRight,
  Check,
  Clock,
  Users,
  Heart,
  Play,
  Star,
  TrendingUp,
  Zap,
  Target,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"
import { enviarEvento } from "../../lib/analytics"

export default function ResultPageExplosive() {
  // ===== ESTADOS =====
  const [isLoaded, setIsLoaded] = useState(false)
  const [userGender, setUserGender] = useState<string>("")
  const [userAnswers, setUserAnswers] = useState<object>({})
  const [recentBuyers, setRecentBuyers] = useState(7)
  const [currentStep, setCurrentStep] = useState(1)
  const [activeBuyers, setActiveBuyers] = useState(Math.floor(Math.random() * 10) + 15)
  const [activeMessages, setActiveMessages] = useState(Math.floor(Math.random() * 5) + 3)
  const [activeResponses, setActiveResponses] = useState(Math.floor(Math.random() * 3) + 1)
  const contentRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())

  // ===== PERSONALIZAÇÃO BASEADA NO QUIZ =====
  useEffect(() => {
    const savedGender = localStorage.getItem("userGender") || ""
    const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "{}")
    
    setUserGender(savedGender)
    setUserAnswers(savedAnswers)

    setTimeout(() => setIsLoaded(true), 300)

    // Simular compradores
    const interval = setInterval(() => {
      setRecentBuyers(prev => Math.min(prev + Math.floor(Math.random() * 2) + 1, 31))
      setActiveBuyers(prev => prev + Math.floor(Math.random() * 2) + 1)
      setActiveMessages(prev => prev + Math.floor(Math.random() * 2))
      setActiveResponses(prev => prev + Math.floor(Math.random() * 2))
    }, 35000)

    // ✅ GA4 EVENT: Viu resultado otimizado
    enviarEvento("viu_resultado_otimizado_v3", {
      timestamp: new Date().toISOString(),
      user_gender: savedGender,
      version: "demonstration_continuity"
    })

    // Iniciar o contador de tempo na página
    startTimeRef.current = Date.now()

    // Carregar script Vturb
    loadVTurbScript()

    return () => {
      clearInterval(interval)
      // ✅ GA4 EVENT: Tempo na página ao sair
      const timeSpent = (Date.now() - startTimeRef.current) / 1000
      enviarEvento('tempo_pagina_resultado_v3', {
        tempo_segundos: timeSpent,
        conversao: false,
        version: "demonstration_continuity"
      })
    }
  }, [])

  // ===== PROGRESSÃO AUTOMÁTICA DE STEPS (6 SEGUNDOS CADA) =====
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(2), 6000),   // 6s
      setTimeout(() => setCurrentStep(3), 12000),  // +6s
      setTimeout(() => setCurrentStep(4), 18000),  // +6s
      setTimeout(() => setCurrentStep(5), 24000),  // +6s
      setTimeout(() => setCurrentStep(6), 30000),  // +6s
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  // ===== CARREGAR SCRIPT VTURB =====
  const loadVTurbScript = () => {
    if (!document.querySelector('script[src*="692ef1c85df8a7aaec7c6000"]')) {
      const script = document.createElement("script")
      script.src = "https://scripts.converteai.net/15be01a4-4462-4736-aeb9-b95eda21b8b8/players/692ef1c85df8a7aaec7c6000/v4/player.js"
      script.async = true
      document.head.appendChild(script)
    }
  }

  // ===== FUNÇÕES DE PERSONALIZAÇÃO =====
  const getPronoun = () => userGender === "SOY MUJER" ? "él" : "ella"
  const getOtherPronoun = () => userGender === "SOY MUJER" ? "lo" : "la"
  const getOtherWord = () => userGender === "SOY MUJER" ? "otro" : "otra"

  const getPersonalizedSituation = () => {
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
  }

  const getPersonalizedTimeframe = () => {
    const timeframe = userAnswers?.question3 || "1-3 meses"
    return timeframe
  }

  // ===== FUNÇÃO DE COMPRA OTIMIZADA =====
  const handlePurchase = (position = "principal") => {
    const timeToAction = (Date.now() - startTimeRef.current) / 1000
    
    // ✅ GA4 EVENT: Clicou comprar
    enviarEvento("clicou_comprar_otimizado_v3", {
      posicao: position,
      step_atual: currentStep,
      timestamp: new Date().toISOString(),
      user_gender: userGender,
      situacao: getPersonalizedSituation(),
      tempo_ate_acao: timeToAction,
      conversao: true,
      version: "demonstration_continuity"
    })
    
    // ✅ GA4 EVENT: Tempo na página com conversão
    enviarEvento('tempo_pagina_resultado_v3', {
      tempo_segundos: timeToAction,
      conversao: true,
      version: "demonstration_continuity"
    })
    
    setTimeout(() => {
      window.open("https://pay.hotmart.com/F100142422S?off=efckjoa7&checkoutMode=10", "_blank")
    }, 100)
  }

  // ===== FEEDBACK TÁTIL =====
  const handleTouchFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden w-full max-w-[100vw]">
        
        {/* ===== SEÇÃO 1: TRANSIÇÃO EMOCIONAL OTIMIZADA ===== */}
        <div className="mobile-padding bg-gradient-to-r from-orange-900/20 to-red-900/20 w-full">
          <div className="max-w-4xl mx-auto w-full">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              className="text-center mb-8"
            >
              <h1 className="mobile-headline text-white mb-4 leading-tight break-words">
                🔥 <span className="text-orange-400">🚨 CONFIRMADO:</span> Tienes 89% de probabilidad de recuperarla
              </h1>
              <p className="mobile-description text-gray-300 mb-6 break-words">
                PERO la demostración que viste fue solo solo el <strong>DÍA 1 de 21</strong>...
                <br />
                Sin los próximos <strong>20 días</strong> del método, fallarás en la semana 2."
              </p>
            </motion.div>

            {/* ANÁLISIS RÁPIDO DE SITUACIÓN */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl p-6 mb-8 border-2 border-orange-500/50">
              <h3 className="text-orange-400 font-bold mobile-subsection-title mb-4 break-words text-center">
                📊 TU SITUACIÓN ESPECÍFICA ANALIZADA:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mobile-info-text">
                <div className="space-y-2">
                  <p>→ <strong>Tiempo separados:</strong> <span className="text-orange-300">{getPersonalizedTimeframe()}</span></p>
                  <p>→ <strong>Situación actual:</strong> <span className="text-orange-300">{getPersonalizedSituation()}</span></p>
                </div>
                <div className="space-y-2">
                  <p>→ <strong>Probabilidad de éxito:</strong> <span className="text-green-400 font-bold">89%</span></p>
                  <p>→ <strong>Días necesarios:</strong> <span className="text-orange-400 font-bold">21 días completos</span></p>
                </div>
              </div>
              
              <div className="bg-orange-900/40 rounded-lg p-4 mt-4 border-l-4 border-orange-400 text-center">
                <p className="text-orange-200 font-bold break-words">
                  La conversación que viste fue exitosa, pero es solo el <strong>PRIMER PASO</strong> del proceso completo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEÇÃO 2: REVELAR O ICEBERG ===== */}
        <div className="mobile-padding bg-gradient-to-r from-gray-900 to-black w-full">
          <div className="max-w-4xl mx-auto w-full">
            
            <h2 className="mobile-section-title font-bold text-white text-center mb-8 break-words">
              🧊 <span className="text-yellow-400">LA DEMOSTRACIÓN FUE SOLO</span> LA PUNTA DEL ICEBERG
            </h2>
            
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-6 mb-8 border-2 border-orange-500/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 rounded-lg p-4 border-l-4 border-green-400">
                  <h4 className="text-green-400 font-bold mb-3 mobile-subsection-title">✅ LO QUE YA VISTE:</h4>
                  <ul className="text-white mobile-info-text space-y-2">
                    <li>→ <strong>Día 1-3:</strong> Primer mensaje optimizado</li>
                    <li>→ <strong>Respuesta de {getPronoun()}:</strong> Simulada en tiempo real</li>
                    <li>→ <strong>Tu follow-up:</strong> Estratégico y calculado</li>
                    <li>→ <strong>Análisis:</strong> Probabilidad de éxito 89%</li>
                  </ul>
                  <div className="bg-green-900/30 rounded-lg p-2 mt-3">
                    <p className="text-green-300 text-sm font-bold">Solo el 14% del método completo</p>
                  </div>
                </div>
                
                <div className="bg-red-900/30 rounded-lg p-4 border-l-4 border-red-400">
                  <h4 className="text-red-400 font-bold mb-3 mobile-subsection-title">❓ LO QUE FALTA:</h4>
                  <ul className="text-white mobile-info-text space-y-2">
                    <li>→ <strong>Días 4-7:</strong> ¿Qué si no responde?</li>
                    <li>→ <strong>Días 8-14:</strong> ¿Qué si responde mal?</li>
                    <li>→ <strong>Días 15-21:</strong> ¿Cómo cerrar la reconquista?</li>
                    <li>→ <strong className="text-red-300">¿Y SI {getPronoun().toUpperCase()} ESTÁ CON {getOtherWord().toUpperCase()} PERSONA?</strong></li>
                  </ul>
                  <div className="bg-red-800/30 rounded-lg p-2 mt-3">
                    <p className="text-red-300 text-sm font-bold">El 86% más crítico del proceso</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-orange-900/30 rounded-lg p-4 border border-orange-500">
                <p className="text-orange-300 font-bold mobile-description">
                  <Zap className="inline w-5 h-5 mr-2" />
                  La vista previa que viste representa SOLO el 14% del método completo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEÇÃO 3: URGÊNCIA BASEADA NA DEMOSTRAÇÃO ===== */}
        <div className="mobile-padding w-full">
          <div className="max-w-4xl mx-auto w-full">
            
            <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-6 mb-8">
              <h3 className="text-red-400 font-bold text-center mb-4 mobile-subsection-title">
                ⏰ MIENTRAS VEÍAS EL EJEMPLO PRÁCTICO...
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
                <motion.div 
                  className="bg-black/30 rounded-lg p-4 border border-red-400/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-red-300 font-bold text-xl">{activeBuyers}</div>
                  <div className="text-gray-300 mobile-small-text">hombres compraron el Plan A</div>
                </motion.div>
                <motion.div 
                  className="bg-black/30 rounded-lg p-4 border border-yellow-400/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="text-yellow-300 font-bold text-xl">{activeMessages}</div>
                  <div className="text-gray-300 mobile-small-text">ya enviaron el primer mensaje</div>
                </motion.div>
                <motion.div 
                  className="bg-black/30 rounded-lg p-4 border border-green-400/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <div className="text-green-300 font-bold text-xl">{activeResponses}</div>
                  <div className="text-gray-300 mobile-small-text">ya recibieron respuesta</div>
                </motion.div>
              </div>
              
              <p className="text-white text-center font-bold mobile-info-text">
                Mientras tú decides, otros están aplicando el método completo. 
                <span className="text-red-300"> ¿Vas a dejar que te adelanten con {getPronoun()}?</span>
              </p>
            </div>
          </div>
        </div>

        {/* ===== SEÇÃO 4: VÍDEO PRINCIPAL ===== */}
        <div className="mobile-padding bg-gradient-to-r from-gray-900 to-black w-full">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="mobile-section-title font-bold text-white mb-4 max-w-full break-words">
                🎯 <span className="text-orange-400">DESCUBRE</span> QUÉ PASA DESPUÉS DEL ENSAYO PRÁCTICO
              </h2>
              
              <div className="max-w-2xl mx-auto mb-6 w-full">
                <p className="mobile-description text-gray-300 mb-4 break-words">
                  Los próximos 18 días del método que no viste en la vista previa:
                </p>
              </div>
            </div>

            {/* VSL CENTRALIZADA COM VTURB */}
            <div className="flex justify-center mb-6 sm:mb-8 w-full">
              <div className="w-full max-w-3xl">
                <div className="relative bg-black rounded-xl sm:rounded-2xl mobile-video-padding mobile-border-orange shadow-2xl w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl sm:rounded-2xl animate-pulse"></div>
                  <div className="relative z-10 w-full mobile-video-container">
                    <vturb-smartplayer 
                      id="vid-692ef1c85df8a7aaec7c6000" 
                      className="mobile-vturb-player"
                    ></vturb-smartplayer>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE PROGRESSO */}
            <AnimatePresence>
              {currentStep < 3 && (
                <div className="text-center mb-8 max-w-md mx-auto">
                  <div className="text-gray-300 mobile-small-text mb-3 break-words font-semibold">
                    ⏳ DESBLOQUEANDO LOS 18 DÍAS RESTANTES DEL MÉTODO...
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 max-w-md mx-auto overflow-hidden border border-orange-500">
                    <motion.div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                      animate={{ width: ["14%", "100%"] }}
                      transition={{ duration: 6, ease: "linear" }}
                    />
                  </div>
                  <p className="text-gray-400 mobile-small-text mt-3 break-words italic">
                    De los 3 días demostrados a los 21 días completos...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===== SEÇÃO 5: OFERTA COMPLETAMENTE REPAGINADA ===== */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mobile-padding bg-gradient-to-r from-orange-600 to-red-600 w-full"
            >
              <div className="max-w-4xl mx-auto w-full">
                
                <Card className="bg-black/80 text-white shadow-2xl mobile-border-yellow w-full backdrop-blur-sm">
                  <CardContent className="mobile-offer-padding text-center w-full">
                    
                    <div className="bg-yellow-400 text-black font-bold mobile-offer-badge rounded-full inline-block mb-6">
                      📱 PLAN A COMPLETO: DEL EJEMPLO PRÁCTICO A LA RECONQUISTA REAL
                    </div>

                    <h2 className="mobile-offer-title font-black mb-6 text-white break-words">
                      LOS 21 DÍAS COMPLETOS PARA RECUPERAR A {getPronoun().toUpperCase()}
                    </h2>

                    <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-6 mb-6 border border-green-500/50">
                      <h3 className="text-green-400 font-bold mobile-subsection-title mb-4 break-words">
                        🎁 MÉTODO COMPLETO DIVIDIDO EN MÓDULOS:
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-400 text-left">
                          <h4 className="text-blue-400 font-bold mb-2 mobile-info-text">
                            <MessageCircle className="inline w-4 h-4 mr-2" />
                            MÓDULO 1: CONVERSACIONES (Días 1-7)
                          </h4>
                          <p className="text-white mobile-small-text mb-2">→ El ejemplo práctico que viste + 6 escenarios adicionales</p>
                          <p className="text-white mobile-small-text mb-2">→ ¿Qué hacer si no responde? ¿Si responde seco? ¿Si te deja en visto?</p>
                          <p className="text-gray-400 text-xs">Valor: $97</p>
                        </div>
                        
                        <div className="bg-purple-900/30 rounded-lg p-4 border-l-4 border-purple-400 text-left">
                          <h4 className="text-purple-400 font-bold mb-2 mobile-info-text">
                            <Users className="inline w-4 h-4 mr-2" />
                            MÓDULO 2: ENCUENTROS (Días 8-14)
                          </h4>
                          <p className="text-white mobile-small-text mb-2">→ De la conversación virtual al encuentro real</p>
                          <p className="text-white mobile-small-text mb-2">→ Scripts exactos para cada tipo de encuentro</p>
                          <p className="text-gray-400 text-xs">Valor: $127</p>
                        </div>
                        
                        <div className="bg-orange-900/30 rounded-lg p-4 border-l-4 border-orange-400 text-left">
                          <h4 className="text-orange-400 font-bold mb-2 mobile-info-text">
                            <Heart className="inline w-4 h-4 mr-2" />
                            MÓDULO 3: RECONQUISTA (Días 15-21)
                          </h4>
                          <p className="text-white mobile-small-text mb-2">→ Del encuentro a la relación oficial</p>
                          <p className="text-white mobile-small-text mb-2">→ Protocolo anti-rechazo + Plan de relación 2.0</p>
                          <p className="text-gray-400 text-xs">Valor: $147</p>
                        </div>
                        
                        <div className="bg-red-900/30 rounded-lg p-4 border-l-4 border-red-400 text-left">
                          <h4 className="text-red-400 font-bold mb-2 mobile-info-text">
                            <Target className="inline w-4 h-4 mr-2" />
                            MÓDULO 4: PROTOCOLO DE EMERGENCIA
                          </h4>
                          <p className="text-white mobile-small-text mb-2">→ ¿Qué hacer si {getPronoun()} está con otra persona?</p>
                          <p className="text-white mobile-small-text mb-2">→ Técnicas avanzadas para casos "imposibles"</p>
                          <p className="text-gray-400 text-xs">Valor: $197</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/50 rounded-lg p-4 mt-6 text-center border border-yellow-500">
                        <p className="text-gray-300 mobile-small-text line-through mb-2">Valor Total: $568</p>
                        <p className="text-green-400 font-bold mobile-description mb-2">Tu inversión HOY: $12,99</p>
                        <p className="text-yellow-300 mobile-small-text font-bold">96% de descuento solo por haber visto la vista previa</p>
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
                        <div className="text-center break-words">
                          <div className="mobile-cta-offer-text leading-tight font-black">
                            📱 QUIERO EL MÉTODO COMPLETO
                          </div>
                          <div className="mobile-small-text mt-1 opacity-90">
                            Los 21 días completos, no solo los primeros 3
                          </div>
                        </div>
                      </Button>
                    </motion.div>

                    <div className="bg-red-900/80 mobile-urgency-padding rounded-lg mb-6 border border-red-500">
                      <p className="text-yellow-300 font-bold mobile-urgency-text mb-2 break-words">
                        ⏰ PRECIO ESPECIAL PARA QUIENES VIERON LA DEMOSTRACIÓN:
                      </p>
                      <div className="mobile-countdown font-black text-white mb-2">
                        <CountdownTimer minutes={47} seconds={0} />
                      </div>
                      <p className="text-red-300 mobile-small-text break-words">
                        Después vuelve a $67. Solo para quienes completaron el análisis.
                      </p>
                    </div>

                    <div className="flex justify-center items-center space-x-4 mobile-social-text text-gray-300 mb-4 flex-wrap gap-2">
                      <div className="flex items-center break-words">
                        <Users className="mobile-social-icon text-green-400 mr-1" />
                        <span><strong className="text-white">{recentBuyers}</strong> personas compraron hoy</span>
                      </div>
                      <div className="flex items-center break-words">
                        <Heart className="mobile-social-icon text-red-400 mr-1" />
                        <span><strong className="text-white">87%</strong> ya vio resultados</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SEÇÃO 6: OBJEÇÕES ESPECÍFICAS DA DEMOSTRAÇÃO ===== */}
        <AnimatePresence>
          {currentStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mobile-padding w-full bg-gray-900/50"
            >
              <div className="max-w-4xl mx-auto w-full">
                <h2 className="mobile-section-title font-bold text-white text-center mb-8 break-words">
                  🤔 <span className="text-yellow-400">"PERO... ¿Y SI MI CASO ES DIFERENTE AL EJEMPLO PRÁCTICO?"</span>
                </h2>

                <div className="space-y-6 mb-8">
                  
                  <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-yellow-400">
                    <h3 className="text-yellow-400 font-bold mobile-subsection-title mb-3 break-words">
                      💭 "En la demostración {getPronoun()} respondió bien... ¿y si en la vida real no?"
                    </h3>
                    <p className="text-white mobile-info-text break-words">
                      <strong>EXACTO:</strong> Por eso necesitas el Plan A completo. La vista previa mostró el escenario 
                      IDEAL, pero el método incluye 12 escenarios diferentes según cómo responda {getPronoun()}. 
                      Incluso si no responde al primer mensaje.
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-blue-400">
                    <h3 className="text-blue-400 font-bold mobile-subsection-title mb-3 break-words">
                      💔 "¿Y si mi ex ni siquiera responde al primer mensaje?"
                    </h3>
                    <p className="text-white mobile-info-text break-words">
                      <strong>PROTOCOLO ESPECÍFICO:</strong> El 27% no responde al primer mensaje. Por eso existe 
                      el "Protocolo de Silencio" - 3 técnicas diferentes para casos de no-respuesta. 
                      Días 4-7 del método completo.
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-green-400">
                    <h3 className="text-green-400 font-bold mobile-subsection-title mb-3 break-words">
                      😰 "¿Y si {getPronoun()} está con {getOtherWord()} persona como dijiste en el quiz?"
                    </h3>
                    <p className="text-white mobile-info-text break-words">
                      <strong>MÓDULO ESPECIAL:</strong> El "Protocolo Anti-Terceros" está incluido en el Módulo 4. 
                      Has visto el testimonio: funcionó incluso con {getPronoun()} viviendo con otra persona. 
                      Días 15-21 del método.
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-orange-400">
                    <h3 className="text-orange-400 font-bold mobile-subsection-title mb-3 break-words">
                      🎭 "La demostración se veía muy fácil... ¿será tan simple?"
                    </h3>
                    <p className="text-white mobile-info-text break-words">
                      <strong>LA REALIDAD:</strong> El ejemplo práctico mostró SOLO el primer intercambio exitoso. 
                      El método completo incluye 47 variables diferentes, 12 tipos de respuesta, y 
                      técnicas para cada obstáculo posible. Por eso funciona en el 87% de los casos.
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SEÇÃO 7: CASOS DE ÉXITO ===== */}
        <AnimatePresence>
          {currentStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mobile-padding bg-gradient-to-r from-gray-900 to-black w-full"
            >
              <div className="max-w-4xl mx-auto w-full">
                
                <h2 className="mobile-section-title font-bold text-white text-center mb-8 break-words">
                  💕 <span className="text-pink-400">CASOS REALES</span> MÁS ALLÁ DEL EJEMPLO PRÁCTICO
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  
                  {/* CARD 1 - Miguel D. */}
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://i.ibb.co/cK6m4D9g/Generatedimage-1764386997197.png" 
                        alt="Testimonio" 
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold mobile-info-text mb-2 break-words">Miguel D., 33 años - Colombia</h4>
                        <p className="text-gray-300 mobile-small-text mb-3 break-words">
                          <span className="text-yellow-400">Situación:</span> {getPronoun()} NO respondió al primer mensaje
                        </p>
                        <p className="text-white mobile-info-text italic mb-3 break-words">
                          "Mi caso fue diferente a cualquier demostración. {getPronoun()} me ignoró completamente los primeros 4 días. 
                          Usé el Protocolo de Silencio del Plan A. El día 8 apliqué la técnica del 'Segundo Intento Estratégico'. 
                          <strong>Funcionó: {getPronoun()} me escribió preguntando cómo estaba.</strong> En 11 días volvimos."
                        </p>
                        <div className="flex items-center mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-green-400 mobile-small-text ml-2 font-bold">✅ Protocolo de Silencio exitoso</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2 - Gustavo R. */}
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://i.ibb.co/gZDzThc8/Generatedimage-1764386812007.png" 
                        alt="Testimonio" 
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold mobile-info-text mb-2 break-words">Gustavo R., 29 años - Perú</h4>
                        <p className="text-gray-300 mobile-small-text mb-3 break-words">
                          <span className="text-yellow-400">Situación:</span> {getPronoun()} estaba con otra persona hace 3 meses
                        </p>
                        <p className="text-white mobile-info-text italic mb-3 break-words">
                          "Mi caso parecía imposible - mucho peor que cualquier ejemplo práctico. {getPronoun()} llevaba 3 meses con otra persona. 
                          El Protocolo Anti-Terceros del Módulo 4 fue mi salvación. Día 1-7: diferenciación sutil. Día 8-12: generar dudas. 
                          Día 13: {getPronoun()} empezó a compararme. <strong>Día 16: dejó a esa persona por mí.</strong>"
                        </p>
                        <div className="flex items-center mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-green-400 mobile-small-text ml-2 font-bold">✅ Protocolo Anti-Terceros exitoso</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ESTATÍSTICAS */}
                <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 mb-6 border border-green-500/30">
                  <h3 className="text-green-400 font-bold mobile-subsection-title text-center mb-4 break-words">
                    📊 RESULTADOS REALES:
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="mobile-stats-number font-bold text-green-400 mb-1">89%</div>
                      <p className="text-white mobile-stats-text break-words">Éxito con método completo</p>
                    </div>
                    <div>
                      <div className="mobile-stats-number font-bold text-blue-400 mb-1">73%</div>
                      <p className="text-white mobile-stats-text break-words">Éxito incluso sin responder al primer mensaje</p>
                    </div>
                    <div>
                      <div className="mobile-stats-number font-bold text-orange-400 mb-1">67%</div>
                      <p className="text-white mobile-stats-text break-words">Éxito incluso con terceras personas</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SEÇÃO 8: GARANTIA ===== */}
        <AnimatePresence>
          {currentStep >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mobile-padding bg-gradient-to-r from-green-900/30 to-emerald-900/30 w-full"
            >
              <div className="max-w-4xl mx-auto w-full">
                <Card className="bg-green-50 mobile-border-green shadow-2xl w-full">
                  <CardContent className="mobile-guarantee-padding text-center w-full">
                    <Shield className="mobile-shield-icon text-green-600 mx-auto mb-4" />
                    
                    <h2 className="mobile-guarantee-title font-bold text-green-800 mb-4 break-words">
                      GARANTÍA INCONDICIONAL DE 30 DÍAS
                    </h2>
                    
                    <p className="text-green-700 mobile-guarantee-text font-bold mb-4 break-words">
                      Si el método completo no funciona mejor que el ejemplo práctico, te devuelvo el 100% de tu dinero
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                      <p className="text-green-800 mobile-guarantee-desc font-semibold break-words">
                        <strong>Mi promesa personal:</strong> Si sigues los 21 días completos del Plan A y no ves 
                        progreso real con {getPronoun()}, no solo te devuelvo el dinero, te doy una consulta personal 
                        gratuita para revisar tu caso específico.
                      </p>
                    </div>
                    
                    <p className="text-green-600 mobile-small-text mt-4 break-words">
                      Tienes 30 días completos para probarlo. La demostración fue solo el inicio.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SEÇÃO 9: CTA FINAL IRRESISTÍVEL ===== */}
        <AnimatePresence>
          {currentStep >= 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mobile-padding bg-gradient-to-r from-red-600 via-red-700 to-orange-600 w-full"
            >
              <div className="max-w-4xl mx-auto text-center w-full">
                
                <div className="bg-black/80 backdrop-blur-sm rounded-2xl mobile-final-padding border-2 border-yellow-400 w-full">
                  
                  <h2 className="mobile-final-title font-black text-white mb-4 break-words">
                    ⚡ ÚLTIMO AVISO - COMPLETA LA DEMOSTRACIÓN EN LA VIDA REAL
                  </h2>
                  
                  <p className="mobile-final-subtitle text-white mb-6 font-bold break-words">
                    Viste cómo funciona en el ejemplo práctico. Ahora hazlo realidad con {getPronoun()}.
                  </p>
                  
                  <div className="bg-yellow-600/20 border border-yellow-400 rounded-lg p-4 mb-6">
                    <p className="text-yellow-300 mobile-info-text font-bold mb-2 break-words">
                      🎬 LA DEMOSTRACIÓN TE MOSTRÓ LOS DÍAS 1-3:
                    </p>
                    <p className="text-white mobile-description break-words">
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
                      onClick={() => handlePurchase("cta_final_demostracion")}
                      size="lg"
                      className="mobile-cta-final"
                      onTouchStart={handleTouchFeedback}
                    >
                      <div className="text-center break-words">
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

                  <p className="text-yellow-300 mobile-final-warning font-bold break-words">
                    El ejemplo práctico fue perfecto. Ahora hazlo realidad antes de que sea tarde.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

          .mobile-vturb-player {
            display: block !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: clamp(0.5rem, 2vw, 1rem) !important;
            overflow: hidden !important;
            aspect-ratio: 16/9 !important;
            height: auto !important;
            min-height: clamp(200px, 40vw, 400px) !important;
          }

          vturb-smartplayer {
            border-radius: clamp(0.5rem, 2vw, 1rem) !important;
            overflow: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            aspect-ratio: 16/9 !important;
            contain: layout style paint !important;
            min-height: clamp(200px, 40vw, 400px) !important;
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