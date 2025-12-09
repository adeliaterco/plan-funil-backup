"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRight, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// GA otimizado - só envia quando necessário
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

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [isOnline, setIsOnline] = useState(true)

  // Detecção de conexão minimalista
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

  // Tracking minimalista - só o essencial
  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      enviarEvento("page_view", {
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        headline_version: "psychological_discovery_2am"
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Função de início ultra-otimizada
  const handleStart = useCallback(() => {
    if (isLoading || !isOnline) return

    setIsLoading(true)
    setLoadingProgress(20)

    enviarEvento("quiz_start", {
      headline_version: "psychological_discovery_2am"
    })

    let progress = 20
    const interval = setInterval(() => {
      progress += 15
      setLoadingProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Preservar UTMs
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
    }, 200)
  }, [isLoading, isOnline, router])

  return (
    <>
      <head>
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
          <div className="loading-overlay">
            <div className="loading-content">
              <div style={{ fontSize: "18px", fontWeight: "600" }}>
                Preparando tu análisis personalizado...
                <div style={{fontSize: "14px", marginTop: "8px", color: "#dc2626"}}>
                  ⚠️ Spot #{Math.floor(Math.random() * 23 + 77)} de 100 reservado
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
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "20px",
              right: "20px",
              background: "#dc2626",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              zIndex: 1000,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Offline indicator */}
        {!isOnline && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              background: "#f59e0b",
              color: "white",
              textAlign: "center",
              padding: "10px",
              zIndex: 1000,
            }}
          >
            ⚠️ Sem conexão com a internet
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL COM NOVA COPY */}
        <div className="main-content">
          <div className="container-quiz">
            
            {/* LOGO CENTRALIZADA */}
            <div className="logo-container">
              <Image
                src="https://comprarplanseguro.shop/wp-content/uploads/2025/10/c2b0ddda-8a7c-4554-a6c9-d57887b06149.webp"
                alt="Logo Plan A"
                width={120}
                height={75}
                className="logo-pequena"
                priority
                quality={70}
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>

            {/* 1. NOVA HEADLINE IMPACTANTE */}
            <h1 className="titulo-quiz">
              <span className="emoji-alerta">🚨</span>
              ELLA SIGUE PENSANDO EN TI
              <br />
              <span style={{fontSize: '20px', opacity: 0.9, color: '#dc2626'}}>
                (El Test Que Lo Revela)
              </span>
            </h1>

            {/* 2. NOVO SUBTÍTULO COM GANCHO PSICOLÓGICO */}
            <p className="subtitulo-quiz">
              Responde <span className="destaque-palavra">7 PREGUNTAS ESPECÍFICAS</span> y descubre si aún sientes algo por ti basándome en señales psicológicas que el 87% ignora...
              <br />
              <span className="prova-social">3,847 hombres ya conocen la verdad sobre su ex.</span>
            </p>

            {/* 5. INFORMAÇÕES DO QUIZ MELHORADAS */}
            <div className="quiz-info">
              <div>⏱️ 2 min</div>
              <div>🎯 Resultado inmediato</div>
              <div>🔥 Análisis personalizado</div>
            </div>

            {/* 4. NOVO: Escassez Real */}
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              borderRadius: '10px',
              padding: '12px',
              margin: '15px 0',
              textAlign: 'center'
            }}>
              <div style={{color: '#dc2626', fontSize: '13px', fontWeight: '600'}}>
                ⚠️ ACCESO LIMITADO HOY
              </div>
              <div style={{color: '#fff', fontSize: '12px', marginTop: '4px'}}>
                Solo 100 personas por día pueden acceder al test completo
              </div>
              <div style={{color: '#dc2626', fontSize: '12px', fontWeight: '600', marginTop: '2px'}}>
                Spots restantes: 23
              </div>
            </div>

            {/* 3. CTA OTIMIZADO */}
            <button 
              onClick={handleStart} 
              disabled={isLoading || !isOnline} 
              className="btn-iniciar-quiz"
            >
              {isLoading ? (
                "PREPARANDO..."
              ) : (
                <>
                  HACER LA PRUEBA AHORA
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* 6. NOVO: Prova Social Específica */}
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

            {/* GARANTIA MÍNIMA */}
            <div className="garantia-simples">
              <Shield size={14} />
              Completamente confidencial
            </div>

          </div>
        </div>

      </div>
    </>
  )
}