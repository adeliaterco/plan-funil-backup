"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowRight, Shield } from "lucide-react" // X icon removed as it's only in the modal
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PsychologyModal } from "@/components/psychology-modal" // Importa o modal cinematográfico

// 
// GA OTIMIZADO - Batch de eventos para melhor performance
// 
const enviarEvento = (() => {
  let queue: { evento: string; props: Record<string, any> }[] = []
  let timeout: NodeJS.Timeout | null = null

  return (evento: string, props: Record<string, any> = {}) => {
    queue.push({ evento, props })
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).gtag && queue.length) {
        queue.forEach(({ evento, props }) => {
          (window as any).gtag("event", evento, {
            timestamp: new Date().toISOString(),
            ...props
          })
        })
        queue = []
      }
    }, 500) // Envia eventos em batch a cada 500ms
  }
})()

// 
// CONSTANTES DE CONFIGURAÇÃO
// 
const CONFIG = {
  MODAL_DELAY: 8000, // 8 segundos para modal cinematográfico
  SPOTS_TOTAL: 100,
  SPOTS_PER_DAY: 100,
  HEADLINE_VERSION: "psychological_2am_v2", // Para A/B testing
  QUIZ_DURATION_MINUTES: 2
}

// Função para gerar spots restantes de forma consistente
const getConsistentSpots = (): number => {
  if (typeof window === "undefined") return 23
  
  // Usar data + hash para gerar número consistente por dia
  const today = new Date().toDateString()
  const seed = today.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
  return Math.max(10, (seed % 40) + 10) // Entre 10 e 50 spots
}

