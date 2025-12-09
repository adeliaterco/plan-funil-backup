// 
// /lib/quiz-data.ts
// Este arquivo contém a lógica de dados e personalização para o quiz.
// 

// === 1. CONSTANTES ===
export const GENDER_VALUES = {
  MALE: "SOY HOMBRE",
  FEMALE: "SOY MUJER"
} as const;

export const FEMALE_NAMES = ['María', 'Ana', 'Carmen', 'Isabel', 'Sofía', 'Elena', 'Laura'];
export const MALE_NAMES = ['Carlos', 'José', 'Antonio', 'Manuel', 'Luis', 'Miguel', 'Alejandro'];

export const SITUATION_PATTERNS = {
  ZERO_CONTACT: "contacto cero",
  IGNORING: "me ignora",
  BLOCKED: "bloqueó", // Corrigido para corresponder ao texto da opção
  NECESSARY_ONLY: "solo temas necesarios", // Corrigido para corresponder ao texto da opção
  CHATTING: "charlamos a veces", // Corrigido para corresponder ao texto da opção
  FRIENDS: "somos 'amigos'", // Corrigido para corresponder ao texto da opção
  INTIMATE_ENCOUNTERS: "encuentros íntimos" // Corrigido para corresponder ao texto da opção
} as const;

// === 2. CLASSE QuizDataCache para cache de localStorage ===
class QuizDataCache {
  private static instance: QuizDataCache;
  private cache: Map<string, any> = new Map();
  private lastUpdate: number = 0;
  private updateInterval: number = 1000; // Cache válido por 1 segundo

  private constructor() {} // Singleton pattern

  static getInstance(): QuizDataCache {
    if (!QuizDataCache.instance) {
      QuizDataCache.instance = new QuizDataCache();
    }
    return QuizDataCache.instance;
  }

  getQuizAnswers(): Record<string, string> {
    const now = Date.now();
    // Retorna do cache se for recente
    if (this.cache.has('quizAnswers') && now - this.lastUpdate < this.updateInterval) {
      return this.cache.get('quizAnswers') || {};
    }

    if (typeof window === 'undefined') return {};

    try {
      const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      this.cache.set('quizAnswers', answers);
      this.lastUpdate = now;
      return answers;
    } catch (e) {
      console.error('QuizDataCache: Erro ao ler quizAnswers do localStorage:', e);
      return {};
    }
  }

  getUserGender(): string {
    try {
      const answers = this.getQuizAnswers();
      return answers.question1 || GENDER_VALUES.MALE;
    } catch (e) {
      console.error('QuizDataCache: Erro ao obter gênero do usuário:', e);
      return GENDER_VALUES.MALE;
    }
  }

  getCurrentSituation(): string {
    try {
      const answers = this.getQuizAnswers();
      return answers.question7 || '';
    } catch (e) {
      console.error('QuizDataCache: Erro ao obter situação atual:', e);
      return '';
    }
  }

  clear(): void {
    this.cache.clear();
    this.lastUpdate = 0;
  }
}

// === 3. FUNÇÕES BÁSICAS ===
export function getUserAnswer(questionId: string): string {
  try {
    const cache = QuizDataCache.getInstance();
    const answers = cache.getQuizAnswers();
    return answers[questionId] || '';
  } catch (e) {
    console.error(`getUserAnswer: Erro ao obter resposta para ${questionId}:`, e);
    return '';
  }
}

export function getUserGender(): string {
  try {
    const cache = QuizDataCache.getInstance();
    return cache.getUserGender();
  } catch (e) {
    console.error('getUserGender: Erro ao obter gênero:', e);
    return GENDER_VALUES.MALE;
  }
}

export function getSituationKey(situation: string): keyof typeof SITUATION_PATTERNS | null {
  if (!situation) return null;

  // Normaliza a string da situação para comparação
  const normalizedSituation = situation.toLowerCase();

  for (const [key, pattern] of Object.entries(SITUATION_PATTERNS)) {
    if (normalizedSituation.includes(pattern.toLowerCase())) {
      return key as keyof typeof SITUATION_PATTERNS;
    }
  }
  return null;
}

// === 4. MAPS PARA PERSONALIZAÇÃO ===

