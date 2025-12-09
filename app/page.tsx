"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowRight, Shield, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// GA OTIMIZADO
const enviarEvento = (() => {
  let queue: { evento: string; props: Record<string, any> }[] = []
  let timeout: NodeJS.Timeout | null = null

  return (evento: string, props: Record<string, any> = {}) => {
    queue.push({ evento, props })
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).gtag && queue.length) {
        queue.forEach(({ evento, props }) => {
          ;(window as any).gtag("event", evento, {
            timestamp: new Date().toISOString(),
            ...props
          })
        })
        queue = []
      }
    }, 500)
  }
})()

// ✅ CONFIGURAÇÃO AJUSTADA
const CONFIG = {
  MODAL_DELAY_MIN: 15000, // ✅ AUMENTADO: 15 segundos mínimo (era 8)
  MODAL_SCROLL_TRIGGER: 300, // ✅ NOVO: Modal também aparece após scroll de 300px
  SPOTS_TOTAL: 100,
  QUIZ_DURATION_MINUTES: 2,
  HEADLINE_VERSION: "psychological_2am_v2",
  LOGO_URL: "https://comprarplanseguro.shop/wp-content/uploads/2025/10/c2b0ddda-8a7c-4554-a6c9-d57887b06149.webp",
  SITE_DOMAIN: "https://comprarplanseguro.shop"
}

const getConsistentSpots = (): number => {
  if (typeof window === "undefined") return 23
  const today = new Date().toDateString()
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return Math.max(10, (seed % 40) + 10)
}

