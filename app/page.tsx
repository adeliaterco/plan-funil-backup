"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowRight, Shield, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// 
// GA OTIMIZADO - Batch de eventos para melhor performance
// 
const enviarEvento = (() => {
  let queue = []
  let timeout

  return (evento, props = {}) => {
    queue.push({ evento, props })
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (typeof window !== "undefined" && window.gtag && queue.length) {
        queue.forEach(({ evento, props }) => {
          window.gtag("event", evento, {
            timestamp: new Date().toISOString(),
            ...props
          })
        })
        queue = []
      }
    }, 500)
  }
})()

// 
// CONSTANTES DE CONFIGURAÇÃO
// 
const CONFIG = {
  MODAL_DELAY: 8000, // 8 segundos para modal
  SPOTS_TOTAL: 100,
  SPOTS_PER_DAY: 100,
  HEADLINE_VERSION: "psychological_2am_v2", // Para A/B testing
  QUIZ_DURATION_MINUTES: 2
}

// Função para gerar spots restantes de forma consistente
const getConsistentSpots = () => {
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
  const [errorMessage, setErrorMessage] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [showPsychologicalModal, setShowPsychologicalModal] = useState(false)
  const [modalHasBeenShown, setModalHasBeenShown] = useState(false)
  const modalTimerRef = useRef(null)

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
        device: window.innerWidth &lt; 768 ? "mobile" : "desktop",
        headline_version: CONFIG.HEADLINE_VERSION,
        page: "homepage"
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Modal cinematográfico após 8 segundos
  useEffect(() => {
    if (typeof window === "undefined" || modalHasBeenShown) return

    modalTimerRef.current = setTimeout(() => {
      setShowPsychologicalModal(true)
      setModalHasBeenShown(true)

      enviarEvento("psychological_modal_view", {
        time_on_page_ms: 8000,
        device: window.innerWidth &lt; 768 ? "mobile" : "desktop",
        headline_version: CONFIG.HEADLINE_VERSION
      })
    }, CONFIG.MODAL_DELAY)

    return () => {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current)
    }
  }, [modalHasBeenShown])

  // ==================== HANDLERS ====================

  const handleStart = useCallback(() => {
    if (isLoading || !isOnline) return

    setIsLoading(true)
    setLoadingProgress(20)

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
      progress += Math.random() * 20 + 10
      setLoadingProgress(Math.min(progress, 95))

      if (progress >= 95) {
        clearInterval(interval)

        // Preservar UTMs e adicionar session data
        let url = "/quiz/1"
        if (typeof window !== "undefined" && window.location.search) {
          const params = new URLSearchParams(window.location.search)
          const utms = new URLSearchParams()

          for (const [key, value] of params) {
            if (key.startsWith("utm_")) utms.set(key, value)
          }

          if (utms.toString()) url += `?${utms.toString()}`
        }

        // Pequeno delay para dar naturalidade
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

  // ==================== RENDER ====================

  return (
    &lt;>
      <head>
        <title>Descubre si ella piensa en ti - Test Psicológico</title>
        <meta name="description" content="Responde 7 preguntas y descubre si tu ex sigue pensando en ti. 87% ignora estas señales psicológicas." />
        <meta property="og:title" content="Descubre si ella piensa en ti" />
        <meta property="og:description" content="Test psicológico que revela qué piensa de ti basado en señales que el 87% ignora" />
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

          /* Modal Styles */
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
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
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
            transition: color 0.2s ease;
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

            .modal-content {
              max-width: 95%;
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
              </div