// Mapas de mensagens para o WhatsApp Mockup
const messageMapBySituation = {
  [SITUATION_PATTERNS.ZERO_CONTACT]: {
    first: `Hola, encontré algo que es tuyo. ¿Cuándo puedes pasar a recogerlo?`,
    response: "¿Qué cosa? No recuerdo haber dejado nada..."
  },
  [SITUATION_PATTERNS.IGNORING]: {
    first: `Hola, no voy a molestarte más. Solo quería agradecerte por algo que me enseñaste.`,
    response: "¿Qué me enseñé? Me tienes curiosa..."
  },
  [SITUATION_PATTERNS.BLOCKED]: {
    first: `Hola, María me pidió preguntarte sobre el evento del viernes.`,
    response: "Ah sí, dile que sí voy. Gracias por preguntar."
  },
  [SITUATION_PATTERNS.NECESSARY_ONLY]: {
    first: `Hola, vi esta foto nuestra del viaje a la playa y me hizo sonreír. Espero que estés bien.`,
    response: "😊 Qué bonito recuerdo. Yo también estoy bien, gracias."
  },
  [SITUATION_PATTERNS.CHATTING]: {
    first: `Hola, tengo que contarte algo curioso que me pasó que te va a hacer reír. ¿Tienes 5 minutos para una llamada?`,
    response: "Jajaja ya me tienes intrigada. Cuéntame por aquí primero"
  },
  [SITUATION_PATTERNS.FRIENDS]: {
    first: `Hola, vi algo que me recordó a cuando fuimos al parque. Me alegró el día. Espero que estés bien.`,
    response: "Gracias por acordarte de mí. ¿Cómo has estado?"
  },
  [SITUATION_PATTERNS.INTIMATE_ENCOUNTERS]: {
    first: `Hola, vi algo que me recordó a cuando fuimos al parque. Me alegró el día. Espero que estés bien.`,
    response: "Gracias por acordarte de mí. ¿Cómo has estado?"
  }
};

const defaultMessages = {
  first: `Hola, vi algo que me recordó a cuando fuimos al parque. Me alegró el día. Espero que estés bien.`,
  response: "Gracias por acordarte de mí. ¿Cómo has estado?"
};

// Mapas de insights personalizados
const insightMapBySituation = {
  [SITUATION_PATTERNS.ZERO_CONTACT]: 
    "❌ ERROR DETECTADO: Estás aplicando contacto cero de forma INCORRECTA. El 73% de los hombres cometen este error que los aleja definitivamente de su ex.",
  [SITUATION_PATTERNS.IGNORING]: 
    "❌ ERROR DETECTADO: Estás siendo IGNORADO porque usas las palabras EQUIVOCADAS. Hay 3 tipos de mensajes que rompen el muro del silencio.",
  [SITUATION_PATTERNS.BLOCKED]: 
    "❌ ERROR DETECTADO: Fuiste BLOQUEADO porque ella siente PRESIÓN. Existe una técnica específica para casos de bloqueo que funciona en 9 de cada 10 veces.",
  [SITUATION_PATTERNS.NECESSARY_ONLY]: 
    "❌ ERROR DETECTADO: El contacto 'solo por necesidad' está MATANDO tu atractivo. Cada mensaje aburrido te aleja más de la reconquista.",
  [SITUATION_PATTERNS.CHATTING]: 
    "❌ ERROR DETECTADO: Charlar 'como amigos' es la TRAMPA más peligrosa. Estás en la zona de confort que te mantiene lejos de su corazón.",
  [SITUATION_PATTERNS.FRIENDS]: 
    "❌ ERROR DETECTADO: Ser 'solo amigos' es el LIMBO emocional. El 87% que se queda aquí nunca sale de esta zona.",
  [SITUATION_PATTERNS.INTIMATE_ENCOUNTERS]:
    "❌ ERROR DETECTADO: Los 'encuentros íntimos' sin definición están creando una relación sin futuro. Necesitas un protocolo de definición."
};

const defaultInsight = 
  "❌ ERROR DETECTADO: Tu estrategia actual está generando el EFECTO CONTRARIO al que buscas. Hay un patrón específico que debes romper.";