export default function HomePage() {
  const router = useRouter()
  const spotsRestantes = getConsistentSpots()
  
  // ==================== ESTADO ====================
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [showPsychologicalModal, setShowPsychologicalModal] = useState<boolean>(false)
  const [modalHasBeenShown, setModalHasBeenShown] = useState<boolean>(false)
  
  // ✅ NOVAS REFS para controlar o timing
  const modalTimerRef = useRef<NodeJS.Timeout | null>(null)
  const scrollTriggerRef = useRef<boolean>(false) // Rastreia se houve scroll suficiente
  const timeTriggerRef = useRef<boolean>(false) // Rastreia se tempo mínimo passou

  // ==================== EFEITOS ====================

  // Detectar status online/offline
  useEffect(() => {
    if (typeof window === "undefined") return

    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus, { passive: true })
    window.addEventListener("offline", updateOnlineStatus, { passive: true })

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // GA4: Page view
  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      enviarEvento("page_view", {
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        headline_version: CONFIG.HEADLINE_VERSION,
        page: "homepage"
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // ✅ NOVA LÓGICA: Mostrar modal quando AMBAS as condições forem atendidas
  // Condição 1: Usuário scrollou 300px para baixo (leu a copy)
  // Condição 2: Passou 15 segundos na página
  useEffect(() => {
    if (typeof window === "undefined" || modalHasBeenShown) return

    // ✅ EVENTO 1: Detectar scroll
    const handleScroll = () => {
      if (window.scrollY >= CONFIG.MODAL_SCROLL_TRIGGER) {
        scrollTriggerRef.current = true
        
        // Se tempo também passou, mostra modal
        if (timeTriggerRef.current) {
          showModal()
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // ✅ EVENTO 2: Timer de 15 segundos
    modalTimerRef.current = setTimeout(() => {
      timeTriggerRef.current = true
      
      // Se usuário scrollou, mostra modal
      if (scrollTriggerRef.current) {
        showModal()
      } else {
        // Se não scrollou ainda, mostra de qualquer forma após 15s
        // (para não deixar usuário esperando demais)
        showModal()
      }
    }, CONFIG.MODAL_DELAY_MIN)

    const showModal = () => {
      if (!modalHasBeenShown) {
        setShowPsychologicalModal(true)
        setModalHasBeenShown(true)

        enviarEvento("psychological_modal_view", {
          trigger: scrollTriggerRef.current ? "scroll_triggered" : "time_triggered",
          time_on_page_ms: CONFIG.MODAL_DELAY_MIN,
          scroll_distance: window.scrollY,
          device: window.innerWidth < 768 ? "mobile" : "desktop"
        })
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current)
    }
  }, [modalHasBeenShown])

  // ==================== FUNÇÕES ====================

  const handleStart = useCallback(() => {
    if (isLoading || !isOnline) return

    setIsLoading(true)
    setLoadingProgress(20)

    if (showPsychologicalModal) {
      setShowPsychologicalModal(false)
    }

    enviarEvento("quiz_start", {
      headline_version: CONFIG.HEADLINE_VERSION,
      modal_shown: modalHasBeenShown,
      source: "cta_main"
    })

    let progress = 20
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10
      setLoadingProgress(Math.min(progress, 95))

      if (progress >= 95) {
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

        setTimeout(() => {
          setLoadingProgress(100)
          router.push(url)
        }, 300)
      }
    }, 200)
  }, [isLoading, isOnline, router, showPsychologicalModal, modalHasBeenShown])

  const handleCloseModal = useCallback(() => {
    setShowPsychologicalModal(false)
    enviarEvento("psychological_modal_close", {
      time_shown_ms: 0
    })
  }, [])

  // ==================== RENDERIZAÇÃO ====================

  return (
    <>
      <head>
        <title>SÍ, ELLA PIENSA EN TI A LAS 2AM - Test Psicológico</title>
        <meta name="description" content="Descubre si tu ex sigue pensando en ti a las 2AM con este test psicológico." />
        <link rel="preconnect" href={CONFIG.SITE_DOMAIN} />
        <link rel="dns-prefetch" href={CONFIG.SITE_DOMAIN} />
      </head>

      <div
        style={{
          backgroundColor: "#000000",
          minHeight: "100vh",
          padding: "20px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style jsx>{`
          .container-quiz {
            background: linear-gradient(145deg, #000 0%, #111 100%);
            border: 2px solid #333;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 520px;
            margin: 0 auto;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,.8);
            width: 100%;
          }

          .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 25px;
            width: 100%;
          }

          .logo-pequena {
            border-radius: 10px;
            border: 2px solid #dc2626;
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
            width: 120px;
            height: 75px;
            object-fit: cover;
            display: block;
            margin: 0 auto;
          }

          .titulo-quiz {
            color: #fff;
            font-size: 26px;
            font-weight: 700;
            margin: 20px 0 20px 0;
            line-height: 1.3;
            text-align: left;
          }

          .emoji-alerta {
            color: #dc2626;
            font-size: 28px;
            margin-right: 8px;
          }

          .subtitulo-quiz {
            color: #e5e5e5;
            font-size: 15px;
            margin-bottom: 25px;
            font-weight: 400;
            line-height: 1.4;
            text-align: left;
          }

          .destaque-palavra {
            color: #dc2626;
            font-weight: 700;
            text-transform: uppercase;
            background: linear-gradient(135deg, #dc2626, #f87171);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .prova-social {
            color: #dc2626;
            font-weight: 600;
            font-size: 16px;
          }

          .quiz-info {
            display: flex;
            justify-content: space-around;
            margin: 25px 0;
            padding: 15px;
            background: rgba(220, 38, 38, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(220, 38, 38, 0.3);
          }

          .quiz-info > div {
            color: #fff;
            font-size: 12px;
            font-weight: 500;
          }

          .btn-iniciar-quiz {
            background: linear-gradient(135deg, #dc2626 0%, #7c2d12 100%);
            color: white;
            border: none;
            padding: 20px 35px;
            font-size: 15px;
            font-weight: 700;
            border-radius: 25px;
            cursor: pointer;
            width: 100%;
            max-width: 320px;
            transition: all 0.3s ease;
            text-transform: none;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 5px 15px rgba(220, 38, 38, 0.3);
          }

          .btn-iniciar-quiz:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
            background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
          }

          .btn-iniciar-quiz:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .garantia-simples {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 20px;
            color: #888;
            font-size: 12px;
          }

          .main-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding-top: 20px;
          }

          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
          }

          .loading-content {
            text-align: center;
            color: white;
          }

          .progress-bar {
            width: 250px;
            height: 6px;
            background: #333;
            border-radius: 3px;
            overflow: hidden;
            margin-top: 25px;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #dc2626, #f87171);
            transition: width .3s ease;
            border-radius: 3px;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal-content {
            background: linear-gradient(135deg, #1f1f23 0%, #2d1b1b 100%);
            border: 2px solid #dc2626;
            border-radius: 15px;
            padding: 30px;
            max-width: 450px;
            width: 90%;
            position: relative;
            animation: slideUp 0.4s ease;
            box-shadow: 0 20px 60px rgba(220, 38, 38, 0.3);
          }

          @keyframes slideUp {
            from {
              transform: translateY(30px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modal-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }

          .modal-header h3 {
            color: #dc2626;
            font-size: 16px;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .modal-body {
            color: #fff;
            font-size: 14px;
            line-height: 1.6;
          }

          .modal-body p {
            margin: 12px 0;
            text-align: left;
          }

          .modal-body ul {
            list-style: none;
            padding: 0;
            margin: 15px 0;
            text-align: left;
          }

          .modal-body li {
            margin: 8px 0;
            color: #e5e5e5;
          }

          .revelation-box {
            background: rgba(220, 38, 38, 0.15);
            border: 1px solid rgba(220, 38, 38, 0.3);
            border-radius: 10px;
            padding: 15px;
            margin: 15px 0;
            text-align: left;
          }

          .revelation-box p {
            margin: 8px 0;
            font-size: 13px;
            color: #e5e5e5;
          }

          .modal-cta {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 20px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .modal-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
          }

          .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #dc2626;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-close:hover {
            color: #f87171;
          }

          @media (max-width: 768px) {
            .container-quiz {
              padding: 30px 20px;
              margin: 10px;
              max-width: 95%;
            }
            
            .titulo-quiz {
              font-size: 22px;
              text-align: center;
            }

            .subtitulo-quiz {
              font-size: 14px;
              text-align: center;
            }
            
            .quiz-info {
              flex-direction: column;
              gap: 8px;
              text-align: center;
            }

            .btn-iniciar-quiz {
              font-size: 14px;
              padding: 16px 28px;
              max-width: 100%;
            }

            .modal-content {
              max-width: 90%;
              padding: 20px;
            }
          }

          @media (max-width: 480px) {
            .container-quiz {
              padding: 25px 15px;
              margin: 5px;
            }

            .titulo-quiz {
              font-size: 20px;
            }

            .subtitulo-quiz {
              font-size: 13px;
            }

            .logo-pequena {
              width: 100px;
              height: 60px;
            }

            .emoji-alerta {
              font-size: 24px;
            }

            .modal-content {
              max-width: 95%;
            }
          }
        `}</style>

        {/* Loading overlay */}
        {isLoading && (
          <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-content">
              <div style={{ fontSize: "18px", fontWeight: "600" }}>
                Preparando tu análisis personalizado...
                <div style={{fontSize: "14px", marginTop: "8px", color: "#dc2626"}}>
                  ⚠️ Spot #{Math.floor(Math.random() * (spotsRestantes - 5) + 5)} de {CONFIG.SPOTS_TOTAL} reservado
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div role="alert" style={{position: "fixed", top: "20px", left: "20px", right: "20px", background: "#dc2626", color: "white", padding: "15px", borderRadius: "10px", zIndex: 1000, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage("")} style={{background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer"}}>×</button>
          </div>
        )}

        {/* Offline indicator */}
        {!isOnline && (
          <div role="alert" style={{position: "fixed", top: "0", left: "0", right: "0", background: "#f59e0b", color: "white", textAlign: "center", padding: "10px", zIndex: 1000}}>
            ⚠️ Sem conexão com a internet
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div className="main-content">
          <div className="container-quiz">
            
            {/* LOGO */}
            <div className="logo-container">
              <Image
                src={CONFIG.LOGO_URL}
                alt="Logo Plan A"
                width={120}
                height={75}
                className="logo-pequena"
                priority
                quality={70}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>

            {/* HEADLINE */}
            <h1 className="titulo-quiz">
              <span className="emoji-alerta">💭</span>
              SÍ, ELLA PIENSA EN TI A LAS 2AM
              <br />
              <span style={{fontSize: '18px', opacity: 0.9, color: '#dc2626'}}>
                (Y Este Test Revela EXACTAMENTE Lo Que Piensa)
              </span>
            </h1>

            {/* SUBTÍTULO */}
            <p className="subtitulo-quiz">
              Si sientes que <span className="destaque-palavra">ALGO QUEDÓ INCONCLUSO</span> y no puedes sacártela de la cabeza, no estás loco...
              <br />
              <span className="prova-social">Hay señales que ella envía sin darse cuenta.</span>
              <br />
              <strong style={{color: '#dc2626'}}>¿Quieres saber cuáles?</strong>
            </p>

            {/* QUIZ INFO */}
            <div className="quiz-info">
              <div>⏱️ {CONFIG.QUIZ_DURATION_MINUTES} min</div>
              <div>🎯 Resultado inmediato</div>
              <div>🔥 Análisis personalizado</div>
            </div>

            {/* REVELAÇÃO PSICOLÓGICA */}
            <div style={{
              background: 'linear-gradient(135deg, #1f1f23 0%, #2d1b1b 100%)',
              border: '2px solid #dc2626',
              borderRadius: '15px',
              padding: '20px',
              margin: '20px 0',
              position: 'relative'
            }}>
              <div style={{color: '#dc2626', fontSize: '14px', fontWeight: '700', marginBottom: '10px'}}>
                REVELACIÓN PSICOLÓGICA:
              </div>
              <div style={{color: '#fff', fontSize: '13px', lineHeight: '1.5'}}>
                "Cuando una mujer te bloquea o ignora, <strong>no significa que dejó de sentir</strong>. 
                Significa que está <span style={{color: '#dc2626', fontWeight: '600'}}>protegiendo sus emociones</span>.
                <br/><br/>
                La ciencia confirma: <strong>87% de las mujeres siguen pensando en su ex durante los primeros 3 meses</strong>.
                <br/><br/>
                <em style={{color: '#fbbf24'}}>¿Quieres descubrir en cuál porcentaje estás?</em>"
              </div>
            </div>

            {/* CTA PRINCIPAL */}
            <button 
              onClick={handleStart} 
              disabled={isLoading || !isOnline} 
              className="btn-iniciar-quiz"
            >
              {isLoading ? (
                "ANALIZANDO..."
              ) : (
                <>
                  💭 DESCUBRIR QUÉ PIENSA DE MÍ
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* PROVA SOCIAL */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '12px',
              margin: '20px 0 15px 0',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{color: '#22c55e', fontSize: '12px', fontWeight: '600', textAlign: 'center', marginBottom: '6px'}}>
                RESULTADO RECIENTE:
              </div>
              <div style={{color: '#fff', fontSize: '11px', textAlign: 'center', fontStyle: 'italic'}}>
                "Hice el test y descubrí que ella SÍ pensaba en mí. 
                En 12 días volvimos." - Carlos A.
              </div>
            </div>

            {/* GARANTIA */}
            <div className="garantia-simples">
              <Shield size={14} />
              Completamente confidencial
            </div>

          </div>
        </div>

        {/* MODAL */}
        {showPsychologicalModal && (
          <div className="modal-overlay" onClick={handleCloseModal} role="dialog" aria-modal="true">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span style={{fontSize: '24px'}}>🧠</span>
                <h3>PATRÓN PSICOLÓGICO DETECTADO</h3>
              </div>
              
              <div className="modal-body">
                <p><strong>Si estás aquí a esta hora</strong>, probablemente acabas de:</p>
                
                <ul>
                  <li>✅ Revisar sus redes sociales</li>
                  <li>✅ Preguntarte "¿qué estará haciendo?"</li>
                  <li>✅ Sentir que algo quedó inconcluso</li>
                </ul>
                
                <div className="revelation-box">
                  <strong style={{color: '#dc2626'}}>REVELACIÓN:</strong>
                  <p>Cuando sientes eso, <em>no es casualidad</em>. Hay una conexión psicológica que permanece activa.</p>
                  <p style={{fontSize: '13px', color: '#fbbf24'}}>Y este test puede revelarte si ella siente lo mismo...</p>
                </div>
                
                <button 
                  className="modal-cta"
                  onClick={() => {
                    setShowPsychologicalModal(false)
                    handleStart()
                  }}
                >
                  🔍 ANALIZAR CONEXIÓN PSICOLÓGICA
                </button>
              </div>
              
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}