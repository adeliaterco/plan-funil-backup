// src/lib/quiz-data.ts

// --- Interfaces/Types ---

/**
 * Interface para armazenar as respostas do quiz.
 * A chave é o ID da pergunta (ex: "question1") e o valor é a resposta selecionada.
 */
export interface QuizAnswers {
  [key: string]: string;
}

/**
 * Interface para definir a estrutura de um bônus desbloqueável.
 */
export interface BonusUnlock {
  id: number;
  title: string;
  description: string;
  value: number;
  image?: string;
}

/**
 * Interface para definir elementos visuais e lógicos específicos de cada etapa do quiz.
 */
export interface QuizElements {
  psychologicalTest?: boolean;
  timer?: string;
  analysisIcon?: boolean;
  badge?: string;
  profileBuilding?: boolean;
  counter?: string;
  profileComplete?: string;
  probabilityCalculator?: boolean;
  patternAnalysis?: boolean;
  intensityMeter?: boolean;
  healingProtocol?: boolean;
  strategyMapping?: boolean;
  competitionAnalysis?: boolean;
  commitmentThermometer?: boolean;
  expertPhoto?: boolean;
  expertImage?: string;
  autoMessage?: string;
  diagnosticGeneration?: boolean;
  scientificEvidence?: boolean;
  reportageImage?: string;
  curiousImage?: string;
  whatsappSimulation?: boolean;
  phoneSimulation?: boolean;
  typingAnimation?: boolean;
  personalizedChat?: boolean;
  cinematicReveal?: boolean;
  customComponent?: string; // e.g., "PhoneSimulationStep" para renderização condicional
  planAReveal?: boolean;
  planPreview?: boolean;
  finalReveal?: boolean;
  successRate?: string; // Para o componente LoadingAnalysis
  analysisText?: string; // Para o componente LoadingAnalysis
  profileAnalysis?: string; // Para o componente LoadingAnalysis
  testimonialDisplay?: boolean;
  testimonialText?: string;
  testimonialName?: string;
  testimonialImage?: string;
  testimonialData?: () => Testimonial; // Função para obter depoimento dinâmico
  helpedCounter?: string;
}

/**
 * Interface principal para definir a estrutura de cada etapa do quiz.
 */
export interface QuizStepData {
  id: number;
  question: string | ((gender: string) => string);
  description: string | ((gender: string) => string);
  subtext?: string | ((gender: string) => string);
  options: string[] | { SOY_HOMBRE: string[]; SOY_MUJER: string[] };
  warning?: string;
  note?: string;
  guarantee?: string;
  autoAdvance?: boolean;
  elements?: QuizElements;
  bonusUnlock?: BonusUnlock;
  finalReveal?: {
    title: string;
    features: string[];
    urgency: string;
    socialProof: string;
    guarantee: string;
  };
}

/**
 * Interface para definir a estrutura de um depoimento.
 */
export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  image?: string;
}

/**
 * Extensão da interface global Window para incluir propriedades personalizadas.
 * Isso permite que `window.quizAnswers` e outras funções sejam acessadas globalmente,
 * mantendo a compatibilidade com o código existente.
 */
declare global {
  interface Window {
    quizAnswers: QuizAnswers;
    getPersonalizedFirstInsight: () => string;
    getPersonalizedTechnique: () => string;
    getExName: () => string;
    getExAvatar: () => string;
    getPersonalizedFirstMessage: () => string;
    getPersonalizedExResponse: () => string;
    getPersonalizedFollowUp: () => string;
    getHeaderName: () => string;
  }
}

// --- safeLocalStorage utility ---

/**
 * Objeto utilitário para acessar o localStorage de forma segura,
 * com tratamento de erros e compatibilidade com SSR.
 */
const safeLocalStorage = {
  /**
   * Recupera um item do localStorage, parseando-o como JSON.
   * Em caso de erro ou item não encontrado, retorna um valor de fallback.
   * @param key A chave do item no localStorage.
   * @param fallback O valor a ser retornado se o item não for encontrado ou estiver corrompido.
   * @returns O item recuperado ou o valor de fallback.
   */
  getItem: <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback; // Retorna fallback em ambiente SSR
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // Opcional: Limpar o item corrompido para evitar futuros erros
      localStorage.removeItem(key);
      return fallback;
    }
  },
  /**
   * Armazena um item no localStorage, convertendo-o para JSON string.
   * Inclui tratamento de erros.
   * @param key A chave para armazenar o item.
   * @param value O valor a ser armazenado.
   */
  setItem: (key: string, value: any): void => {
    if (typeof window === 'undefined') return; // Não faz nada em ambiente SSR
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  },
};

