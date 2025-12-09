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
  AlertTriangle,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button" // Assumindo que você tem um componente Button
import { Card, CardContent } from "@/components/ui/card" // Assumindo que você tem um componente Card
import { CountdownTimer } from "@/components/countdown-timer" // Assumindo que você tem um componente CountdownTimer
import { enviarEvento } from "../../lib/analytics" // Assumindo seu arquivo de analytics

export default function ResultPageDopamine() {
  // ===== ESTADOS =====
  const [isLoaded, setIsLoaded] = useState(false)
  const [userGender, setUserGender] = useState<string>("")
  const [userAnswers, setUserAnswers] = useState<object>({})
  const [currentRevelation, setCurrentRevelation] = useState(0) // 0: Decrypting, 1: Incomplete, 2: VSL, 3: Offer
  const [decryptedText, setDecryptedText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(true)
  const [activeBuyers, setActiveBuyers] = useState(Math.floor(Math.random() * 5) + 8) // Compradores em tempo real
  const startTimeRef = useRef(Date.now())

  // ===== PERSONALIZAÇÃO BASEADA NO QUIZ =====
  useEffect(() => {
    const savedGender = localStorage.getItem("userGender") || ""
    const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "{}")
    
    setUserGender(savedGender)
    setUserAnswers(savedAnswers)

    setTimeout(() => setIsLoaded(true), 100) // Carrega rapidamente

    // ✅ GA4 EVENT: Viu resultado otimizado
    enviarEvento("viu_resultado_dopamina_v4", {
      timestamp: new Date().toISOString(),
      user_gender: savedGender,
      version: "matrix_continuity"
    })

    startTimeRef.current = Date.now()
    loadVTurbScript()

    // Simular compradores em tempo real
    const interval = setInterval(() => {
      setActiveBuyers(prev => prev + Math.floor(Math.random() * 2) + 1)
    }, 45000) // A cada 45 segundos, adiciona 1-2 compradores

    return () => {
      clearInterval(interval)
      const timeSpent = (Date.now() - startTimeRef.current) / 1000
      enviarEvento('tempo_pagina_resultado_dopamina', {
        tempo_segundos: timeSpent,
        conversao: false, // Será atualizado para true se houver compra
        version: "matrix_continuity"
      })
    }
  }, [])

  // ===== PROGRESSÃO AUTOMÁTICA DE REVELAÇÕES (DOPAMINA) =====
  useEffect(() => {
    let decryptInterval: NodeJS.Timeout;
    let revelationTimers: NodeJS.Timeout[] = [];

    // Animação de descriptografia inicial
    if (isDecrypting) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.&lt;>?';
      let currentRandomText = Array.from({length: 50}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      
      decryptInterval = setInterval(() => {
        currentRandomText = Array.from({length: 50}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setDecryptedText(currentRandomText);
      }, 50); // Atualiza a cada 50ms para efeito matrix
    }

    // Sequência de revelações
    revelationTimers.push(setTimeout(() => {
      if (decryptInterval) clearInterval(decryptInterval);
      setIsDecrypting(false);
      setDecryptedText("CÓDIGO INCOMPLETO DETECTADO"); // Mensagem final da descriptografia
      setCurrentRevelation(1); // Revelação 1: Código Incompleto
    }, 3000)); // 3 segundos para a primeira revelação

    revelationTimers.push(setTimeout(() => {
      setCurrentRevelation(2); // Revelação 2: VSL e Desbloqueio
    }, 6000)); // +3 segundos (total 6s)

    revelationTimers.push(setTimeout(() => {
      setCurrentRevelation(3); // Revelação 3: Oferta Irresistível
    }, 9000)); // +3 segundos (total 9s)

    return () => {
      if (decryptInterval) clearInterval(decryptInterval);
      revelationTimers.forEach(clearTimeout);
    };
  }, [isDecrypting]);

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
  const getPronoun = useCallback(() => userGender === "SOY MUJER" ? "él" : "ella", [userGender])
  const getOtherPronoun = useCallback(() => userGender === "SOY MUJER" ? "lo" : "la", [userGender])
  const getOtherWord = useCallback(() => userGender === "SOY MUJER" ? "otro" : "otra", [userGender])

  const getPersonalizedSituation = useCallback(() => {
    const situation = (userAnswers as any)?.question7 || "contacto limitado"
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

  const getPersonalizedTimeframe = useCallback(() => {
    const timeframe = (userAnswers as any)?.question3 || "1-3 meses"
    return timeframe
  }, [userAnswers])

  // ===== FUNÇÃO DE COMPRA OTIMIZADA =====
  const handlePurchase = useCallback((position = "principal") => {
    const timeToAction = (Date.now() - startTimeRef.current) / 1000
    
    enviarEvento("clicou_comprar_dopamina_v4", {
      posicao: position,
      revelacion_actual: currentRevelation,
      timestamp: new Date().toISOString(),
      user_gender: userGender,
      situacion: getPersonalizedSituation(),
      tiempo_hasta_accion: timeToAction,
      conversao: true,
      version: "matrix_continuity"
    })
    
    enviarEvento('tiempo_pagina_resultado_dopamina', {
      tiempo_segundos: timeToAction,
      conversao: true,
      version: "matrix_continuity"
    })
    
    setTimeout(() => {
      window.open("https://pay.hotmart.com/F100142422S?off=efckjoa7&checkoutMode=10", "_blank")
    }, 100)
  }, [currentRevelation, userGender, getPersonalizedSituation])

  // ===== FEEDBACK TÁTIL =====
  const handleTouchFeedback = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }, [])

  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
      </head>

      <div className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw]">
        
        {/* ===== TRANSIÇÃO MATRIX DO QUIZ ===== */}
        <div className="matrix-background-container w-full min-h-screen relative">
          
          {/* Background Matrix Effect */}
          <div className="matrix-bg-animation"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
            
            {/* ===== SEÇÃO 1: CONTINUIDADE DO CÓDIGO (REVELAÇÃO 0) ===== */}
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
                    className="text-white text-left space-y-2 mt-4"
                  >
                    <div>→ SITUACIÓN: <span className="text-orange-400">{getPersonalizedSituation()}</span></div>
                    <div>→ PROBABILIDAD: <span className="text-green-400">89%</span></div>
                    <div>→ TIEMPO SEPARADOS: <span className="text-yellow-400">{getPersonalizedTimeframe()}</span></div>
                    <div>→ ESTADO: <span className="text-red-400">CÓDIGO INCOMPLETO</span></div>
                    <div>→ PROGRESO: <span className="text-yellow-400">14% del método total</span></div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ===== REVELAÇÃO 1: CÓDIGO INCOMPLETO (3s) ===== */}
            <AnimatePresence>
              {currentRevelation >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <h2 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">
                        🚨 ACCESO DENEGADO
                      </h2>
                      <p className="text-white text-xl mb-6">
                        El código que viste fue solo el <strong className="text-red-300">14%</strong> del método completo
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

            {/* ===== REVELACIÓN 2: VSL ESTRATÉGICO (6s) ===== */}
            <AnimatePresence>
              {currentRevelation >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
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

                    {/* VSL CENTRALIZADO */}
                    <div className="max-w-3xl mx-auto mb-6">
                      <div className="relative bg-black rounded-xl p-4 border-2 border-blue-500 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-xl animate-pulse"></div>
                        <div className="relative z-10 w-full mobile-video-container">
                          <vturb-smartplayer 
                            id="vid-692ef1c85df8a7aaec7c6000"
                            className="mobile-vturb-player"
                          ></vturb-smartplayer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center bg-blue-900/30 rounded-lg p-4 border border-blue-500">
                      <p className="text-blue-300 font-bold">
                        <MessageCircle className="inline w-5 h-5 mr-2" />
                        El video revela el código completo para reconquistar a {getPronoun()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== REVELACIÓN 3: OFERTA IRRESISTÍVEL (9s) ===== */}
            <AnimatePresence>
              {currentRevelation >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <Card className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 text-white shadow-2xl mobile-border-yellow w-full backdrop-blur-sm">
                    <CardContent className="mobile-offer-padding text-center w-full">
                      
                      <div className="bg-yellow-400 text-black font-bold mobile-offer-badge rounded-full inline-block mb-6">
                        📱 ACCESO AL CÓDIGO COMPLETO
                      </div>

                      <h2 className="mobile-offer-title font-black mb-6 text-white break-words">
                        DESBLOQUEA LOS 21 DÍAS COMPLETOS PARA RECUPERAR A {getPronoun().toUpperCase()}
                      </h2>

                      <div className="bg-black/50 rounded-lg p-6 mb-6 border border-yellow-500">
                        <p className="text-gray-300 mobile-small-text line-through mb-2">Valor Total: $568</p>
                        <p className="text-green-400 font-bold mobile-description mb-2">Tu inversión HOY: $12,99</p>
                        <p className="text-yellow-300 mobile-small-text font-bold">96% de descuento solo por haber visto el código incompleto</p>
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
                          onClick={() => handlePurchase("oferta_principal_dopamina")}
                          size="lg"
                          className="mobile-cta-offer"
                          onTouchStart={handleTouchFeedback}
                        >
                          <Unlock className="mobile-icon-size mr-2 flex-shrink-0" />
                          <div className="text-center break-words">
                            <div className="mobile-cta-offer-text leading-tight font-black">
                              DESBLOQUEAR CÓDIGO COMPLETO AHORA
                            </div>
                            <div className="mobile-small-text mt-1 opacity-90">
                              Los 21 días completos, no solo el 14%
                            </div>
                          </div>
                        </Button>
                      </motion.div>

                      <div className="bg-red-900/80 mobile-urgency-padding rounded-lg mb-6 border border-red-500">
                        <p className="text-yellow-300 font-bold mobile-urgency-text mb-2 break-words">
                          ⏰ PRECIO ESPECIAL PARA QUIENES VIERON EL CÓDIGO:
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
                          <span><strong className="text-white">{activeBuyers}</strong> personas desbloquearon hoy</span>
                        </div>
                        <div className="flex items-center break-words">
                          <Heart className="mobile-social-icon text-red-400 mr-1" />
                          <span><strong className="text-white">87%</strong> ya vio resultados</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== SEÇÃO 4: GARANTIA RÁPIDA ===== */}
            <AnimatePresence>
              {currentRevelation >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-12"
                >
                  <Card className="bg-green-50 mobile-border-green shadow-2xl w-full">
                    <CardContent className="mobile-guarantee-padding text-center w-full">
                      <Shield className="mobile-shield-icon text-green-600 mx-auto mb-4" />
                      
                      <h2 className="mobile-guarantee-title font-bold text-green-800 mb-4 break-words">
                        GARANTÍA INCONDICIONAL DE 30 DÍAS
                      </h2>
                      
                      <p className="text-green-700 mobile-guarantee-text font-bold mb-4 break-words">
                        Si el código completo no funciona mejor que el ejemplo práctico, te devuelvo el 100% de tu dinero
                      </p>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                        <p className="text-green-800 mobile-guarantee-desc font-semibold break-words">
                          <strong>Mi promesa personal:</strong> Si sigues los 21 días completos del Plan A y no ves 
                          progreso real con {getPronoun()}, no solo te devuelvo el dinero, te doy una consulta personal 
                          gratuita para revisar tu caso específico.
                        </p>
                      </div>
                      
                      <p className="text-green-600 mobile-small-text mt-4 break-words">
                        Tienes 30 días completos para probarlo. El código incompleto fue solo el inicio.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== SEÇÃO 5: CTA FINAL IRRESISTÍVEL ===== */}
            <AnimatePresence>
              {currentRevelation >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-12"
                >
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl mobile-final-padding border-2 border-yellow-400 w-full text-center">
                    
                    <h2 className="mobile-final-title font-black text-white mb-4 break-words">
                      ⚡ ÚLTIMO AVISO - COMPLETA EL CÓDIGO EN LA VIDA REAL
                    </h2>
                    
                    <p className="mobile-final-subtitle text-white mb-6 font-bold break-words">
                      Viste cómo funciona el 14% del código. Ahora desbloquea el 100% para {getPronoun()}.
                    </p>
                    
                    <div className="bg-yellow-600/20 border border-yellow-400 rounded-lg p-4 mb-6">
                      <p className="text-yellow-300 mobile-info-text font-bold mb-2 break-words">
                        🎬 EL CÓDIGO INCOMPLETO TE MOSTRÓ LOS DÍAS 1-3:
                      </p>
                      <p className="text-white mobile-description break-words">
                        Ahora necesitas los días 4-21 para completar la reconquista real. 
                        ¿Vale la pena $12,99 desbloquear el código para quien amas?
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
                        onClick={() => handlePurchase("cta_final_dopamina")}
                        size="lg"
                        className="mobile-cta-final"
                        onTouchStart={handleTouchFeedback}
                      >
                        <div className="text-center break-words">
                          <div className="mobile-cta-final-text leading-tight font-black">
                            🎬 SÍ, QUIERO DESBLOQUEAR EL CÓDIGO AHORA
                          </div>
                          <div className="mobile-small-text mt-1 opacity-90">
                            Los 21 días completos para reconquistar a {getPronoun()}
                          </div>
                        </div>
                        <ArrowRight className="mobile-icon-size ml-2 flex-shrink-0" />
                      </Button>
                    </motion.div>

                    <p className="text-yellow-300 mobile-final-warning font-bold break-words">
                      El código incompleto fue perfecto. Ahora desbloquea el resto antes de que sea tarde.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== FOOTER DE CONFIANÇA ===== */}
            <AnimatePresence>
              {currentRevelation >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-center text-gray-500 text-xs mt-12"
                >
                  <p>
                    © 2024 Plan A. Todos los derechos reservados.
                  </p>
                  <p className="mt-2">
                    <a href="/politica-de-privacidad" className="underline hover:text-gray-400">Política de Privacidad</a> | 
                    <a href="/terminos-de-uso" className="underline hover:text-gray-400">Términos de Uso</a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ===== CSS GLOBAL (ADAPTADO PARA MATRIX) ===== */}
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
            background-color: black; /* Garante fundo preto */
          }

          /* Matrix Background Effect */
          .matrix-background-container {
            position: relative;
            background-color: black;
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
            opacity: 0.1; /* Mais sutil para não atrapalhar o conteúdo */
            transition: opacity 1s ease-out;
            z-index: 0;
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
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
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
            .max-w-3xl { max-w: 48rem !important; }
            .max-w-2xl { max-w: 42rem !important; }
            .max-w-md { max-w: 28rem !important; }
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