// Mapas de técnicas personalizadas (funções para permitir variáveis dinâmicas)
const techniqueMapBySituation = {
  [SITUATION_PATTERNS.ZERO_CONTACT]: (timeApart: string, pronoun: string) => 
    `🎯 TU TÉCNICA: "RUPTURA DEL SILENCIO MAGNÉTICO"
    
Tu situación: Contacto cero + ${timeApart}

PASO 1: Envía exactamente este mensaje en 48h:
"Hey [nombre], encontré algo que te pertenece. ¿Cuándo puedes pasar a recogerlo?"

PASO 2: Cuando responda (lo hará en 67% de los casos):
"Perfecto, déjalo en [lugar específico]. No necesitamos vernos."

¿Por qué funciona? Crea CURIOSIDAD sin presión. El cerebro femenino no puede resistir el misterio.`,

  [SITUATION_PATTERNS.IGNORING]: (timeApart: string, pronoun: string) => 
    `🎯 TU TÉCNICA: "MENSAJE DE CURIOSIDAD IRRESISTIBLE"
    
Tu situación: Te ignora + ${timeApart} separados

MENSAJE EXACTO para enviar:
"No voy a molestarte más. Solo quería agradecerte por algo que me enseñaste."

NO envíes nada más. Espera 72h.

¿Por qué funciona? Rompe el patrón de expectativa. ${pronoun} esperaba súplicas, no gratitud.`,

  [SITUATION_PATTERNS.BLOCKED]: (timeApart: string, pronoun: string) =>
    `🎯 TU TÉCNICA: "ACCESO INDIRECTO ESTRATÉGICO"
    
Tu situación: Te bloqueó + ${timeApart} separados

PASO 1: Contacta a un amigo en común con un mensaje neutro.
"Hola [Nombre del amigo], ¿sabes si [Nombre de tu ex] irá al evento X?"

PASO 2: Si tu ex se entera, espera su reacción. Si no, el amigo puede mencionar casualmente que preguntaste.

¿Por qué funciona? Elimina la presión directa y activa la curiosidad de ${pronoun}.`,

  [SITUATION_PATTERNS.NECESSARY_ONLY]: (timeApart: string, pronoun: string) =>
    `🎯 TU TÉCNICA: "ESCALADA EMOCIONAL INESPERADA"
    
Tu situación: Solo temas necesarios + ${timeApart} separados

MENSAJE EXACTO para enviar (cuando surja un tema necesario):
"Ok, sobre [tema necesario]. Por cierto, vi [algo que te recordó a ella/él] y me hizo sonreír. Espero que estés bien."

¿Por qué funciona? Rompe el patrón de comunicación aburrida e introduce una emoción positiva inesperada.`,

  [SITUATION_PATTERNS.CHATTING]: (timeApart: string, pronoun: string) =>
    `🎯 TU TÉCNICA: "DIFERENCIACIÓN Y VALOR"
    
Tu situación: Charlan a veces + ${timeApart} separados

MENSAJE EXACTO para enviar:
"Tengo que contarte algo curioso que me pasó que te va a hacer reír. ¿Tienes 5 minutos para una llamada?"

¿Por qué funciona? Crea intriga y te posiciona como alguien con una vida interesante, no solo un amigo.`,

  [SITUATION_PATTERNS.FRIENDS]: (timeApart: string, pronoun: string) =>
    `🎯 TU TÉCNICA: "RUPTURA DE PATRÓN AMISTOSO"
    
Tu situación: Son 'amigos' + ${timeApart} separados

MENSAJE EXACTO para enviar:
"Me di cuenta de que nuestra 'amistad' es un poco extraña. ¿No crees?"

¿Por qué funciona? Desafía el status quo, genera incomodidad (positiva) y abre la puerta a una conversación más profunda.`,

  [SITUATION_PATTERNS.INTIMATE_ENCOUNTERS]: (timeApart: string, pronoun: string) =>
    `🎯 TU TÉCNICA: "PROTOCOLO DE DEFINICIÓN CLARA"
    
Tu situación: Encuentros íntimos + ${timeApart} separados

MENSAJE EXACTO para enviar:
"Necesito que seamos claros sobre lo que está pasando entre nosotros. ¿Podemos hablar seriamente?"

¿Por qué funciona? Establece límites, muestra que valoras la relación y fuerza una definición, evitando el limbo.`
};

const defaultTechnique = (currentSituation: string) => 
  `🎯 TU TÉCNICA: "REACTIVACIÓN EMOCIONAL"
    
Para tu situación específica: ${currentSituation}

MENSAJE ESPECÍFICO:
"Vi [algo específico] y recordé cuando [memoria positiva compartida]. Espero que estés bien."

Envía solo esto. No esperes respuesta inmediata.

¿Por qué funciona? Reactiva conexión emocional sin presión ni demandas.`;

// === 5. FUNÇÕES EXPORTADAS (com try/catch e cache simples) ===

let exNameCachedResult: string | null = null;
let exNameCacheGender: string | null = null;