// --- Funções de Personalização ---

/**
 * Captura a resposta do usuário para uma pergunta específica do quiz.
 * @param questionId O ID da pergunta (ex: 'question1').
 * @returns A resposta do usuário ou uma string vazia se não encontrada.
 */
export function getUserAnswer(questionId: string): string {
  if (typeof window === 'undefined') return '';
  const answers = safeLocalStorage.getItem<QuizAnswers>("quizAnswers", {});
  return answers[questionId] || '';
}

/**
 * Retorna o gênero do usuário com base na resposta da 'question1'.
 * Assume 'SOY HOMBRE' como padrão se não houver resposta.
 * @returns O gênero do usuário ('SOY HOMBRE' ou 'SOY MUJER').
 */
export function getUserGender(): string {
  return getUserAnswer('question1') || 'SOY HOMBRE';
}

/**
 * Gera um nome de ex personalizado com base no gênero do usuário.
 * @returns Um nome aleatório de ex.
 */
export function getExName(): string {
  const gender = getUserGender();
  const femaleNames = ['María', 'Ana', 'Carmen', 'Isabel', 'Sofía', 'Elena', 'Laura'];
  const maleNames = ['Carlos', 'José', 'Antonio', 'Manuel', 'Luis', 'Miguel', 'Alejandro'];
  
  const names = gender === "SOY HOMBRE" ? femaleNames : maleNames;
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Retorna a URL do avatar da ex. Atualmente, é uma imagem fixa.
 * @returns URL da imagem do avatar.
 */
export function getExAvatar(): string {
  return "https://i.ibb.co/5hbjyZFJ/CASAL-JOSE.webp";
}

/**
 * Retorna o nome a ser exibido no cabeçalho do mockup do WhatsApp.
 * @returns O nome "José Plan".
 */
export function getHeaderName(): string {
  return "José Plan";
}

/**
 * Gera a primeira mensagem personalizada para o mockup do WhatsApp,
 * baseada na situação atual do usuário (question7).
 * @returns A mensagem personalizada.
 */
export function getPersonalizedFirstMessage(): string {
  const currentSituation = getUserAnswer('question7');
  
  if (currentSituation.includes("contacto cero")) {
      return `Hola, encontré algo que es tuyo. ¿Cuándo puedes pasar a recogerlo?`;
  }
  if (currentSituation.includes("me ignora")) {
      return `Hola, no voy a molestarte más. Solo quería agradecerte por algo que me enseñaste.`;
  }
  if (currentSituation.includes("bloqueado")) {
      return `Hola, María me pidió preguntarte sobre el evento del viernes.`;
  }
  if (currentSituation.includes("cosas necesarias")) {
      return `Hola, vi esta foto nuestra del viaje a la playa y me hizo sonreír. Espero que estés bien.`;
  }
  if (currentSituation.includes("charlamos")) {
      return `Hola, tengo que contarte algo curioso que me pasó que te va a hacer reír. ¿Tienes 5 minutos para una llamada?`;
  }
  return `Hola, vi algo que me recordó a cuando fuimos al parque. Me alegró el día. Espero que estés bien.`;
}

/**
 * Gera a resposta personalizada da ex para o mockup do WhatsApp,
 * baseada na situação atual do usuário (question7).
 * @returns A resposta personalizada da ex.
 */
export function getPersonalizedExResponse(): string {
  const currentSituation = getUserAnswer('question7');
  
  if (currentSituation.includes("contacto cero")) {
      return "¿Qué cosa? No recuerdo haber dejado nada...";
  }
  if (currentSituation.includes("me ignora")) {
      return "¿Qué me enseñé? Me tienes curiosa...";
  }
  if (currentSituation.includes("bloqueado")) {
      return "Ah sí, dile que sí voy. Gracias por preguntar.";
  }
  if (currentSituation.includes("cosas necesarias")) {
      return "😊 Qué bonito recuerdo. Yo también estoy bien, gracias.";
  }
  if (currentSituation.includes("charlamos")) {
      return "Jajaja ya me tienes intrigada. Cuéntame por aquí primero";
  }
  return "Gracias por acordarte de mí. ¿Cómo has estado?";
}

/**
 * Gera a mensagem de follow-up personalizada para o mockup do WhatsApp.
 * @returns A mensagem de follow-up.
 */
export function getPersonalizedFollowUp(): string {
  return "Me alegra que respondas. ¿Te parece si hablamos mejor mañana? Tengo algunas cosas que hacer ahora.";
}

// --- Funções de Insight e Técnica Personalizada ---

/**
 * Gera um insight personalizado com base nas respostas do usuário,
 * destacando um "erro" comum na situação.
 * @returns Uma string com o insight personalizado.
 */
export function getPersonalizedFirstInsight(): string {
  const currentSituation = getUserAnswer('question7');
  const timeApart = getUserAnswer('question3');
  const whoEnded = getUserAnswer('question4');
  
  if (currentSituation.includes("contacto cero")) {
      return "❌ ERROR DETECTADO: Estás aplicando contacto cero de forma INCORRECTA. El 73% de los hombres cometen este error que los aleja definitivamente de su ex.";
  }
  if (currentSituation.includes("me ignora")) {
      return "❌ ERROR DETECTADO: Estás siendo IGNORADO porque usas las palabras EQUIVOCADAS. Hay 3 tipos de mensajes que rompen el muro del silencio.";
  }
  if (currentSituation.includes("bloqueado")) {
      return "❌ ERROR DETECTADO: Fuiste BLOQUEADO porque ella siente PRESIÓN. Existe una técnica específica para casos de bloqueo que funciona en 9 de cada 10 veces.";
  }
  if (currentSituation.includes("cosas necesarias")) {
      return "❌ ERROR DETECTADO: El contacto 'solo por necesidad' está MATANDO tu atractivo. Cada mensaje aburrido te aleja más de la reconquista.";
  }
  if (currentSituation.includes("charlamos")) {
      return "❌ ERROR DETECTADO: Charlar 'como amigos' es la TRAMPA más peligrosa. Estás en la zona de confort que te mantiene lejos de su corazón.";
  }
  if (currentSituation.includes("amigos")) {
      return "❌ ERROR DETECTADO: Ser 'solo amigos' es el LIMBO emocional. El 87% que se queda aquí nunca sale de esta zona.";
  }
  if (whoEnded.includes("terminó conmigo")) {
      return "❌ ERROR DETECTADO: Después de que TE DEJARAN, tu estrategia actual está creando más RESISTENCIA. El 84% cometen este error psicológico.";
  }
  return "❌ ERROR DETECTADO: Tu estrategia actual está generando el EFECTO CONTRARIO al que buscas. Hay un patrón específico que debes romper.";
}

/**
 * Gera uma técnica de reconquista personalizada com base nas respostas do usuário.
 * @returns Uma string com a técnica personalizada.
 */
export function getPersonalizedTechnique(): string {
  const currentSituation = getUserAnswer('question7');
  const timeApart = getUserAnswer('question3');
  const gender = getUserGender();
  const pronoun = gender === "SOY HOMBRE" ? "ella" : "él";
  
  if (currentSituation.includes("contacto cero")) {
      return `🎯 TU TÉCNICA: "RUPTURA DEL SILENCIO MAGNÉTICO"
        
Tu situación: Contacto cero + ${timeApart}

PASO 1: Envía exactamente este mensaje en 48h:
"Hey [nombre], encontré algo que te pertenece. ¿Cuándo puedes pasar a recogerlo?"

PASO 2: Cuando responda (lo hará en 67% de los casos):
"Perfecto, déjalo en [lugar específico]. No necesitamos vernos."

¿Por qué funciona? Crea CURIOSIDAD sin presión. El cerebro femenino no puede resistir el misterio.`;
  }
  if (currentSituation.includes("me ignora")) {
      return `🎯 TU TÉCNICA: "MENSAJE DE CURIOSIDAD IRRESISTIBLE"
        
Tu situación: Te ignora + ${timeApart} separados

MENSAJE EXACTO para enviar:
"No voy a molestarte más. Solo quería agradecerte por algo que me enseñaste."

NO envíes nada más. Espera 72h.

¿Por qué funciona? Rompe el patrón de expectativa. ${pronoun} esperaba súplicas, no gratitud.`;
  }
  return `🎯 TU TÉCNICA: "REACTIVACIÓN EMOCIONAL"
        
Para tu situación específica: ${currentSituation}

MENSAJE ESPECÍFICO:
"Vi [algo específico] y recordé cuando [memoria positiva compartida]. Espero que estés bien."

Envía solo esto. No esperes respuesta inmediata.

¿Por qué funciona? Reactiva conexión emocional sin presión ni demandas.`;
}

// --- Dados das Etapas do Quiz ---

export const quizSteps: QuizStepData[] = [
  {
      id: 1,
      question: "¡NO DEJES QUE LA PERSONA QUE AMAS SALGA DE TU VIDA PARA SIEMPRE!",
      description: "INICIANDO ANÁLISIS PSICOLÓGICO - Para revelar si ella aún siente algo por ti, necesito mapear tu perfil emocional específico.",
      subtext: "DATO CRÍTICO #1 - Tu género influye directamente en cómo ella procesa la separación:",
      options: ["SOY HOMBRE", "SOY MUJER"],
      warning: "⚠️ IMPORTANTE: Este análisis fue desarrollado basándose en 12,000 casos reales de reconquista. Cada respuesta ajusta tu diagnóstico.",
      elements: {
          psychologicalTest: true,
          timer: "Análisis en progreso...",
          analysisIcon: true,
          badge: "ANÁLISIS PSICOLÓGICO",
      }
  },
  {
      id: 2,
      question: "MAPEANDO TU PERFIL EMOCIONAL...",
      description: "Tu edad determina qué técnicas psicológicas tendrán mayor impacto en tu caso específico.",
      subtext: "DATO CRÍTICO #2 - Selecciona tu rango de edad:",
      options: [
          "18-29 años → Fase de alta intensidad emocional",
          "30-39 años → Período de madurez y estabilidad", 
          "40-49 años → Etapa de reevaluación de prioridades",
          "50+ años → Fase de sabiduría emocional"
      ],
      elements: {
          profileBuilding: true,
          counter: "personas analizadas hoy",
          profileComplete: "15%",
      },
      note: "Cada grupo de edad responde a diferentes disparadores emocionales."
  },
  {
      id: 3,
      question: "CALCULANDO PROBABILIDADES DE RECONQUISTA...",
      description: "El tiempo de separación es el factor más crítico para determinar qué técnicas usar y cuándo aplicarlas.",
      subtext: "DATO CRÍTICO #3 - ¿Cuánto tiempo llevan separados?",
      options: [
          "Menos de 1 semana → Ventana de oportunidad crítica",
          "1-4 semanas → Período de reflexión activa", 
          "1-6 meses → Fase de adaptación emocional",
          "Más de 6 meses → Etapa de reconstrucción profunda"
      ],
      elements: {
          probabilityCalculator: true,
          profileComplete: "30%",
      },
      note: "REVELACIÓN: El 73% de las reconquistas exitosas ocurren aplicando la técnica correcta en el momento exacto."
  },
  {
      id: 4,
      question: "IDENTIFICANDO PATRÓN DE RUPTURA...",
      description: "Cómo terminó la relación revela su estado emocional actual y define qué estrategia psicológica será más efectiva.",
      subtext: "DATO CRÍTICO #4 - ¿Cómo fue la separación?",
      options: {
          SOY_HOMBRE: [
              "Ella terminó conmigo → Patrón de rechazo activo",
              "Yo terminé con ella → Patrón de arrepentimiento",
              "Decisión mutua → Patrón de duda compartida"
          ],
          SOY_MUJER: [
              "Él terminó conmigo → Patrón de rechazo activo", 
              "Yo terminé con él → Patrón de arrepentimiento",
              "Decisión mutua → Patrón de duda compartida"
          ]
      },
      elements: {
          patternAnalysis: true,
          profileComplete: "45%",
      }
  },
  {
      id: 5,
      question: "ANALIZANDO INTENSIDAD EMOCIONAL...",
      description: "La duración de la relación determina la profundidad del vínculo emocional y qué técnicas de reconexión usar.",
      subtext: "DATO CRÍTICO #5 - ¿Cuánto tiempo estuvieron juntos?",
      options: [
          "Más de 3 años → Vínculo profundo establecido",
          "1-3 años → Conexión emocional sólida", 
          "6 meses-1 año → Atracción en desarrollo",
          "Menos de 6 meses → Química inicial"
      ],
      elements: {
          intensityMeter: true,
          profileComplete: "60%",
      }
  },
  {
      id: 6,
      question: "DETECTANDO TU PUNTO DE DOLOR PRINCIPAL...",
      description: "Tu mayor sufrimiento revela qué necesitas sanar ANTES de aplicar cualquier técnica de reconquista.",
      subtext: "DATO CRÍTICO #6 - ¿Cuál fue la parte más dolorosa?",
      options: {
          SOY_HOMBRE: [
              "😔 La soledad y el vacío → Necesitas 'Protocolo de Autoconfianza'",
              "😢 La montaña rusa emocional → Necesitas 'Estabilización Mental'",
              "😐 Los recuerdos constantes → Necesitas 'Técnica de Reframe'",
              "💔 Imaginarla con otro → Necesitas 'Estrategia de Diferenciación'",
              "🤔 Los planes perdidos → Necesitas 'Visión de Futuro'",
              "⚡ Otro → Requiere análisis personalizado"
          ],
          SOY_MUJER: [
              "😔 La soledad y el vacío → Necesitas 'Protocolo de Autoconfianza'",
              "😢 La montaña rusa emocional → Necesitas 'Estabilización Mental'", 
              "😐 Los recuerdos constantes → Necesitas 'Técnica de Reframe'",
              "💔 Imaginarlo con otra → Necesitas 'Estrategia de Diferenciación'",
              "🤔 Los planes perdidos → Necesitas 'Visión de Futuro'",
              "⚡ Otro → Requiere análisis personalizado"
          ]
      },
      elements: {
          healingProtocol: true,
          profileComplete: "70%",
      }
  },
  {
      id: 7,
      question: "EVALUANDO TU SITUACIÓN ACTUAL...",
      description: "Tu situación presente define tu PUNTO DE PARTIDA y qué estrategia específica necesitas aplicar primero.",
      subtext: "DATO CRÍTICO #7 - ¿Cuál es tu situación actual con tu ex?",
      options: {
          SOY_HOMBRE: [
              "🧐 Contacto cero → Estrategia de 'Ruptura del Silencio'",
              "😢 Me ignora → Protocolo de 'Reactivación de Interés'", 
              "❌ Me bloqueó → Técnica de 'Acceso Indirecto'",
              "🤝 Solo temas necesarios → Método de 'Escalada Emocional'",
              "🤔 Charlamos a veces → Sistema de 'Diferenciación'",
              "😌 Somos 'amigos' → Estrategia de 'Ruptura de Patrón'",
              "🔥 Encuentros íntimos → Protocolo de 'Definición de Relación'"
          ],
          SOY_MUJER: [
              "🧐 Contacto cero → Estrategia de 'Ruptura del Silencio'",
              "😢 Me ignora → Protocolo de 'Reactivación de Interés'",
              "❌ Me bloqueó → Técnica de 'Acceso Indirecto'", 
              "🤝 Solo temas necesarios → Método de 'Escalada Emocional'",
              "🤔 Charlamos a veces → Sistema de 'Diferenciación'",
              "😌 Somos 'amigos' → Estrategia de 'Ruptura de Patrón'",
              "🔥 Encuentros íntimos → Protocolo de 'Definición de Relación'"
          ]
      },
      elements: {
          strategyMapping: true,
          profileComplete: "80%",
      }
  },
  {
      id: 8,
      question: "ANALIZANDO FACTOR DE COMPETENCIA...",
      description: "Esta información determina la URGENCIA de tu estrategia y qué técnicas avanzadas necesitarás.",
      subtext: "DATO CRÍTICO #8 - ¿Ya está saliendo con otra persona?",
      options: {
          SOY_HOMBRE: [
              "🚫 Está soltera → Estrategia estándar aplicable",
              "🤔 No estoy seguro → Protocolo de investigación discreta",
              "😔 Saliendo casual → Técnica de diferenciación intensiva", 
              "💔 Relación seria → Estrategia avanzada de largo plazo",
              "🔄 Varias personas → Protocolo de valor único"
          ],
          SOY_MUJER: [
              "🚫 Está soltero → Estrategia estándar aplicable",
              "🤔 No estoy segura → Protocolo de investigación discreta",
              "😔 Saliendo casual → Técnica de diferenciación intensiva",
              "💔 Relación seria → Estrategia avanzada de largo plazo", 
              "🔄 Varias personas → Protocolo de valor único"
          ]
      },
      elements: {
          competitionAnalysis: true,
          profileComplete: "85%",
      }
  },
  {
      id: 9,
      question: "MIDIENDO TU NIVEL DE COMPROMISO...",
      description: "Tu nivel de determinación define qué tan profundo será tu plan personalizado y qué resultados puedes esperar.",
      subtext: "DATO FINAL - ¿Cuánto quieres recuperar esta relación?",
      options: [
          "1 - No estoy seguro → Plan básico de exploración",
          "2 - Lo estoy considerando → Plan intermedio de evaluación", 
          "3 - Lo quiero bastante → Plan avanzado de reconquista",
          "4 - Lo quiero con toda mi alma → Plan INTENSIVO personalizado"
      ],
      elements: {
          commitmentThermometer: true,
          profileComplete: "90%",
      }
  },
  {
      id: 10,
      question: "GENERANDO TU DIAGNÓSTICO PERSONALIZADO...",
      description: "Analizando todos tus datos para crear tu estrategia específica de reconquista...",
      options: [],
      autoAdvance: true,
      elements: {
          expertPhoto: true,
          expertImage: "https://comprarplanseguro.shop/wp-content/uploads/2025/09/Generated-Image-September-07_-2025-12_00AM-_1_-e1757389439336.webp",
          autoMessage: "Procesando 9 variables críticas de tu caso... basándome en 7 años de experiencia y 12,000 casos exitosos...",
          profileComplete: "95%",
          diagnosticGeneration: true,
      }
  },
  {
      id: 11,
      question: "MIENTRAS ANALIZO TU CASO, DESCUBRE LA CIENCIA DETRAS DE ESTE METODO",
      description: "Una investigación reciente revela por qué el PLAN A funciona a nivel neurológico y psicológico.",
      subtext: "Estudios recientes confirman que las técnicas que usaremos son avaladas por ciencia:",
      options: ["CONTINUAR PARA VER MIS RESULTADOS"],
      elements: {
          scientificEvidence: true,
          reportageImage: "https://comprarplanseguro.shop/wp-content/uploads/2025/10/imagem3-nova.webp",
          curiousImage: "https://comprarplanseguro.shop/wp-content/uploads/2025/10/estudos-imagem-2.webp",
          profileComplete: "97%",
      }
  },
  {
      id: 12,
      question: "🔮 ESTO ES LO QUE ELLA REALMENTE SENTIRÍA SI LE ESCRIBIERAS HOY",
      description: "Basándome en tu situación exacta y en 12,000 casos reales, aquí está la conversación que probablemente sucedería. No es una predicción genérica - es específica para ti.",
      subtext: "Lo que verás en los próximos segundos es lo más probable que suceda en la vida real:",
      options: ["VER CÓMO ELLA RESPONDERÍA"],
      elements: {
          whatsappSimulation: true,
          phoneSimulation: true,
          typingAnimation: true,
          personalizedChat: true,
          cinematicReveal: true,
          profileComplete: "100%",
          badge: "ANÁLISIS PREDICTIVO PERSONALIZADO",
          customComponent: "PhoneSimulationStep" // Indica que um componente customizado deve ser renderizado
      },
      note: "Esta demostración usa IA para predecir las respuestas más probables basándose en tu situación específica.",
      // O campo `customContent` foi removido daqui, pois o componente QuizStep renderiza o `WhatsAppMockup` diretamente para o step 12.
  },
  {
      id: 13,
      question: "🎯 TU PLAN A PERSONALIZADO ESTÁ LISTO",
      description: (gender: string) => {
          const personalizedInsight = getPersonalizedFirstInsight();
          const personalizedTechnique = getPersonalizedTechnique();
          return `Después de crear tu demostración específica, he confirmado que tu situación tiene **89% de probabilidad de éxito** usando el Plan A.

${personalizedInsight}

**Esta es solo la PRIMERA de las 21 técnicas específicas para tu caso:**

${personalizedTechnique}`;
      },
      subtext: "Plan completo personalizado + 21 técnicas específicas para tu situación",
      options: ["🚀 QUIERO ACCEDER AL PLAN A COMPLETO AHORA"],
      elements: {
          planAReveal: true,
          profileComplete: "100%",
          badge: "PLAN A - MÉTODO COMPLETO",
          finalReveal: true,
          planPreview: true,
          expertPhoto: true,
          expertImage: "https://comprarplanseguro.shop/wp-content/uploads/2025/09/Generated-Image-September-07_-2025-12_00AM-_1_-e1757389439336.webp",
      },
      finalReveal: {
          title: "🎁 EL PLAN A INCLUYE TODO ESTO:",
          features: [
              "✅ Las 21 técnicas específicas para tu situación exacta",
              "✅ Scripts personalizados para cada día del proceso", 
              "✅ Protocolo de emergencia si algo sale mal",
              "✅ Sistema de análisis de respuestas (decodificar qué piensa)",
              "✅ Plan B para casos con terceras personas",
              "✅ Técnicas avanzadas de psicología de reconquista",
              "✅ Soporte personalizado durante todo el proceso"
          ],
          urgency: "Solo 27 spots disponibles hoy - precio especial expira en 47 minutos",
          socialProof: "4,129 personas han usado el Plan A exitosamente este año",
          guarantee: "Garantía incondicional de 30 días - Si no funciona, te devuelvo el dinero"
      }
  }
];

// --- Dados de Depoimentos (Testimonials) ---

export const testimonials: Testimonial[] = [
  {
      name: "Carlos M., 34 años",
      text: "Respondió en 3 días. Volvimos en 11.",
      rating: 5,
  },
  {
      name: "Santiago B., 31 años", 
      text: "Seguí exactamente los pasos del Plan A. Al día 7, rompí el contacto cero. Al día 14 me pidió que nos viéramos. Ahora llevamos 6 meses juntos de nuevo.",
      rating: 5,
  },
  {
      name: "Diego L., 36 años",
      text: "Pensé que era imposible porque estaba con otro tipo. En 16 días lo dejó por mí.",
      rating: 5,
  }
];

// --- Mensagens de Prova Social ---

export const socialProofMessages: string[] = [
  "Estás entre el 17% más decidido a reconquistar",
  "Tu perfil muestra alta compatibilidad",
  "El 87% de personas en tu situación lograron resultados en menos de 14 días",
  "Estás más comprometido que el 73% que hizo esta prueba",
  "Solo 27 spots disponibles hoy para este método",
  "4,129 personas recuperaron sus relaciones este año"
];

// --- Função getPersonalizedContent ---

/**
 * Função utilitária para personalizar conteúdo (string ou array de strings)
 * com base no gênero do usuário.
 * @param content O conteúdo a ser personalizado (pode ser string, array, objeto com chaves de gênero, ou função).
 * @param gender O gênero do usuário ('SOY HOMBRE' ou 'SOY MUJER').
 * @returns O conteúdo personalizado.
 */
export function getPersonalizedContent(
  gender: string
): string | string[] {
  if (typeof content === "function") {
    try {
      return content(gender);
    } catch (error) {
      console.error("Error executing personalized content function:", error);
      return ""; // Fallback em caso de erro na função
    }
  }

  if (typeof content === "string" || Array.isArray(content)) {
    return content;
  }

  if (typeof content === "object" && content !== null) {
    if (content.SOY_HOMBRE && content.SOY_MUJER) {
      return gender === "SOY HOMBRE" ? content.SOY_HOMBRE : content.SOY_MUJER;
    }
    // Aviso para chaves de gênero antigas, caso ainda existam no quizSteps
    if (content.masculino && content.feminino) {
      console.warn("Using deprecated 'masculino'/'feminino' keys. Please update to 'SOY_HOMBRE'/'SOY_MUJER'.");
      return gender === "SOY HOMBRE" ? content.masculino : content.feminino;
    }
    return content; // Retorna o objeto original se nenhuma chave de gênero corresponder
  }

  return content;
}

// --- Exports Globais para Window (para compatibilidade) ---

// Esta seção é incluída para manter a compatibilidade com partes do código
// que possam acessar essas funções diretamente via o objeto `window`.
// Em aplicações Next.js/React modernas, a injeção de dependências ou importações
// diretas são preferíveis, mas esta abordagem é mantida para evitar quebras.
if (typeof window !== 'undefined') {
  // Inicializa window.quizAnswers se ainda não estiver presente
  window.quizAnswers = safeLocalStorage.getItem("quizAnswers", {}); 
  window.getPersonalizedFirstInsight = getPersonalizedFirstInsight;
  window.getPersonalizedTechnique = getPersonalizedTechnique;
  window.getExName = getExName;
  window.getExAvatar = getExAvatar;
  window.getPersonalizedFirstMessage = getPersonalizedFirstMessage;
  window.getPersonalizedExResponse = getPersonalizedExResponse;
  window.getPersonalizedFollowUp = getPersonalizedFollowUp;
  window.getHeaderName = getHeaderName;
}