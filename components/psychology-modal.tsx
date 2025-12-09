"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

interface PsychologyModalProps {
  isOpen: boolean
  onClose: () => void
  onStartQuiz: () => void
  userGender?: string
}

export const PsychologyModal: React.FC<PsychologyModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  userGender = 'masculino'
}) => {
  const [step, setStep] = useState(0)
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setStep(0)
      setShowCTA(false)
      return
    }

    // Timing otimizado
    const timings = [
      { delay: 300, action: 'step1' },
      { delay: 1200, action: 'step2' },
      { delay: 2400, action: 'step3' },
      { delay: 3600, action: 'showCTA' }
    ]

    const timeouts = timings.map(timing =>
      setTimeout(() => {
        try {
          if (timing.action === 'showCTA') {
            setShowCTA(true)
          } else {
            setStep(prev => prev + 1)
          }
        } catch (e) {
          console.error('Erro ao animar modal:', e)
        }
      }, timing.delay)
    )

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [isOpen])

  const handleStartClick = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'psychology_modal_cta_click', {
          action: 'iniciar_quiz_from_modal'
        })
      }
      onStartQuiz()
    } catch (e) {
      console.error('Erro ao clicar no CTA:', e)
      onStartQuiz()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-orange-500/50 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-400"
        onClick={e => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
          aria-label="Fechar modal"
        >
          ×
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* STEP 1: HEADLINE */}
          {step >= 0 && (
            <div className="text-center animate-in fade-in duration-400">
              <div className="flex justify-center mb-3">
                <div className="text-3xl animate-pulse">🧠</div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                ¿ELLA SIGUE PENSANDO EN TI?
              </h2>
              <p className="text-orange-400 text-sm font-semibold mt-2">
                (La respuesta podría sorprenderte)
              </p>
            </div>
          )}

          {/* STEP 2: VALIDACIÓN */}
          {step >= 1 && (
            <div className="bg-red-900/20 border border-red-600/40 rounded-lg p-4 animate-in fade-in duration-400">
              <div className="flex gap-3">
                <div className="w-5 h-5 text-red-400 flex-shrink-0 mt-1">❤️</div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">
                    No estás solo
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    3,847 hombres ya descubrieron lo que ella realmente siente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVELACIÓN */}
          {step >= 2 && (
            <div className="bg-blue-900/20 border border-blue-600/40 rounded-lg p-4 animate-in fade-in duration-400">
              <div className="flex gap-3">
                <div className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">📈</div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">
                    Ciencia comprobada
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    El 87% de las mujeres siguen pensando en su ex durante los primeros 3 meses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {showCTA && (
            <div className="animate-in fade-in zoom-in duration-300">
              <button
                onClick={handleStartClick}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 rounded-full shadow-lg text-sm sm:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                🔍 DESCUBRIR QUÉ PIENSA DE MÍ
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* GARANTÍA */}
          <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>100% Confidencial • Sin datos guardados</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation: fadeIn 0.4s ease-out;
        }

        .zoom-in {
          animation: zoomIn 0.4s ease-out;
        }

        .duration-400 {
          animation-duration: 0.4s;
        }

        .duration-300 {
          animation-duration: 0.3s;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}