export function getExName(): string {
  try {
    const gender = getUserGender();
    
    // Cache o resultado para a sessão atual e gênero
    if (exNameCachedResult && exNameCacheGender === gender) {
      return exNameCachedResult;
    }

    const names = gender === GENDER_VALUES.MALE ? FEMALE_NAMES : MALE_NAMES;
    const result = names[Math.floor(Math.random() * names.length)];
    
    exNameCachedResult = result;
    exNameCacheGender = gender;
    
    return result;
  } catch (e) {
    console.error('getExName: Erro ao gerar nome da ex:', e);
    return 'José Plan'; // Fallback
  }
}

export function getExAvatar(): string {
  return "https://i.ibb.co/5hbjyZFJ/CASAL-JOSE.webp";
}

export function getHeaderName(): string {
  return "José Plan";
}

export function getPersonalizedFirstMessage(): string {
  try {
    const currentSituation = getUserAnswer('question7');
    const situationKey = getSituationKey(currentSituation);
    
    if (situationKey && messageMapBySituation[situationKey]) {
      return messageMapBySituation[situationKey].first;
    }
    return defaultMessages.first;
  } catch (e) {
    console.error('getPersonalizedFirstMessage: Erro ao gerar primeira mensagem:', e);
    return defaultMessages.first;
  }
}

export function getPersonalizedExResponse(): string {
  try {
    const currentSituation = getUserAnswer('question7');
    const situationKey = getSituationKey(currentSituation);
    
    if (situationKey && messageMapBySituation[situationKey]) {
      return messageMapBySituation[situationKey].response;
    }
    return defaultMessages.response;
  } catch (e) {
    console.error('getPersonalizedExResponse: Erro ao gerar resposta da ex:', e);
    return defaultMessages.response;
  }
}

export function getPersonalizedFollowUp(): string {
  return "Me alegra que respondas. ¿Te parece si hablamos mejor mañana? Tengo algunas cosas que hacer ahora.";
}

export function getPersonalizedFirstInsight(): string {
  try {
    const currentSituation = getUserAnswer('question7');
    const whoEnded = getUserAnswer('question4');
    const situationKey = getSituationKey(currentSituation);

    if (situationKey && insightMapBySituation[situationKey]) {
      return insightMapBySituation[situationKey];
    }

    if (whoEnded && whoEnded.toLowerCase().includes("terminó conmigo")) {
      return "❌ ERROR DETECTADO: Después de que TE DEJARAN, tu estrategia actual está creando más RESISTENCIA. El 84% cometen este error psicológico.";
    }

    return defaultInsight;
  } catch (e) {
    console.error('getPersonalizedFirstInsight: Erro ao gerar insight:', e);
    return defaultInsight;
  }
}

export function getPersonalizedTechnique(): string {
  try {
    const currentSituation = getUserAnswer('question7');
    const timeApart = getUserAnswer('question3');
    const gender = getUserGender();
    const pronoun = gender === GENDER_VALUES.MALE ? "ella" : "él";
    
    const situationKey = getSituationKey(currentSituation);

    if (situationKey && techniqueMapBySituation[situationKey]) {
      return techniqueMapBySituation[situationKey](timeApart, pronoun);
    }

    return defaultTechnique(currentSituation);
  } catch (e) {
    console.error('getPersonalizedTechnique: Erro ao gerar técnica:', e);
    return defaultTechnique('');
  }
}

export function getPersonalizedContent(content: any, gender: string): any {
  try {
    if (typeof content === "string") {
      return content;
    }

    if (typeof content === "object" && content !== null && !Array.isArray(content)) {
      // Verifica se é um objeto com chaves de gênero
      if (content[GENDER_VALUES.MALE] && content[GENDER_VALUES.FEMALE]) {
        return gender === GENDER_VALUES.MALE ? content[GENDER_VALUES.MALE] : content[GENDER_VALUES.FEMALE];
      }
      // Fallback para compatibilidade com versões antigas (masculino/feminino)
      if (content.masculino && content.feminino) {
        return gender === GENDER_VALUES.MALE ? content.masculino : content.feminino;
      }
      return content; // Retorna o objeto se não for específico de gênero
    }

    if (Array.isArray(content)) {
      return content; // Retorna o array diretamente
    }

    return content; // Retorna qualquer outro tipo de conteúdo
  } catch (e) {
    console.error('getPersonalizedContent: Erro ao personalizar conteúdo:', e);
    return content;
  }
}

