"use client"

import { useState, useEffect, useCallback } from "react"
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
import { quizSteps, socialProofMessages, getPersonalizedContent } from "@/lib/quiz-data"
import { BonusUnlock } from "@/components/bonus-unlock"
import { ValueCounter } from "@/components/value-counter"
import { LoadingAnalysis } from "@/components/loading-analysis"

// 3. Função para enviar eventos a Google Analytics com contexto
function enviarEvento(nombre_evento: string, propriedades: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const userGender = safeLocalStorage.getItem("userGender", "unknown");
    const quizAnswers = safeLocalStorage.getItem("quizAnswers", {});
    const total_answered = Object.keys(quizAnswers).length;
    const currentStepNumber = Number(window.location.pathname.split('/').pop()) || 0;

    const eventoComContexto = {
      ...propriedades,
      userGender: userGender,
      step_atual: currentStepNumber,
      total_answered: total_answered
    };
    
    (window as any).gtag('event', nombre_evento, eventoComContexto);
    console.log('Evento enviado com contexto completo:', nombre_evento, eventoComContexto);
  }
}

// 4. Objeto safeLocalStorage com try-catch para JSON.parse seguro
const safeLocalStorage = {
  getItem: (key: string, fallback: any = null) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`Erro ao ler localStorage ${key}:`, error);
      // Reset seletivo se dados corrompidos
      localStorage.removeItem(key);
      return fallback;
    }
  },
  
  setItem: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar localStorage ${key}:`, error);
    }
  }
};

// 5. Componente WhatsAppMockup com useCallback para getPersonalizedFirstMessage e getPersonalizedExResponse
const WhatsAppMockup = ({ userGender }: { userGender: string }) => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [analysisPoints, setAnalysisPoints] = useState([
    { status: 'pending', text: 'Enviando mensaje optimizado...' },
    { status: 'pending', text: 'Generando curiosidad e interés...' },
    { status: 'pending', text: 'Activando memoria emocional...' },
    { status: 'pending', text: 'Respuesta emocional detectada...' }
  ])
  const [successPercentage, setSuccessPercentage] = useState(0)

  const getExName = useCallback(() => {
    return "José Plan"
  }, [])

  const getExAvatar = useCallback(() => {
    return "https://i.ibb.co/5hbjyZFJ/CASAL-JOSE.webp";
  }, [])

  const getPersonalizedFirstMessage = useCallback(() => {
    const answers = safeLocalStorage.getItem("quizAnswers", {});
    const currentSituation = answers.question7 || ""
    
    if (currentSituation.includes("contacto cero")) {
      return `Hola, encontré algo que es tuyo. ¿Cuándo puedes pasar a recogerlo?`
    }
    if (currentSituation.includes("me ignora")) {
      return `Hola, no voy a molestarte más. Solo quería agradecerte por algo que me enseñaste.`
    }
    if (currentSituation.includes("bloqueado")) {
      return `Hola, María me pidió preguntarte sobre el evento del viernes.`
    }
    if (currentSituation.includes("cosas necesarias")) {
      return `Hola, vi esta foto nuestra del viaje a la playa y me hizo sonreír. Espero que estés bien.`
    }
    if (currentSituation.includes("charlamos")) {
      return `Hola, tengo que contarte algo curioso que me pasó que te va a hacer reír. ¿Tienes 5 minutos para una llamada?`
    }
    return `Hola, vi algo que me recordé a cuando fuimos al parque. Me alegró el día. Espero que estés bien.`
  }, [])

  const getPersonalizedExResponse = useCallback(() => {
    const answers = safeLocalStorage.getItem("quizAnswers", {});
    const currentSituation = answers.question7 || ""
    
    if (currentSituation.includes("contacto cero")) {
      return "¿Qué cosa? No recuerdo haber dejado nada..."
    }
    if (currentSituation.includes("me ignora")) {
      return "¿Qué me enseñé? Me tienes curiosa..."
    }
    if (currentSituation.includes("bloqueado")) {
      return "Ah sí, dile que sí voy. Gracias por preguntar."
    }
    if (currentSituation.includes("cosas necesarias")) {
      return "😊 Qué bonito recuerdo. Yo también estoy bien, gracias."
    }
    if (currentSituation.includes("charlamos")) {
      return "Jajaja ya me tienes intrigada. Cuéntame por aquí primero"
    }
    return "Gracias por acordarte de mí. ¿Cómo has estado?"
  }, [])

  const conversation = [
    {
      type: 'sent',
      message: getPersonalizedFirstMessage(),
      delay: 1000,
      timestamp: 'Día 1 - 19:30'
    },
    {
      type: 'typing',
      duration: 1500
    },
    {
      type: 'received', 
      message: getPersonalizedExResponse(),
      delay: 500,
      timestamp: '19:47'
    },
    {
      type: 'sent',
      message: "Me alegra que respondas. ¿Te parece si hablamos mejor mañana? Tengo algunas cosas que hacer ahora.",
      delay: 1000,
      timestamp: '19:52'
    }
  ]

  const updateAnalysisPoint = useCallback((pointIndex: number, status: string) => {
    setAnalysisPoints(prev => prev.map((point, index) => 
      index === pointIndex ? { ...point, status } : point
    ))
  }, [])

  const animateSuccessPercentage = useCallback(() => {
    let current = 0
    const target = 89
    const increment = target / 30
    
    const intervalId = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(intervalId)
      }
      setSuccessPercentage(Math.round(current))
    }, 30)
    return () => clearInterval(intervalId); // Cleanup function
  }, [])

  useEffect(() => {
    let stepIndex = 0
    const timers: NodeJS.Timeout[] = []
    
    const steps = [
      { delay: 500, action: 'showUserMessage' },
      { delay: 1500, action: 'showTyping' },
      { delay: 2500, action: 'hideTyping' },
      { delay: 3000, action: 'showExResponse' },
      { delay: 4000, action: 'showUserFollowup' },
      { delay: 4500, action: 'showSuccess' }
    ]

    const runAnimation = () => {
      if (stepIndex >= steps.length) return
      
      const step = steps[stepIndex]
      const timer = setTimeout(() => {
        executeStep(step.action)
        stepIndex++
        runAnimation()
      }, step.delay)
      
      timers.push(timer)
    }

    const executeStep = (action: string) => {
      switch(action) {
        case 'showUserMessage':
          setCurrentMessage(1)
          updateAnalysisPoint(0, 'active')
          break
        case 'showTyping':
          setIsTyping(true)
          updateAnalysisPoint(0, 'completed')
          updateAnalysisPoint(1, 'active')
          break
        case 'hideTyping':
          setIsTyping(false)
          break
        case 'showExResponse':
          setCurrentMessage(2)
          updateAnalysisPoint(1, 'completed')
          updateAnalysisPoint(2, 'active')
          break
        case 'showUserFollowup':
          setCurrentMessage(3)
          updateAnalysisPoint(2, 'completed')
          updateAnalysisPoint(3, 'active')
          break
        case 'showSuccess':
          updateAnalysisPoint(3, 'completed')
          animateSuccessPercentage()
          setShowSuccess(true)
          break
      }
    }

    const initialTimer = setTimeout(runAnimation, 300)
    timers.push(initialTimer)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [animateSuccessPercentage, updateAnalysisPoint, getPersonalizedFirstMessage, getPersonalizedExResponse])

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-8">
      {/* iPhone Mockup */}
      <div className="phone-mockup">
        <div className="iphone-frame">
          <div className="notch"></div>
          <div className="screen">
            {/* WhatsApp Header */}
            <div className="whatsapp-header">
              <div className="back-arrow">←</div>
              <img src={getExAvatar()} className="contact-avatar" alt="Avatar" />
              <div className="contact-info">
                <div className="contact-name">{getExName()}</div>
                <div className="last-seen">
                  {isTyping ? 'escribiendo...' : 'En línea'}
                </div>
              </div>
              <div className="header-icons">
                <span>📹</span>
                <span>📞</span>
                <span>⋮</span>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="chat-messages">
              <div className="date-separator">
                <span>Hoy</span>
              </div>
              
              {/* Mensaje del usuario */}
              <AnimatePresence>
                {currentMessage >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="message-bubble sent"
                  >
                    <div className="message-content">{conversation[0].message}</div>
                    <div className="message-time">19:30 ✓✓</div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="message-bubble received typing-indicator"
                >
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
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
                    className="message-bubble received"
                  >
                    <div className="message-content">{conversation[2].message}</div>
                    <div className="message-time">19:47</div>
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
                    className="message-bubble sent"
                  >
                    <div className="message-content">{conversation[3].message}</div>
                    <div className="message-time">19:52 ✓✓</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* WhatsApp Input */}
            <div className="whatsapp-input">
              <div className="input-container">
                <span>😊</span>
                <div className="input-field">Escribe un mensaje</div>
                <span>📎</span>
                <span>🎤</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Análisis en tiempo real */}
      <div className="real-time-analysis">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          📊 ANÁLISIS PSICOLÓGICO EN TIEMPO REAL
        </h3>
        
        <div className="space-y-3 mb-6">
          {analysisPoints.map((point, index) => (
            <motion.div 
              key={index} 
              className="analysis-point"
              animate={{
                scale: point.status === 'active' ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: point.status === 'active' ? Infinity : 0,
              }}
            >
              <div className={`point-status ${point.status}`}>
                {point.status === 'completed' ? '✓' : 
                 point.status === 'active' ? '⚡' : '⏳'}
              </div>
              <div className="point-text">{point.text}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="success-probability">
          <div className="probability-circle">
            <div className="percentage">{successPercentage}%</div>
            <div className="label">Probabilidad de éxito</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .phone-mockup {
          width: 300px;
          height: 600px;
        }

        .iphone-frame {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
          border-radius: 35px;
          padding: 8px;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.1);
          position: relative;
        }

        .notch {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 25px;
          background: #000;
          border-radius: 0 0 15px 15px;
          z-index: 10;
        }

        .screen {
          background: #000;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .whatsapp-header {
          background: #075e54;
          padding: 35px 15px 15px 15px;
          display: flex;
          align-items: center;
          color: white;
          font-size: 14px;
        }

        .back-arrow {
          margin-right: 10px;
          font-size: 18px;
        }

        .contact-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }

        .contact-info {
          flex: 1;
        }

        .contact-name {
          font-weight: bold;
          margin-bottom: 2px;
        }

        .last-seen {
          font-size: 12px;
          color: #b3d4d1;
        }

        .header-icons {
          display: flex;
          gap: 15px;
        }

        .chat-messages {
          flex: 1;
          background: #ece5dd;
          padding: 20px 15px;
          overflow-y: auto;
        }

        .date-separator {
          text-align: center;
          margin: 10px 0 20px 0;
        }

        .date-separator span {
          background: rgba(0,0,0,0.1);
          color: #667781;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
        }

        .message-bubble {
          margin: 8px 0;
          max-width: 80%;
          position: relative;
        }

        .message-bubble.sent {
          margin-left: auto;
          background: #dcf8c6;
          border-radius: 18px 18px 4px 18px;
        }

        .message-bubble.received {
          margin-right: auto;
          background: white;
          border-radius: 18px 18px 18px 4px;
        }

        .message-content {
          padding: 8px 12px 4px 12px;
          font-size: 14px;
          line-height: 1.4;
        }

        .message-time {
          padding: 0 12px 8px 12px;
          font-size: 11px;
          color: #667781;
          text-align: right;
        }

        .message-bubble.received .message-time {
          text-align: left;
        }

        .typing-indicator {
          background: white !important;
          padding: 12px !important;
          width: 60px !important;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #999;
          border-radius: 50%;
          animation: typingDots 1s infinite;
        }

        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes typingDots {
          0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
          30% { transform: scale(1.2); opacity: 1; }
        }

        .whatsapp-input {
          background: #f0f0f0;
          padding: 8px;
        }

        .input-container {
          background: white;
          border-radius: 25px;
          display: flex;
          align-items: center;
          padding: 8px 15px;
          gap: 10px;
        }

        .input-field {
          flex: 1;
          color: #999;
          font-size: 14px;
        }

        .real-time-analysis {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 25px;
          color: white;
          max-width: 350px;
          width: 100%;
        }

        .analysis-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }

        .analysis-points {
          margin-bottom: 25px;
        }

        .analysis-point {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 12px 0;
          padding: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .point-status {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .point-status.pending {
          background: rgba(255,255,255,0.2);
          color: #ffd700;
        }

        .point-status.active {
          background: #4CAF50;
          color: white;
          animation: pulse 0.8s infinite;
        }

        .point-status.completed {
          background: #4CAF50;
          color: white;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .point-text {
          font-size: 14px;
          flex: 1;
        }

        .success-probability {
          text-align: center;
        }

        .probability-circle {
          width: 100px;
          height: 100px;
          border: 4px solid rgba(255,255,255,0.2);
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          animation: rotate 1.5s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .percentage {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
        }

        .label {
          font-size: 10px;
          color: #ccc;
          margin-top: 2px;
        }

        @media (max-width: 767px) {
          .phone-mockup {
            width: 280px;
            height: 560px;
          }
          
          .real-time-analysis {
            max-width: 100%;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  )
}

// 6. Componente QuizStep principal
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
  const [isAnswerInvalid, setIsAnswerInvalid] = useState(false)
  const [shakeAnimation, setShakeAnimation] = useState(false)

  const currentStep = quizSteps[step - 1]
  const progress = (step / 13) * 100

  useEffect(() => {
    const savedQuizData = safeLocalStorage.getItem("quizData", {});
    const savedBonuses = safeLocalStorage.getItem("unlockedBonuses", []);
    const savedValue = safeLocalStorage.getItem("totalValue", "0");
    const savedGender = safeLocalStorage.getItem("userGender", "");
    const savedAnswers = safeLocalStorage.getItem("quizAnswers", {});

    if (Object.keys(savedQuizData).length > 0) setQuizData(savedQuizData);
    if (savedBonuses.length > 0) setUnlockedBonuses(savedBonuses);
    setTotalValue(Number.parseInt(savedValue));
    setUserGender(savedGender);
    (window as any).quizAnswers = savedAnswers;

    setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    enviarEvento('visualizou_etapa_quiz', {
      numero_etapa: step,
      pergunta: currentStep?.question || `Etapa ${step}`
    });

    let autoAdvanceTimer: NodeJS.Timeout | undefined;
    if (currentStep?.autoAdvance) {
      autoAdvanceTimer = setTimeout(() => {
        proceedToNextStep()
      }, 3000)
    }

    const intervalId = setInterval(() => {
      setPeopleCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 30000)

    return () => {
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
      clearInterval(intervalId);
    }
  }, [step, currentStep?.autoAdvance])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setIsAnswerInvalid(false)
    setShakeAnimation(false)

    enviarEvento('selecionou_resposta', {
      numero_etapa: step,
      pergunta: currentStep?.question || `Etapa ${step}`,
      resposta: answer
    });

    if (step === 1) {
      setUserGender(answer)
      safeLocalStorage.setItem("userGender", answer)
    }

    const button = document.querySelector(`button[data-option="${answer}"]`)
    if (button) {
      button.classList.add("scale-105")
      setTimeout(() => button.classList.remove("scale-105"), 200)
    }
  }

  const handleNext = () => {
    if (!selectedAnswer || selectedAnswer.trim() === '') {
      setIsAnswerInvalid(true)
      setShakeAnimation(true)
      
      setTimeout(() => {
        setShakeAnimation(false)
      }, 500)
      
      enviarEvento('erro_validacao', {
        numero_etapa: step,
        tipo_erro: 'resposta_vazia'
      });
      
      return;
    }

    enviarEvento('avancou_etapa', {
      numero_etapa: step,
      pergunta: currentStep?.question || `Etapa ${step}`,
      resposta_selecionada: selectedAnswer
    });

    const newQuizData = { ...quizData, [step]: selectedAnswer }
    setQuizData(newQuizData)
    safeLocalStorage.setItem("quizData", newQuizData)

    const answers = (window as any).quizAnswers || {}
    answers[`question${step}`] = selectedAnswer
    (window as any).quizAnswers = answers
    safeLocalStorage.setItem("quizAnswers", answers)

    if (currentStep?.elements?.analysisText || currentStep?.elements?.profileAnalysis) {
      setShowAnalysis(true)
      setTimeout(() => {
        setShowAnalysis(false)
        proceedToNextStep()
      }, 1500)
      return
    }

    proceedToNextStep()
  }

  const proceedToNextStep = () => {
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

    if (currentStep?.bonusUnlock && !unlockedBonuses.includes(currentStep.bonusUnlock.id)) {
      enviarEvento('desbloqueou_bonus', {
        numero_etapa: step,
        bonus_id: currentStep.bonusUnlock.id,
        bonus_titulo: currentStep.bonusUnlock.title
      });

      const newUnlockedBonuses = [...unlockedBonuses, currentStep.bonusUnlock.id]
      const newTotalValue = totalValue + currentStep.bonusUnlock.value

      setUnlockedBonuses(newUnlockedBonuses)
      setTotalValue(newTotalValue)

      const personalizedBonus = {
        ...currentStep.bonusUnlock,
        title: currentStep.bonusUnlock?.title || 'Bonus desbloqueado',
        description: currentStep.bonusUnlock?.description || 'Descripción del bonus',
      }
      setNewBonus(personalizedBonus)

      safeLocalStorage.setItem("unlockedBonuses", newUnlockedBonuses)
      safeLocalStorage.setItem("totalValue", newTotalValue.toString())

      setShowBonusUnlock(true)
      return
    }

    if (step < 13) {
      router.push(`/quiz/${step + 1}${utmString}`)
    } else {
      enviarEvento('concluiu_quiz', {
        total_etapas_completadas: 13,
        total_bonus_desbloqueados: unlockedBonuses.length
      });
      
      router.push(`/resultado${utmString}`)
    }
  }

  const handleBonusUnlockComplete = () => {
    setShowBonusUnlock(false)
    
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
  }

  const handleBack = () => {
    enviarEvento('retornou_etapa', {
      de_etapa: step,
      para_etapa: step > 1 ? step - 1 : 'inicio'
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
  }

  const getStepIcon = (stepNumber: number, index: number) => {
    const iconMaps: { [key: number]: any[] } = {
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
    return getPersonalizedContent(currentStep.question, userGender)
  }

  const getPersonalizedDescription = () => {
    const desc = currentStep.description
    if (typeof desc === 'function') {
      try {
        return desc()
      } catch (error) {
        console.error('Erro ao executar função de description:', error)
        return ''
      }
    }
    return getPersonalizedContent(desc, userGender)
  }

  const getPersonalizedSubtext = () => {
    const subtext = currentStep.subtext
    if (typeof subtext === 'function') {
      try {
        return subtext()
      } catch (error) {
        console.error('Erro ao executar função de subtext:', error)
        return ''
      }
    }
    return getPersonalizedContent(subtext, userGender)
  }

  const getPersonalizedOptions = () => {
    const options = getPersonalizedContent(currentStep.options, userGender)
    return Array.isArray(options) ? options : currentStep.options
  }

  if (!currentStep) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-white hover:bg-white/20 border border-white/20"
              disabled={currentStep?.autoAdvance}
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

        {/* Testimonial Display */}
        {currentStep?.elements?.testimonialDisplay && (currentStep?.elements?.testimonialText || currentStep?.elements?.testimonialData) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
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
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
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
                            transition={{ delay: i * 0.05 + 0.3 }}
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
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-white text-sm sm:text-base leading-relaxed italic">
                      "{currentStep.elements.testimonialText || (currentStep.elements.testimonialData && currentStep.elements.testimonialData().text)}"
                    </p>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-center gap-1 text-green-400 text-xs font-semibold bg-green-900/20 rounded-full py-1 px-3 self-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
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
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
            <CardContent className="p-6 sm:p-8">
              
              {/* Step 12 com WhatsAppMockup e simulação */}
              {step === 12 && (
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                    🔮 ESTO ES LO QUE ELLA REALMENTE SENTIRÍA SI LE ESCRIBIERAS HOY
                  </h2>
                  
                  <p className="text-orange-200 text-center mb-8 text-base sm:text-lg font-medium">
                    Basándome en tu situación exacta y en 12,000 casos reales, aquí está la conversación que probablemente sucedería. No es una predicción genérica - es específica para ti.
                  </p>
                  
                  <WhatsAppMockup userGender={userGender} />
                  
                  <p className="text-gray-400 text-sm mb-8">
                    Lo que verás en los próximos segundos es lo más probable que suceda en la vida real:
                  </p>
                  
                  <motion.div className="text-center">
                    <Button
                      onClick={() => {
                        setSelectedAnswer("VER_PLAN_COMPLETO")
                        handleNext()
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg w-full sm:w-auto text-sm sm:text-base"
                    >
                      VER CÓMO ELLA RESPONDERÍA
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Auto advance step */}
              {currentStep?.autoAdvance && step !== 12 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
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
                    transition={{ delay: 0.5 }}
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
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 13 com análise final personalizada */}
              {currentStep?.elements?.finalReveal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 1, delay: 0.3 }}
                    className="mb-6"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
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
                    transition={{ delay: 0.8 }}
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
              {currentStep?.elements?.expertPhoto && !currentStep?.autoAdvance && step !== 12 && (
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
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
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
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="mb-6"
                >
                  <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">
                      {currentStep.elements.compatibilityCalc} de compatibilidad
                    </div>
                  </div>
                </motion.div>
              )}

              {!currentStep?.autoAdvance && step !== 12 && (
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
                          {getPersonalizedDescription().split('**').map((section: string, index: number) => {
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
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mb-8 space-y-6"
                    >
                      {currentStep.elements.reportageImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          className="relative"
                        >
                          <img
                            src={currentStep.elements.reportageImage}
                            alt="Reportagem BBC sobre neurociência"
                            className="w-full rounded-lg shadow-xl border border-gray-600 hover:shadow-2xl transition-shadow duration-300"
                          />
                        </motion.div>
                      )}

                      {currentStep.elements.curiousImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                          className="relative"
                        >
                          <img
                            src={currentStep.elements.curiousImage}
                            alt="Evidência científica curiosa"
                            className="w-full rounded-lg shadow-xl border border-gray-600 hover:shadow-2xl transition-shadow duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            NEUROCIÊNCIA
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
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
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {getPersonalizedOptions().length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      {getPersonalizedOptions().map((option: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className="relative"
                        >
                          <button
                            onClick={() => handleAnswerSelect(option)}
                            data-option={option}
                            className={`w-full p-4 sm:p-6 text-left justify-start text-wrap h-auto rounded-lg border-2 transition-all duration-300 transform hover:scale-102 ${
                              selectedAnswer === option
                                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg scale-105"
                                : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500 shadow-sm"
                            }`}
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

                          {!selectedAnswer && (
                            <motion.div
                              className="absolute inset-0 rounded-lg border-2 border-orange-400/50 pointer-events-none"
                              animate={{
                                opacity: [0, 0.3, 0],
                                scale: [1, 1.02, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: index * 0.3,
                              }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {isAnswerInvalid && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 text-center text-red-300 bg-red-900/30 p-3 rounded-lg border border-red-600 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <p className="font-medium text-sm">Por favor, selecciona una respuesta antes de continuar</p>
                    </motion.div>
                  )}

                  {currentStep.note && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 text-center text-amber-300 bg-amber-900/30 p-4 rounded-lg border border-amber-600"
                    >
                      <p className="font-medium text-sm sm:text-base">{currentStep.note}</p>
                    </motion.div>
                  )}

                  {currentStep.guarantee && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 text-center text-green-300 bg-green-900/30 p-4 rounded-lg border border-green-600"
                    >
                      <p className="font-medium text-sm sm:text-base">{currentStep.guarantee}</p>
                    </motion.div>
                  )}

                  {currentStep.warning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 text-center text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-600 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <p className="font-medium text-sm sm:text-base">{currentStep.warning}</p>
                    </motion.div>
                  )}

                  {getPersonalizedOptions().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center"
                    >
                      <Button
                        onClick={handleNext}
                        size="lg"
                        disabled={!selectedAnswer || selectedAnswer.trim() === ''}
                        className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg w-full sm:w-auto text-sm sm:text-base transition-all duration-300 ${
                          shakeAnimation ? 'animate-pulse' : ''
                        } ${
                          !selectedAnswer || selectedAnswer.trim() === ''
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105'
                        }`}
                        style={{
                          animation: shakeAnimation ? 'shake 0.5s ease-in-out' : 'none'
                        }}
                      >
                        {step === 13 ? "Ver Resultado" : "Siguiente Pregunta"}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Prueba Social */}
        {step > 2 && !currentStep?.autoAdvance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
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

      {/* Modal de Análisis de Carga */}
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

      {/* Modal de Desbloqueo de Bonificación */}
      <AnimatePresence>
        {showBonusUnlock && newBonus && <BonusUnlock bonus={newBonus} onComplete={handleBonusUnlockComplete} />}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  )
}