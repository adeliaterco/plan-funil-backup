"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gift,
  Check,
  ArrowRight,
  ArrowLeft,
  Heart,
  Clock,
  AlertTriangle,
  User,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Users,
  MessageCircle,
  Smile,
  Star,
  CheckCircle,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  quizSteps, 
  socialProofMessages, 
  getPersonalizedContent,
  getExName,
  getExAvatar,
  getPersonalizedFirstMessage,
  getPersonalizedExResponse,
  getPersonalizedFollowUp,
  getHeaderName,
  getPersonalizedFirstInsight,
  getPersonalizedTechnique,
  getUserAnswer // Importar para validação
} from "@/lib/quiz-data"
import { BonusUnlock } from "@/components/bonus-unlock"
import { ValueCounter } from "@/components/value-counter"
import { LoadingAnalysis } from "@/components/loading-analysis"

// Função para enviar eventos a Google Analytics
function enviarEvento(nombre_evento: string, propriedades: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', nombre_evento, propriedades);
    console.log('Evento GA4 enviado:', nombre_evento, propriedades);
  }
}

// === COMPONENTE WHATSAPP MOCKUP FUNCIONAL ===
const WhatsAppMockup = ({ userGender, onComplete }: { userGender: string; onComplete: () => void }) => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [analysisPoints, setAnalysisPoints] = useState([
    { status: 'pending', text: 'Enviando mensaje optimizado...' },
    { status: 'pending', text: 'Generando curiosidad e interés...' },
    { status: 'pending', text: 'Activando memoria emocional...' },
    { status: 'pending', text: 'Respuesta emocional detectada...' }
  ])
  const [successPercentage, setSuccessPercentage] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  
  const hasStartedRef = useRef(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const onCompleteCalledRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const updateAnalysisPoint = useCallback((pointIndex: number, status: 'pending' | 'active' | 'completed') => {
    setAnalysisPoints(prev => prev.map((point, index) => 
      index === pointIndex ? { ...point, status } : point
    ))
  }, [])

  const animateSuccessPercentage = useCallback(() => {
    let current = 0
    const target = 89
    const increment = target / 15
    
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    intervalRef.current = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setAnimationComplete(true)
      }
      setSuccessPercentage(Math.round(current))
    }, 50)
  }, [])

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const addTimeout = (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(callback, delay)
      timeoutsRef.current.push(timeoutId)
      return timeoutId
    }

    const sequence = [
      { delay: 500, action: () => {
        setCurrentMessage(1)
        updateAnalysisPoint(0, 'active')
      }},
      { delay: 1200, action: () => {
        setIsTyping(true)
        updateAnalysisPoint(0, 'completed')
        updateAnalysisPoint(1, 'active')
      }},
      { delay: 2000, action: () => {
        setIsTyping(false)
        setCurrentMessage(2)
        updateAnalysisPoint(1, 'completed')
        updateAnalysisPoint(2, 'active')
      }},
      { delay: 3000, action: () => {
        setCurrentMessage(3)
        updateAnalysisPoint(2, 'completed')
        updateAnalysisPoint(3, 'active')
      }},
      { delay: 4000, action: () => {
        updateAnalysisPoint(3, 'completed')
        animateSuccessPercentage()
      }}
    ]

    sequence.forEach(step => addTimeout(step.action, step.delay))

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [updateAnalysisPoint, animateSuccessPercentage])

  useEffect(() => {
    if (animationComplete && !onCompleteCalledRef.current) {
      onCompleteCalledRef.current = true
      
      enviarEvento('completou_whatsapp_mockup', {
        numero_etapa: 12,
        success_percentage: successPercentage,
        timestamp: new Date().toISOString()
      });

      const timeoutId = setTimeout(() => {
        onComplete && onComplete()
      }, 1000)
      timeoutsRef.current.push(timeoutId)
    }
  }, [animationComplete, onComplete, successPercentage])

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-8">
      {/* iPhone Mockup */}
      <div className="w-[300px] h-[600px] relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[35px] p-2 shadow-2xl">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[150px] h-[25px] bg-black rounded-b-[15px] z-10"></div>
        <div className="bg-black h-full rounded-[28px] overflow-hidden flex flex-col">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] pt-9 pb-4 px-4 flex items-center text-white text-sm">
            <div className="mr-2 text-lg">←</div>
            <img src={getExAvatar()} className="w-10 h-10 rounded-full mr-2 object-cover" alt="Avatar" />
            <div className="flex-1">
              <div className="font-bold mb-0.5">{getExName()}</div>
              <div className="text-xs text-[#b3d4d1]">
                {isTyping ? 'escribiendo...' : 'En línea'}
              </div>
            </div>
            <div className="flex gap-4">
              <span>📹</span>
              <span>📞</span>
              <span>⋮</span>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 bg-[#ece5dd] p-4 overflow-y-auto relative" style={{backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><rect width='20' height='20' fill='%23ece5dd'/><rect x='0' y='0' width='10' height='10' fill='%23e8ddd4'/><rect x='10' y='10' width='10' height='10' fill='%23e8ddd4'/></svg>")`}}>
            
            <div className="text-center my-2">
              <span className="bg-black/10 text-gray-600 px-3 py-1 rounded-full text-xs">Hoy</span>
            </div>
            
            {/* Mensaje del usuario */}
            <AnimatePresence>
              {currentMessage >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-auto bg-[#dcf8c6] rounded-xl rounded-br-sm max-w-[80%] my-2 p-2 pb-1 text-sm leading-tight text-right"
                >
                  {getPersonalizedFirstMessage()}
                  <div className="px-1 pt-1 text-xs text-gray-600">19:30 ✓✓</div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mr-auto bg-white rounded-xl rounded-bl-sm max-w-[60px] my-2 p-3"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
              </motion.div>
            )}
            
            {/* Respuesta de la ex */}
            <AnimatePresence>
              {currentMessage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mr-auto bg-white rounded-xl rounded-bl-sm max-w-[80%] my-2 p-2 pb-1 text-sm leading-tight text-left"
                >
                  {getPersonalizedExResponse()}
                  <div className="px-1 pt-1 text-xs text-gray-600">19:47</div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Segundo mensaje del usuario */}
            <AnimatePresence>
              {currentMessage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-auto bg-[#dcf8c6] rounded-xl rounded-br-sm max-w-[80%] my-2 p-2 pb-1 text-sm leading-tight text-right"
                >
                  {getPersonalizedFollowUp()}
                  <div className="px-1 pt-1 text-xs text-gray-600">19:52 ✓✓</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* WhatsApp Input */}
          <div className="bg-gray-100 p-2">
            <div className="bg-white rounded-full flex items-center px-4 py-2 gap-2">
              <span className="text-lg">😊</span>
              <div className="flex-1 text-gray-500 text-sm">Escribe un mensaje</div>
              <span className="text-lg">📎</span>
              <span className="text-lg">🎤</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Análise em tempo real */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white max-w-sm w-full">
        <h3 className="text-lg font-bold text-center mb-4">
          📊 ANÁLISIS PSICOLÓGICO EN TIEMPO REAL
        </h3>
        
        <div className="space-y-3 mb-6">
          {analysisPoints.map((point, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-3 p-2 bg-white/10 rounded-lg"
              animate={{
                scale: point.status === 'active' ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: point.status === 'active' ? Infinity : 0,
              }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                point.status === 'pending' ? 'bg-white/20 text-yellow-300' :
                point.status === 'active' ? 'bg-green-500 text-white animate-pulse' :
                'bg-green-500 text-white'
              }`}>
                {point.status === 'completed' ? '✓' : 
                 point.status === 'active' ? '⚡' : '⏳'}
              </div>
              <div className="text-sm flex-1">{point.text}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-white/20 border-t-green-500 rounded-full flex flex-col items-center justify-center mx-auto animate-spin-slow">
            <div className="text-2xl font-bold text-green-400">{successPercentage}%</div>
            <div className="text-xs text-gray-300 mt-0.5">Probabilidad de éxito</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// === COMPONENTE CODE UNLOCK REVEAL ===
const CodeUnlockReveal = ({ onComplete, userGender }: { onComplete: () => void; userGender: string }) => {
  const [displayText, setDisplayText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(true)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [decryptionComplete, setDecryptionComplete] = useState(false)
  const decryptionStartTimeRef = useRef<number | null>(null);

  const fullContent = useCallback(() => {
    const insight = getPersonalizedFirstInsight();
    const technique = getPersonalizedTechnique();
    return `🎯 TU PLAN A PERSONALIZADO ESTÁ LISTO\n\nDespués de crear tu demostración específica, he confirmado que tu situación tiene **89% de probabilidad de éxito** usando el Plan A.\n\n${insight}\n\nEsta es solo la PRIMERA de las 21 técnicas específicas para tu caso:\n\n${technique}`;
  }, [userGender]);

  const getRandomChars = useCallback((length: number) => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isDecrypting) {
      decryptionStartTimeRef.current = Date.now();
      const targetText = fullContent();
      const randomChars = getRandomChars(targetText.length);
      let revealIndex = 0;

      intervalId = setInterval(() => {
        if (revealIndex < targetText.length) {
          const newText = targetText.substring(0, revealIndex + 1) + 
                         randomChars.slice(revealIndex + 1).join('');
          setDisplayText(newText);
          revealIndex++;
        } else {
          clearInterval(intervalId);
          setIsDecrypting(false);
          setDecryptionComplete(true);
          setDisplayText(targetText);
          
          const timeToDecrypt = decryptionStartTimeRef.current ? (Date.now() - decryptionStartTimeRef.current) / 1000 : 0;
          enviarEvento('completou_code_unlock', {
            numero_etapa: 13,
            tempo_descriptografia: timeToDecrypt,
            timestamp: new Date().toISOString()
          });

          setTimeout(() => {
            setContentRevealed(true);
            setShowButton(true);
          }, 100);
        }
      }, 8);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isDecrypting, fullContent, getRandomChars]);

  return (
    <div className="relative min-h-[600px] bg-black overflow-hidden rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center">
      {/* Matrix Background Effect */}
      <style jsx>{`
        @keyframes matrix-fall {
          from { background-position: 0 0; }
          to { background-position: -1000px -1000px; }
        }
        .matrix-bg {
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
          opacity: ${isDecrypting ? 0.2 : 0};
          transition: opacity 1s ease-out;
          z-index: 0;
        }
        .matrix-text {
          font-family: 'monospace', 'Courier New', Courier, monospace;
          color: #0f0;
          text-shadow: 0 0 8px #0f0;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.2;
          font-size: 0.9rem;
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .matrix-text::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="matrix-bg"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 mb-6">
          <span className="text-white">PLAN</span> <span className="text-green-500">DESBLOQUEADO</span>
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 border border-green-700 rounded-lg p-4 sm:p-6 mb-8 shadow-lg"
        >
          <p className="matrix-text text-left">
            {displayText}
          </p>
        </motion.div>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="mt-8"
            >
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg w-full sm:w-auto text-lg transform hover:scale-105 transition-all duration-200"
              >
                🚀 ACCEDER AL PLAN A COMPLETO
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showButton && decryptionComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }} // Corrigido para 0.5s
            className="mt-8"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg w-full sm:w-auto text-lg"
            >
              ⚠️ CONTINUAR AL RESULTADO
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default function QuizStep() {
  const params = useParams()
  const router = useRouter()
  const step = Number.parseInt(params.step as string)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [quizData, setQuizData] = useState<any>({})
  const [unlockedBonuses, setUnlockedBonuses] = useState<number[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [showBonusUnlock, setShowBonusUnlock] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [newBonus, setNewBonus] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [peopleCount, setPeopleCount] = useState(17)
  const [userGender, setUserGender] = useState<string>("")
  const [step12Completed, setStep12Completed] = useState(false)
  const [step13AnimationComplete, setStep13AnimationComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false); // NOVO: Estado para evitar múltiplos cliques
  const stepStartTimeRef = useRef<number | null>(null); // NOVO: Para rastrear tempo na etapa

  const currentStep = quizSteps[step - 1]
  const progress = (step / 13) * 100

  // NOVO: Função para rastrear scroll na Etapa 11
  const trackStep11Scroll = useCallback(() => {
    if (step !== 11) return;

    const isInViewport = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    const handleScroll = () => {
      const reportageImg = document.querySelector('img[alt*="Reportagem"]');
      const curiousImg = document.querySelector('img[alt*="Evidência"]');

      if (reportageImg && isInViewport(reportageImg)) {
        enviarEvento('scroll_para_reportagem_etapa_11', {
          numero_etapa: 11,
          timestamp: new Date().toISOString()
        });
        // Remover listener após visualização para evitar múltiplos eventos
        window.removeEventListener('scroll', handleScroll);
      } else if (curiousImg && isInViewport(curiousImg)) {
        enviarEvento('scroll_para_evidencia_etapa_11', {
          numero_etapa: 11,
          timestamp: new Date().toISOString()
        });
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step]);

  const proceedToNextStep = useCallback(() => {
    const currentUrl = new URL(window.location.href);
    let utmString = '';
    
    const utmParams = new URLSearchParams();
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.append(key, value);
      }
    }
    
    if (utmParams.toString() !== '') {
      utmString = '?' + utmParams.toString();
    }

    const currentStepData = quizSteps[step - 1];
    if (currentStepData?.bonusUnlock && !unlockedBonuses.includes(currentStepData.bonusUnlock.id)) {
      enviarEvento('desbloqueou_bonus', {
        numero_etapa: step,
        bonus_id: currentStepData.bonusUnlock.id,
        bonus_titulo: currentStepData.bonusUnlock.title,
        bonus_valor: currentStepData.bonusUnlock.value, // NOVO: Valor do bônus
        timestamp: new Date().toISOString()
      });

      const newUnlockedBonuses = [...unlockedBonuses, currentStepData.bonusUnlock.id]
      const newTotalValue = totalValue + currentStepData.bonusUnlock.value

      setUnlockedBonuses(newUnlockedBonuses)
      setTotalValue(newTotalValue)

      const personalizedBonus = {
        ...currentStepData.bonusUnlock,
        title: currentStepData.bonusUnlock?.title || 'Bonus desbloqueado',
        description: currentStepData.bonusUnlock?.description || 'Descripción del bonus',
      }
      setNewBonus(personalizedBonus)

      try { // NOVO: Try-catch para localStorage
        localStorage.setItem("unlockedBonuses", JSON.stringify(newUnlockedBonuses))
        localStorage.setItem("totalValue", newTotalValue.toString())
        enviarEvento('salvou_unlocked_bonuses', {
          numero_etapa: step,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        console.error('Erro ao salvar unlockedBonuses/totalValue:', error);
        enviarEvento('erro_salvar_unlocked_bonuses', {
          numero_etapa: step,
          erro: error.message,
          timestamp: new Date().toISOString()
        });
      }

      setShowBonusUnlock(true)
      return
    }

    if (step < 13) {
      router.push(`/quiz/${step + 1}${utmString}`)
    } else {
      enviarEvento('concluiu_quiz', {
        total_etapas_completadas: 13,
        total_bonus_desbloqueados: unlockedBonuses.length,
        timestamp: new Date().toISOString()
      });
      
      router.push(`/resultado${utmString}`)
    }
  }, [step, router, unlockedBonuses, totalValue]);

  const handleNext = useCallback(() => {
    if (isProcessing) return; // NOVO: Previne múltiplos cliques
    setIsProcessing(true); // NOVO: Inicia processamento

    // NOVO: Rastreamento de tempo na etapa
    if (stepStartTimeRef.current) {
      const timeSpent = (Date.now() - stepStartTimeRef.current) / 1000;
      enviarEvento('tempo_etapa_quiz', {
        numero_etapa: step,
        tempo_segundos: timeSpent,
        timestamp: new Date().toISOString()
      });
    }

    // NOVO: Validação de resposta para etapas com opções
    if (getPersonalizedOptions().length > 0 && !selectedAnswer) {
      enviarEvento('tentou_avancar_sem_resposta', {
        numero_etapa: step,
        pergunta: quizSteps[step - 1]?.question,
        timestamp: new Date().toISOString()
      });
      console.warn(`Etapa ${step}: Tentou avançar sem selecionar uma resposta.`);
      setIsProcessing(false); // NOVO: Libera processamento
      return;
    }

    enviarEvento('avancou_etapa', {
      numero_etapa: step,
      pergunta: quizSteps[step - 1]?.question || `Etapa ${step}`,
      resposta_selecionada: selectedAnswer,
      timestamp: new Date().toISOString()
    });

    const newQuizData = { ...quizData, [step]: selectedAnswer }
    setQuizData(newQuizData)
    try { // NOVO: Try-catch para localStorage
      localStorage.setItem("quizData", JSON.stringify(newQuizData))
      enviarEvento('salvou_quiz_data', {
        numero_etapa: step,
        dados_salvos: Object.keys(newQuizData).length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erro ao salvar quizData:', error);
      enviarEvento('erro_salvar_quiz_data', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
    }

    const answers = window.quizAnswers || {}
    answers[`question${step}`] = selectedAnswer
    window.quizAnswers = answers
    try { // NOVO: Try-catch para localStorage
      localStorage.setItem("quizAnswers", JSON.stringify(answers))
      enviarEvento('salvou_quiz_answers', {
        numero_etapa: step,
        dados_salvos: Object.keys(answers).length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erro ao salvar quizAnswers:', error);
      enviarEvento('erro_salvar_quiz_answers', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
    }

    const currentStepData = quizSteps[step - 1];
    if (currentStepData?.elements?.analysisText || currentStepData?.elements?.profileAnalysis) {
      setShowAnalysis(true)
      setTimeout(() => {
        setShowAnalysis(false)
        proceedToNextStep()
        setIsProcessing(false); // NOVO: Libera processamento
      }, 1000)
      return
    }

    proceedToNextStep()
    setIsProcessing(false); // NOVO: Libera processamento
  }, [step, selectedAnswer, quizData, isProcessing, proceedToNextStep, quizSteps, getPersonalizedOptions]);

  const handleAnswerSelect = useCallback((answer: string) => {
    if (isProcessing && step === 1) return; // NOVO: Previne múltiplos cliques apenas para step 1
    setIsProcessing(true); // NOVO: Inicia processamento

    setSelectedAnswer(answer)

    try { // NOVO: Try-catch para a lógica de seleção
      if (step === 1) {
        enviarEvento('quiz_start', {
          perfil_selecionado: answer,
          auto_advance: true,
          step: 1,
          timestamp: new Date().toISOString()
        });
        
        setUserGender(answer)
        localStorage.setItem("userGender", answer)
        
        setTimeout(() => {
          handleNext()
          setIsProcessing(false); // NOVO: Libera processamento após timeout
        }, 800) // Corrigido para 800ms
        return
      }

      enviarEvento('selecionou_resposta', {
        numero_etapa: step,
        pergunta: quizSteps[step - 1]?.question || `Etapa ${step}`,
        resposta: answer,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erro ao selecionar resposta:', error);
      enviarEvento('erro_selecionou_resposta', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
    }
    setIsProcessing(false); // NOVO: Libera processamento para outros steps imediatamente
  }, [step, isProcessing, handleNext, quizSteps, setUserGender, selectedAnswer]); // Adicionado selectedAnswer e quizSteps

  useEffect(() => {
    stepStartTimeRef.current = Date.now(); // NOVO: Inicia contador de tempo na etapa

    try { // NOVO: Try-catch para localStorage
      const saved = localStorage.getItem("quizData")
      const savedBonuses = localStorage.getItem("unlockedBonuses")
      const savedValue = localStorage.getItem("totalValue")
      const savedGender = localStorage.getItem("userGender")
      const savedAnswers = localStorage.getItem("quizAnswers")

      if (saved) setQuizData(JSON.parse(saved))
      if (savedBonuses) setUnlockedBonuses(JSON.parse(savedBonuses))
      if (savedValue) setTotalValue(Number.parseInt(savedValue))
      if (savedGender) setUserGender(savedGender)
      if (savedAnswers) {
        window.quizAnswers = JSON.parse(savedAnswers)
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do localStorage:', error);
      enviarEvento('erro_carregar_localstorage', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
    }

    const loadTimer = setTimeout(() => setIsLoaded(true), 100)

    const currentStepData = quizSteps[step - 1];
    enviarEvento('visualizou_etapa_quiz', {
      numero_etapa: step,
      pergunta: currentStepData?.question || `Etapa ${step}`,
      timestamp: new Date().toISOString()
    });
    // NOVO: Evento específico por etapa
    enviarEvento(`visualizou_etapa_${step}`, {
      numero_etapa: step,
      pergunta: currentStepData?.question,
      timestamp: new Date().toISOString()
    });
    // NOVO: Eventos específicos para etapas críticas
    if (step === 11) {
      enviarEvento('visualizou_etapa_11_reportagem', {
        numero_etapa: 11,
        tipo: 'ciencia_e_evidencia',
        timestamp: new Date().toISOString()
      });
      trackStep11Scroll(); // NOVO: Inicia rastreamento de scroll para Etapa 11
    }
    if (step === 12) {
      enviarEvento('visualizou_etapa_12_whatsapp', {
        numero_etapa: 12,
        tipo: 'simulacao_whatsapp',
        timestamp: new Date().toISOString()
      });
    }
    if (step === 13) {
      enviarEvento('visualizou_etapa_13_desbloqueio', {
        numero_etapa: 13,
        tipo: 'codigo_desbloqueado',
        timestamp: new Date().toISOString()
      });
    }

    let autoAdvanceTimer: NodeJS.Timeout | undefined;
    if (currentStepData?.autoAdvance) {
      autoAdvanceTimer = setTimeout(() => {
        proceedToNextStep()
      }, 2000)
    }

    return () => {
      clearTimeout(loadTimer)
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
      // NOVO: Rastreamento de tempo na etapa ao sair
      if (stepStartTimeRef.current) {
        const timeSpent = (Date.now() - stepStartTimeRef.current) / 1000;
        enviarEvento('tempo_etapa_quiz_saida', {
          numero_etapa: step,
          tempo_segundos: timeSpent,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [step, proceedToNextStep, trackStep11Scroll]); // Adicionado trackStep11Scroll

  // NOVO: Rastreamento de abandono
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (step > 1 && !selectedAnswer && !isProcessing) { // Verifica se não está processando
        enviarEvento('abandonou_quiz', {
          numero_etapa: step,
          pergunta: quizSteps[step - 1]?.question,
          timestamp: new Date().toISOString()
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [step, selectedAnswer, isProcessing, quizSteps]);

  const handleStep12Complete = useCallback(() => {
    setStep12Completed(true)
  }, [])

  const handleStep13Complete = useCallback(() => {
    setStep13AnimationComplete(true)
  }, [])

  const handleBonusUnlockComplete = useCallback(() => {
    setShowBonusUnlock(false)
    
    enviarEvento('completou_bonus_unlock', { // NOVO: Rastreamento de conclusão do bônus
      numero_etapa: step,
      bonus_id: newBonus?.id,
      bonus_titulo: newBonus?.title,
      timestamp: new Date().toISOString()
    });

    const currentUrl = new URL(window.location.href);
    let utmString = '';
    
    const utmParams = new URLSearchParams();
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.append(key, value);
      }
    }
    
    if (utmParams.toString() !== '') {
      utmString = '?' + utmParams.toString();
    }
    
    if (step < 13) {
      router.push(`/quiz/${step + 1}${utmString}`)
    } else {
      router.push(`/resultado${utmString}`)
    }
  }, [step, router, newBonus]);

  const handleBack = useCallback(() => {
    enviarEvento('retornou_etapa', {
      de_etapa: step,
      para_etapa: step > 1 ? step - 1 : 'inicio',
      timestamp: new Date().toISOString()
    });
    
    const currentUrl = new URL(window.location.href);
    let utmString = '';
    
    const utmParams = new URLSearchParams();
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.append(key, value);
      }
    }
    
    if (utmParams.toString() !== '') {
      utmString = '?' + utmParams.toString();
    }
    
    if (step > 1) {
      router.push(`/quiz/${step - 1}${utmString}`)
    } else {
      router.push(`/${utmString}`)
    }
  }, [step, router])

  const getStepIcon = (stepNumber: number, index: number) => {
    const iconMaps: { [key: number]: (typeof User)[] } = { // Tipagem corrigida
      1: [User, Users],
      2: [Calendar, TrendingUp, Target, Zap],
      3: [Clock, Calendar, MessageCircle, Heart],
      4: [Heart, MessageCircle, Users],
      5: [Calendar, Heart, TrendingUp, Clock],
      6: [Smile, Heart, MessageCircle, TrendingUp, Target, Zap],
      7: [MessageCircle, Heart, Users, TrendingUp, Smile, Users, Heart],
      8: [MessageCircle, Heart, Users, TrendingUp, Smile],
      9: [Heart, TrendingUp, Target, Zap],
    }

    const icons = iconMaps[stepNumber] || [Heart]
    const Icon = icons[index] || Heart
    return <Icon className="w-6 h-6" />
  }

  const getPersonalizedQuestion = () => {
    try { // NOVO: Try-catch
      return getPersonalizedContent(currentStep.question, userGender)
    } catch (error: any) {
      console.error('Erro ao obter personalized question:', error);
      enviarEvento('erro_personalized_question', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
      return currentStep.question; // Fallback
    }
  }

  const getPersonalizedDescription = () => {
    const desc = currentStep.description
    if (typeof desc === 'function') {
      try {
        return desc()
      } catch (error: any) {
        console.error('Erro ao executar função de description:', error)
        enviarEvento('erro_personalized_description_func', {
          numero_etapa: step,
          erro: error.message,
          timestamp: new Date().toISOString()
        });
        return ''
      }
    }
    try { // NOVO: Try-catch
      return getPersonalizedContent(desc, userGender)
    } catch (error: any) {
      console.error('Erro ao obter personalized description:', error);
      enviarEvento('erro_personalized_description', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
      return desc; // Fallback
    }
  }

  const getPersonalizedSubtext = () => {
    const subtext = currentStep.subtext
    if (typeof subtext === 'function') {
      try {
        return subtext()
      } catch (error: any) {
        console.error('Erro ao executar função de subtext:', error)
        enviarEvento('erro_personalized_subtext_func', {
          numero_etapa: step,
          erro: error.message,
          timestamp: new Date().toISOString()
        });
        return ''
      }
    }
    try { // NOVO: Try-catch
      return getPersonalizedContent(subtext, userGender)
    } catch (error: any) {
      console.error('Erro ao obter personalized subtext:', error);
      enviarEvento('erro_personalized_subtext', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
      return subtext; // Fallback
    }
  }

  const getPersonalizedOptions = () => {
    try { // NOVO: Try-catch
      const options = getPersonalizedContent(currentStep.options, userGender)
      return Array.isArray(options) ? options : currentStep.options
    } catch (error: any) {
      console.error('Erro ao obter personalized options:', error);
      enviarEvento('erro_personalized_options', {
        numero_etapa: step,
        erro: error.message,
        timestamp: new Date().toISOString()
      });
      return currentStep.options; // Fallback
    }
  }

  if (!currentStep) {
    enviarEvento('erro_current_step_nao_encontrado', { // NOVO: Rastreamento de erro
      numero_etapa: step,
      timestamp: new Date().toISOString()
    });
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-white hover:bg-white/20 border border-white/20"
              disabled={currentStep?.autoAdvance || isProcessing} // NOVO: Desabilita botão voltar durante processamento
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <div className="flex items-center gap-4">
              {currentStep?.elements?.timer && (
                <div className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{currentStep.elements.timer}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/20 rounded-full p-1 mb-2">
            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-white text-sm">
              Etapa {step} de 13 • {Math.round(progress)}% completado
            </p>
          </div>
        </div>

        {/* ✅ STEP 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
              <CardContent className="p-6 sm:p-8 text-center">
                
                <motion.h1 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  🎯 <span className="text-blue-400">¿HOMBRE</span> o <span className="text-pink-400">MUJER?</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-gray-300 text-lg mb-8"
                >
                  Solo para calibrar tu plan perfecto...
                </motion.p>

                <div className="space-y-4 max-w-md mx-auto">
                  <motion.button
                    onClick={() => handleAnswerSelect("SOY HOMBRE")}
                    className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl text-xl sm:text-2xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg border-2 border-blue-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    disabled={isProcessing} // CORRIGIDO: Usa isProcessing
                  >
                    {isProcessing && selectedAnswer === "SOY HOMBRE" ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                    ) : (
                      '👨 SOY HOMBRE'
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswerSelect("SOY MUJER")}
                    className="w-full p-6 bg-gradient-to-r from-pink-600 to-purple-800 hover:from-pink-500 hover:to-purple-700 text-white rounded-xl text-xl sm:text-2xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg border-2 border-pink-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    disabled={isProcessing} // CORRIGIDO: Usa isProcessing
                  >
                    {isProcessing && selectedAnswer === "SOY MUJER" ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                    ) : (
                      '👩 SOY MUJER'
                    )}
                  </motion.button>
                </div>

                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 text-green-400 text-lg font-bold"
                  >
                    ✅ ¡Seleccionado! Calibrando tu perfil...
                  </motion.div>
                )}

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="text-green-400 text-sm mt-8 font-semibold"
                >
                  ✅ +12,847 personas ya obtuvieron su plan
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ✅ STEP 12 - VERSÃO FUNCIONAL COMPLETA */}
        {step === 12 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                    🔥 <span className="text-red-500">ESTO ES LO QUE ELLA REALMENTE TE</span> RESPONDERÍA
                  </h2>
                  
                  <p className="text-orange-200 text-center mb-4 text-base sm:text-lg font-medium">
                    ⚠️ <strong>ADVERTENCIA:</strong> Simulación personalizada para tu situación específica
                  </p>
                  
                  
                  <WhatsAppMockup userGender={userGender} onComplete={handleStep12Complete} />
                  
                  <AnimatePresence>
                    {step12Completed && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                      >
                        <Button
                          onClick={handleNext}
                          size="lg"
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg w-full sm:w-auto"
                          disabled={isProcessing} // NOVO: Desabilita botão durante processamento
                        >
                          {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          ) : (
                            'VER MI PLAN PERSONALIZADO'
                          )}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <p className="text-gray-400 text-xs mt-3">
                    ⏰ Disponible solo por las próximas 4 horas
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ✅ STEP 13 - CÓDIGO DESBLOQUEADO SEM BUGS */}
        {step === 13 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-green-500/30 shadow-2xl border-2">
              <CardContent className="p-0">
                <CodeUnlockReveal onComplete={handleNext} userGender={userGender} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* RESTO DOS STEPS (2-11) */}
        {step !== 1 && step !== 12 && step !== 13 && (
          <>
            {/* Testimonial Display */}
            {currentStep?.elements?.testimonialDisplay && (currentStep?.elements?.testimonialText || (currentStep?.elements?.testimonialData && currentStep.elements.testimonialData())) && ( // Corrigido
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6"
              >
                <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-yellow-500/40 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        {currentStep.elements.testimonialImage || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().image) ? (
                          <motion.img
                            src={currentStep.elements.testimonialImage || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().image)}
                            alt={currentStep.elements.testimonialName || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().name) || "Cliente"}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-yellow-500 shadow-md"
                            animate={{
                              y: [0, -2, 0],
                              scale: [1, 1.01, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            onError={(e: any) => { // NOVO: Rastreamento de erro de imagem
                              console.error('Erro ao carregar imagem de depoimento:', e.target.src);
                              enviarEvento('erro_carregar_imagem', {
                                numero_etapa: step,
                                tipo: 'depoimento',
                                url: e.target.src,
                                timestamp: new Date().toISOString()
                              });
                              e.target.style.display = 'none'; // Esconde imagem quebrada
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {currentStep.elements.testimonialName || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().name) ? (
                            <p className="text-yellow-400 font-bold text-sm sm:text-base truncate">
                              {currentStep.elements.testimonialName || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().name)}
                            </p>
                          ) : null}
                          
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 + 0.2 }}
                              >
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <motion.div 
                        className="bg-gray-700/30 rounded-lg p-3 sm:p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-white text-sm sm:text-base leading-relaxed italic">
                          "{currentStep.elements.testimonialText || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().text)}"
                        </p>
                      </motion.div>

                      <motion.div 
                        className="flex items-center justify-center gap-1 text-green-400 text-xs font-semibold bg-green-900/20 rounded-full py-1 px-3 self-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>VERIFICADO</span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tarjeta de Pregunta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
                <CardContent className="p-6 sm:p-8">
                  
                  {/* Auto advance step */}
                  {currentStep?.autoAdvance && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      {currentStep?.elements?.expertImage ? (
                        <motion.img
                          src={currentStep.elements.expertImage}
                          alt="Experto en Reconquista"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-600 mx-auto mb-6"
                          animate={{
                            y: [0, -8, 0],
                            scale: [1, 1.02, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          onError={(e: any) => { // NOVO: Rastreamento de erro de imagem
                            console.error('Erro ao carregar imagem de especialista:', e.target.src);
                            enviarEvento('erro_carregar_imagem', {
                              numero_etapa: step,
                              tipo: 'especialista',
                              url: e.target.src,
                              timestamp: new Date().toISOString()
                            });
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                          <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      )}

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <p className="text-blue-400 font-semibold text-base sm:text-lg mb-4">{currentStep.elements?.autoMessage}</p>
                      </motion.div>

                      <div className="flex justify-center">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-3 h-3 bg-blue-500 rounded-full"
                              animate={{
                                opacity: [0.3, 1, 0.3],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Final reveal para step 13 */}
                  {currentStep?.elements?.finalReveal && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mb-6"
                      >
                        <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                            <span className="text-xl sm:text-2xl font-bold text-green-400">
                              {currentStep.elements.profileComplete}
                            </span>
                          </div>
                          <p className="text-green-300 font-medium text-sm sm:text-base">Análisis Completo</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                          <span className="text-blue-300 font-semibold text-sm sm:text-base">Plan Personalizado Generado</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Foto de experto para el paso 11 y 13 */}
                  {currentStep?.elements?.expertPhoto && !currentStep?.autoAdvance && (
                    <div className="flex justify-center mb-6">
                      {currentStep?.elements?.expertImage ? (
                        <motion.img
                          src={currentStep.elements.expertImage}
                          alt="Experto en Reconquista"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-blue-600"
                          animate={{
                            y: [0, -6, 0],
                            rotate: [0, 2, -2, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          onError={(e: any) => { // NOVO: Rastreamento de erro de imagem
                            console.error('Erro ao carregar imagem de especialista:', e.target.src);
                            enviarEvento('erro_carregar_imagem', {
                              numero_etapa: step,
                              tipo: 'especialista',
                              url: e.target.src,
                              timestamp: new Date().toISOString()
                            });
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Compatibilidade calculation for step 11 */}
                  {currentStep?.elements?.compatibilityCalc && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "91%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="mb-6"
                    >
                      <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-green-400">
                          {currentStep.elements.compatibilityCalc} de compatibilidad
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!currentStep?.autoAdvance && (
                    <>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 text-center leading-tight">
                        {getPersonalizedQuestion()}
                      </h2>

                      {getPersonalizedSubtext() && (
                        <p className="text-orange-200 text-center mb-6 text-base sm:text-lg font-medium whitespace-pre-wrap">{getPersonalizedSubtext()}</p>
                      )}

                      {getPersonalizedDescription() && (
                        <div className="text-gray-300 text-center mb-8 text-sm sm:text-base whitespace-pre-wrap">
                          {step === 13 ? (
                            <div className="space-y-6">
                              {getPersonalizedDescription().split('**').map((section: string, index: number) => { // Tipagem corrigida
                                if (index % 2 === 1) {
                                  return <strong key={index} className="text-orange-400">{section}</strong>
                                }
                                return section ? (
                                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 text-left">
                                    {section.trim()}
                                  </div>
                                ) : null
                              })}
                            </div>
                          ) : (
                            getPersonalizedDescription()
                          )}
                        </div>
                      )}

                      {/* Evidência Científica - APENAS ETAPA 11 */}
                      {currentStep?.elements?.scientificEvidence && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="mb-8 space-y-6"
                        >
                          {currentStep.elements.reportageImage && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                              className="relative"
                            >
                              <img
                                src={currentStep.elements.reportageImage}
                                alt="Reportagem BBC sobre neurociência"
                                className="w-full rounded-lg shadow-xl border border-gray-600 hover:shadow-2xl transition-shadow duration-300"
                                onError={(e: any) => { // NOVO: Rastreamento de erro de imagem
                                  console.error('Erro ao carregar imagem de reportagem:', e.target.src);
                                  enviarEvento('erro_carregar_imagem', {
                                    numero_etapa: step,
                                    tipo: 'reportagem',
                                    url: e.target.src,
                                    timestamp: new Date().toISOString()
                                  });
                                  e.target.style.display = 'none';
                                }}
                              />
                            </motion.div>
                          )}

                          {currentStep.elements.curiousImage && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 }}
                              className="relative"
                            >
                              <img
                                src={currentStep.elements.curiousImage}
                                alt="Evidência científica curiosa"
                                className="w-full rounded-lg shadow-xl border border-gray-600 hover:shadow-2xl transition-shadow duration-300"
                                onError={(e: any) => { // NOVO: Rastreamento de erro de imagem
                                  console.error('Erro ao carregar imagem de evidência:', e.target.src);
                                  enviarEvento('erro_carregar_imagem', {
                                    numero_etapa: step,
                                    tipo: 'evidencia',
                                    url: e.target.src,
                                    timestamp: new Date().toISOString()
                                  });
                                  e.target.style.display = 'none';
                                }}
                              />
                              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                NEUROCIÊNCIA
                              </div>
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-center"
                          >
                            <p className="text-blue-200 text-sm sm:text-base font-medium">
                              🧠 <strong>Comprobado científicamente:</strong> Los métodos del PLAN A activan las mismas áreas cerebrales responsables por el enamoramiento inicial.
                            </p>
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Termómetro para nivel de compromiso */}
                      {currentStep?.elements?.thermometer && (
                        <div className="mb-8">
                          <div className="flex justify-between text-gray-300 text-xs sm:text-sm mb-2 font-medium">
                            <span>No estoy seguro</span>
                            <span>Lo quiero mucho</span>
                          </div>
                          <div className="bg-gray-700 rounded-full h-3 sm:h-4 mb-4">
                            <motion.div
                              className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: selectedAnswer ? "100%" : "0%" }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                      )}

                      {getPersonalizedOptions().length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                          {getPersonalizedOptions().map((option: string, index: number) => ( // Tipagem corrigida
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className="relative"
                            >
                              <button
                                onClick={() => handleAnswerSelect(option)}
                                data-option={option}
                                className={`w-full p-4 sm:p-6 text-left justify-start text-wrap h-auto rounded-lg border-2 transition-all duration-200 transform hover:scale-102 ${
                                  selectedAnswer === option
                                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg scale-105"
                                    : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500 shadow-sm"
                                }`}
                                disabled={isProcessing} // NOVO: Desabilita botão durante processamento
                              >
                                <div className="flex items-center w-full">
                                  <div className={`mr-3 sm:mr-4 ${selectedAnswer === option ? "text-white" : "text-orange-400"}`}>
                                    {getStepIcon(step, index)}
                                  </div>

                                  <div
                                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all flex-shrink-0 ${
                                      selectedAnswer === option ? "border-white bg-white" : "border-gray-400 bg-gray-700"
                                    }`}
                                  >
                                    {selectedAnswer === option && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" />}
                                  </div>
                                  <span className="flex-1 font-medium text-sm sm:text-base leading-relaxed">{option}</span>
                                </div>
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {currentStep.note && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="mt-6 text-center text-amber-300 bg-amber-900/30 p-4 rounded-lg border border-amber-600"
                        >
                          <p className="font-medium text-sm sm:text-base">{currentStep.note}</p>
                        </motion.div>
                      )}

                      {currentStep.guarantee && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-6 text-center text-green-300 bg-green-900/30 p-4 rounded-lg border border-green-600"
                        >
                          <p className="font-medium text-sm sm:text-base">{currentStep.guarantee}</p>
                        </motion.div>
                      )}

                      {currentStep.warning && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="mt-6 text-center text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-600 flex items-center justify-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <p className="font-medium text-sm sm:text-base">{currentStep.warning}</p>
                        </motion.div>
                      )}

                      {selectedAnswer && getPersonalizedOptions().length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-8 text-center"
                        >
                          <Button
                            onClick={handleNext}
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg w-full sm:w-auto text-sm sm:text-base"
                            disabled={isProcessing} // NOVO: Desabilita botão durante processamento
                          >
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            ) : (
                              `${step === 13 ? "Ver Resultado" : "Siguiente Pregunta"}`
                            )}
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                          </Button>
                        </motion.div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Prueba Social - OTIMIZADA (sem números agressivos) */}
        {step > 2 && !currentStep?.autoAdvance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-2 mt-6"
          >
            {currentStep?.elements?.counter && (
              <p className="text-white text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-full inline-block">
                👥 {peopleCount} {currentStep.elements.counter}
              </p>
            )}

            {currentStep?.elements?.helpedCounter && (
              <p className="text-green-400 text-xs sm:text-sm font-semibold bg-green-900/20 px-3 py-1 rounded-full inline-block">
                ✅ {currentStep.elements.helpedCounter}
              </p>
            )}

            {step > 5 && (
              <p className="text-blue-300 text-xs sm:text-sm bg-blue-900/20 px-3 py-1 rounded-full inline-block">
                {socialProofMessages[Math.min(step - 6, socialProofMessages.length - 1)]}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal de Análise de Carga */}
      <AnimatePresence>
        {showAnalysis && (
          <LoadingAnalysis
            message={
              currentStep?.elements?.analysisText ||
              currentStep?.elements?.profileAnalysis ||
              "Analizando tus respuestas..."
            }
            successMessage={currentStep?.elements?.successRate}
          />
        )}
      </AnimatePresence>

      {/* Modal de Desbloqueio de Bonificação */}
      <AnimatePresence>
        {showBonusUnlock && newBonus && (
          <BonusUnlock 
            bonus={newBonus} 
            onComplete={() => {
              handleBonusUnlockComplete();
              enviarEvento('viu_bonus_unlock', { // NOVO: Rastreamento de visualização do bônus
                numero_etapa: step,
                bonus_id: newBonus?.id,
                bonus_titulo: newBonus?.title,
                timestamp: new Date().toISOString()
              });
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}