// 
// COMPONENT PRINCIPAL
// 
export default function HomePage() {
  const router = useRouter()
  const spotsRestantes = getConsistentSpots()
  
  // State Management
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [showPsychologicalModal, setShowPsychologicalModal] = useState(false)
  const [modalHasBeenShown, setModalHasBeenShown] = useState(false)
  const modalTimerRef = useRef<NodeJS.Timeout | null>(null)

  // ==================== EFFECTS ====================

  // Detecção de conexão
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

  // Page view tracking
  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      enviarEvento("page_view", {
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        headline_version: CONFIG.HEADLINE_VERSION,
        page: "homepage"
      })
    }, 1000) // Envia após 1 segundo para garantir que a página carregou

    return () => clearTimeout(timer)
  }, [])

  // Modal cinematográfico após 8 segundos
  useEffect(() => {
    if (typeof window === "undefined" || modalHasBeenShown) return

    modalTimerRef.current = setTimeout(() => {
      setShowPsychologicalModal(true)
      setModalHasBeenShown(true) // Garante que o modal só aparece uma vez automaticamente

      enviarEvento("psychological_modal_view", {
        time_on_page_ms: CONFIG.MODAL_DELAY,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        headline_version: CONFIG.HEADLINE_VERSION,
        trigger: "auto_8_seconds"
      })
    }, CONFIG.MODAL_DELAY)

    return () => {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current)
    }
  }, [modalHasBeenShown])

  // ==================== HANDLERS ====================

  const handleStart = useCallback(async () => {
    if (isLoading || !isOnline) return

    try {
      setIsLoading(true)
      setLoadingProgress(20)
      setErrorMessage(null)

      // Close modal se estiver aberto
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
        progress += Math.random() * 20 + 10 // Aumenta o progresso de forma mais rápida
        setLoadingProgress(Math.min(progress, 95))

        if (progress >= 95) {
          clearInterval(interval)

          // Preservar UTMs e adicionar session data
          let url = "/quiz/1"
          if (typeof window !== "undefined" && window.location.search) {
            try {
              const params = new URLSearchParams(window.location.search)
              const utms = new URLSearchParams()

              for (const [key, value] of params.entries()) {
                if (key.startsWith("utm_") && value && value.length < 200) {
                  utms.set(key, encodeURIComponent(value))
                }
              }

              const utmString = utms.toString()
              if (utmString) {
                url += `?${utmString}`
              }
            } catch (e) {
              console.error('Erro ao processar UTM params:', e)
              // Continua sem UTMs se houver erro
            }
          }

          // Pequeno delay para dar naturalidade e garantir que o router está pronto
          setTimeout(() => {
            setLoadingProgress(100)
            router.push(url)
          }, 300)
        }
      }, 200) // Intervalo de atualização da barra de progresso

      return () => clearInterval(interval)
    } catch (e) {
      console.error("Erro ao iniciar o quiz:", e)
      setErrorMessage("Ocorreu um erro ao iniciar o quiz. Por favor, tente novamente.")
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }, [isLoading, isOnline, router, showPsychologicalModal, modalHasBeenShown])

  const handleClosePsychologicalModal = useCallback(() => {
    setShowPsychologicalModal(false)
    enviarEvento("psychological_modal_close", {
      trigger: "user_close",
      time_on_page_ms: Date.now() - (performance.timing.navigationStart || 0)
    })
  }, [])

  // ==================== RENDER ====================

  return (
    <>
      <head>
        <title>SÍ, ELLA PIENSA EN TI A LAS 2AM - Test Psicológico</title>
        <meta name="description" content="Descubre si tu ex sigue pensando en ti con este test psicológico que revela señales que el 87% ignora. La respuesta podría sorprenderte." />
        <meta property="og:title" content="SÍ, ELLA PIENSA EN TI A LAS 2AM - Test Psicológico" />
        <meta property="og:description" content="Descubre si tu ex sigue pensando en ti con este test psicológico que revela señales que el 87% ignora. La respuesta podría sorprenderte." />
        <meta property="og:image" content="https://comprarplanseguro.shop/wp-content/uploads/2025/09/og-image-quiz.webp" /> {/* Substitua pela sua imagem OG */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://comprarplanseguro.shop" />
        <link rel="dns-prefetch" href="https://comprarplanseguro.shop" />
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
            width: 100%;
            margin: 0 auto;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,.8);
            position: relative;
            z-index: 10;
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
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            border: none;
            padding: 18px 32px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 25px;
            cursor: pointer;
            width: 100%;
            max-width: 320px;
            transition: all 0.3s ease;
            text-transform: uppercase;
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

          .btn-iniciar-quiz:active {
            transform: translateY(0px);
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

          .copyright {
            position: relative;
            margin-top: 40px;
            padding: 20px;
            color: #888;
            font-size: 12px;
            text-align: center;
            z-index: 10;
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

          /* Responsive adjustments */
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

            .copyright {
              margin-top: 30px;
              padding: 15px;
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
          }
        `}</style>

        {/* Loading overlay */}
        {isLoading && (
          <div className="loading-overlay" role="status" aria-label="Carregando análise">
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

        {/* Modal Cinematográfico (PsychologyModal) */}
        {typeof window !== 'undefined' && ( // Garante que o modal só é renderizado no cliente
          <PsychologyModal
            isOpen={showPsychologicalModal}
            onClose={handleClosePsychologicalModal}
            onStartQuiz={handleStart}
            userGender="masculino" // Pode ser dinâmico se você tiver essa informação
          />
        )}

        <div className="container-quiz">
          <div className="logo-container">
            <Image
              src="https://comprarplanseguro.shop/wp-content/uploads/2025/09/logo-quiz-jose-plan.webp"
              alt="Logo José Plan"
              width={120}
              height={75}
              className="logo-pequena"
              priority
            />
          </div>

          <h1 className="titulo-quiz">
            <span className="emoji-alerta">💭</span>
            SÍ, ELLA PIENSA EN TI A LAS 2AM
            <br />
            <span style={{fontSize: '18px', opacity: 0.9, color: '#dc2626'}}>
              (Y Este Test Revela EXACTAMENTE Lo Que Piensa)
            </span>
          </h1>

          <p className="subtitulo-quiz">
            Si sientes que <span className="destaque-palavra">ALGO QUEDÓ INCONCLUSO</span> y no puedes sacártela de la cabeza, no estás loco...
            <br />
            <span className="prova-social">Hay señales que ella envía sin darse cuenta.</span>
            <br />
            <strong style={{color: '#dc2626'}}>¿Quieres saber cuáles?</strong>
          </p>

          {/* NOVO: Modal de Validação Emocional (inline) */}
          <div style={{
            background: 'linear-gradient(135deg, #1f1f23 0%, #2d1b1b 100%)',
            border: '2px solid #dc2626',
            borderRadius: '15px',
            padding: '20px',
            margin: '20px 0',
            position: 'relative',
            textAlign: 'left'
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

          <div className="quiz-info">
            <div>⏱️ {CONFIG.QUIZ_DURATION_MINUTES} MINUTOS</div>
            <div>✅ 100% GRATIS</div>
            <div>🔒 CONFIDENCIAL</div>
          </div>

          <button 
            onClick={handleStart} 
            disabled={isLoading || !isOnline} 
            className="btn-iniciar-quiz"
            aria-label={isLoading ? "Analizando..." : "Descubrir qué piensa de mí"}
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

          {errorMessage && (
            <div style={{color: '#dc2626', marginTop: '15px', fontSize: '14px'}} role="alert">
              {errorMessage}
            </div>
          )}

          <div className="garantia-simples">
            <Shield size={14} />
            <span>100% Confidencial. Tus datos están seguros.</span>
          </div>
        </div>

        <footer className="copyright">
          &copy; {new Date().getFullYear()} José Plan. Todos los derechos reservados.
        </footer>
      </div>
    </>
  )
}