// === 6. ARRAY quizSteps com 13 steps completos ===
export const quizSteps = [
    {
        id: 1,
        question: "¡NO DEJES QUE LA PERSONA QUE AMAS SALGA DE TU VIDA PARA SIEMPRE!",
        description: "INICIANDO ANÁLISIS PSICOLÓGICO - Para revelar si ella aún siente algo por ti, necesito mapear tu perfil emocional específico.",
        subtext: "DATO CRÍTICO #1 - Tu género influye directamente en cómo ella procesa la separación:",
        options: [GENDER_VALUES.MALE, GENDER_VALUES.FEMALE],
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
            [GENDER_VALUES.MALE]: [
                "Ella terminó conmigo → Patrón de rechazo activo",
                "Yo terminé con ella → Patrón de arrepentimiento",
                "Decisión mutua → Patrón de duda compartida"
            ],
            [GENDER_VALUES.FEMALE]: [
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
            [GENDER_VALUES.MALE]: [
                "😔 La soledad y el vacío → Necesitas 'Protocolo de Autoconfianza'",
                "😢 La montaña rusa emocional → Necesitas 'Estabilización Mental'",
                "😐 Los recuerdos constantes → Necesitas 'Técnica de Reframe'",
                "💔 Imaginarla con otro → Necesitas 'Estrategia de Diferenciación'",
                "🤔 Los planes perdidos → Necesitas 'Visión de Futuro'",
                "⚡ Otro → Requiere análisis personalizado"
            ],
            [GENDER_VALUES.FEMALE]: [
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
            [GENDER_VALUES.MALE]: [
                "🧐 Contacto cero → Estrategia de 'Ruptura del Silencio'",
                "😢 Me ignora → Protocolo de 'Reactivación de Interés'", 
                "❌ Me bloqueó → Técnica de 'Acceso Indirecto'",
                "🤝 Solo temas necesarios → Método de 'Escalada Emocional'",
                "🤔 Charlamos a veces → Sistema de 'Diferenciación'",
                "😌 Somos 'amigos' → Estrategia de 'Ruptura de Patrón'",
                "🔥 Encuentros íntimos → Protocolo de 'Definición de Relación'"
            ],
            [GENDER_VALUES.FEMALE]: [
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
            [GENDER_VALUES.MALE]: [
                "🚫 Está soltera → Estrategia estándar aplicable",
                "🤔 No estoy seguro → Protocolo de investigación discreta",
                "😔 Saliendo casual → Técnica de diferenciación intensiva", 
                "💔 Relación seria → Estrategia avanzada de largo plazo",
                "🔄 Varias personas → Protocolo de valor único"
            ],
            [GENDER_VALUES.FEMALE]: [
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
        },
        note: "Esta demostración usa IA para predecir las respuestas más probables basándose en tu situación específica.",
    },

    {
        id: 13,
        question: "🎯 TU PLAN A PERSONALIZADO ESTÁ LISTO",
        description: () => {
          try {
            const insight = getPersonalizedFirstInsight();
            const technique = getPersonalizedTechnique();
            return `Después de crear tu demostración específica, he confirmado que tu situación tiene **89% de probabilidad de éxito** usando el Plan A.

${insight}

**Esta es solo la PRIMERA de las 21 técnicas específicas para tu caso:**

${technique}`;
          } catch (e) {
            console.error('quizSteps[12].description: Erro ao gerar descrição final:', e);
            return "Tu plan personalizado está listo.";
          }
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

// === 7. ARRAY testimonials ===
export const testimonials = [
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

// === 8. ARRAY socialProofMessages ===
export const socialProofMessages = [
    "Estás entre el 17% más decidido a reconquistar",
    "Tu perfil muestra alta compatibilidad",
    "El 87% de personas en tu situación lograron resultados en menos de 14 días",
    "Estás más comprometido que el 73% que hizo esta prueba",
    "Solo 27 spots disponibles hoy para este método",
    "4,129 personas recuperaron sus relaciones este año"
];

// === 10. EXPORTAR COMO NAMESPACE __quizUtils NO WINDOW ===
// Isso evita poluir o escopo global e previne erros de "Cannot create property on string"
if (typeof window !== 'undefined') {
    (window as any).__quizUtils = {
        GENDER_VALUES,
        FEMALE_NAMES,
        MALE_NAMES,
        SITUATION_PATTERNS,
        QuizDataCache: QuizDataCache.getInstance(), // Exporta a instância do singleton
        getUserAnswer,
        getUserGender,
        getSituationKey,
        getExName,
        getExAvatar,
        getHeaderName,
        getPersonalizedFirstMessage,
        getPersonalizedExResponse,
        getPersonalizedFollowUp,
        getPersonalizedFirstInsight,
        getPersonalizedTechnique,
        getPersonalizedContent,
        quizSteps,
        testimonials,
        socialProofMessages,
    };
}