// quiz-data.js - VERSÃO CORRIGIDA E SEGURA

// ✅ CORREÇÃO: Inicialização mais robusta
let quizAnswersCache = {};

if (typeof window !== 'undefined') {
    try {
        window.quizAnswers = window.quizAnswers || {};
        quizAnswersCache = window.quizAnswers;
    } catch (error) {
        console.warn('Erro ao inicializar quizAnswers:', error);
        quizAnswersCache = {};
    }
}

// ✅ CORREÇÃO: Função getUserAnswer mais segura
export function getUserAnswer(questionId) {
    try {
        if (typeof window !== 'undefined' && window.quizAnswers) {
            return window.quizAnswers[questionId] || '';
        }
        return quizAnswersCache[questionId] || '';
    } catch (error) {
        console.warn('Erro ao buscar resposta:', error);
        return '';
    }
}

// ✅ CORREÇÃO: getUserGender mais robusta
export function getUserGender() {
    try {
        const gender = getUserAnswer('question1');
        return gender || 'SOY HOMBRE';
    } catch (error) {
        console.warn('Erro ao determinar gênero:', error);
        return 'SOY HOMBRE';
    }
}

// ✅ CORREÇÃO: getExName com fallback seguro
export function getExName() {
    try {
        const gender = getUserGender();
        const femaleNames = ['María'];
        const maleNames = ['Carlos'];
        
        const names = gender === "SOY HOMBRE" ? femaleNames : maleNames;
        return names[0]; // Sempre retorna o primeiro nome para evitar random
    } catch (error) {
        console.warn('Erro ao gerar nome:', error);
        return 'María'; // Fallback fixo
    }
}

// ✅ CORREÇÃO: Funções simples e seguras
export function getExAvatar() {
    return "https://i.ibb.co/5hbjyZFJ/CASAL-JOSE.webp";
}

export function getHeaderName() {
    return "José Plan";
}

// ✅ CORREÇÃO: getPersonalizedFirstMessage simplificada
export function getPersonalizedFirstMessage() {
    try {
        const currentSituation = getUserAnswer('question7');
        
        const messages = {
            "contacto cero": "Hola, encontré algo que es tuyo. ¿Cuándo puedes pasar a recogerlo?",
            "me ignora": "Hola, no voy a molestarte más. Solo quería agradecerte por algo que me enseñaste.",
            "bloqueado": "Hola, María me pidió preguntarte sobre el evento del viernes.",
            "cosas necesarias": "Hola, vi esta foto nuestra del viaje a la playa y me hizo sonreír. Espero que estés bien.",
            "charlamos": "Hola, tengo que contarte algo curioso que me pasó que te va a hacer reír. ¿Tienes 5 minutos para una llamada?",
            "amigos": "Hola, me acordé de algo que me dijiste el otro día y me hizo pensar. ¿Cómo estás?",
            "Encuentros íntimos": "Hola, anoche fue increíble. ¿Te gustaría repetirlo pronto?"
        };

        for (const [key, message] of Object.entries(messages)) {
            if (currentSituation.includes(key)) {
                return message;
            }
        }

        return "Hola, vi algo que me recordó a cuando fuimos al parque. Me alegró el día. Espero que estés bien.";
    } catch (error) {
        console.warn('Erro ao gerar primeira mensagem:', error);
        return "Hola, ¿cómo estás?";
    }
}

// ✅ CORREÇÃO: getPersonalizedExResponse simplificada  
export function getPersonalizedExResponse() {
    try {
        const currentSituation = getUserAnswer('question7');
        
        const responses = {
            "contacto cero": "¿Qué cosa? No recuerdo haber dejado nada...",
            "me ignora": "¿Qué me enseñaste? Me tienes curiosa...",
            "bloqueado": "Ah sí, dile que sí voy. Gracias por preguntar.",
            "cosas necesarias": "😊 Qué bonito recuerdo. Yo también estoy bien, gracias.",
            "charlamos": "Jajaja ya me tienes intrigada. Cuéntame por aquí primero",
            "amigos": "Bien, ¿y tú? ¿Qué te hizo pensar?",
            "Encuentros íntimos": "Sí, me encantaría. ¿Cuándo estás libre?"
        };

        for (const [key, response] of Object.entries(responses)) {
            if (currentSituation.includes(key)) {
                return response;
            }
        }

        return "Gracias por acordarte de mí. ¿Cómo has estado?";
    } catch (error) {
        console.warn('Erro ao gerar resposta da ex:', error);
        return "Gracias por escribir.";
    }
}

export function getPersonalizedFollowUp() {
    return "Me alegra que respondas. ¿Te parece si hablamos mejor mañana? Tengo algunas cosas que hacer ahora.";
}

// ✅ CORREÇÃO: getPersonalizedFirstInsight simplificada
export function getPersonalizedFirstInsight() {
    try {
        const currentSituation = getUserAnswer('question7');
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

        return "❌ ERROR DETECTADO: Tu estrategia actual está generando el EFECTO CONTRARIO al que buscas. Hay un patrón específico que debes romper.";
    } catch (error) {
        console.warn('Erro ao gerar insight:', error);
        return "❌ ERROR DETECTADO: Tu estrategia actual necesita ajustes importantes.";
    }
}

// ✅ CORREÇÃO: getPersonalizedTechnique simplificada
export function getPersonalizedTechnique() {
    try {
        const currentSituation = getUserAnswer('question7');
        
        if (currentSituation.includes("contacto cero")) {
            return `🎯 TU TÉCNICA: "RUPTURA DEL SILENCIO MAGNÉTICO"

PASO 1: Envía exactamente este mensaje en 48h:
"Hey ${getExName()}, encontré algo que te pertenece. ¿Cuándo puedes pasar a recogerlo?"

PASO 2: Cuando responda:
"Perfecto, déjalo en [lugar específico]. No necesitamos vernos."

¿Por qué funciona? Crea CURIOSIDAD sin presión.`;
        }
        
        if (currentSituation.includes("me ignora")) {
            return `🎯 TU TÉCNICA: "MENSAJE DE CURIOSIDAD IRRESISTIBLE"

MENSAJE EXACTO:
"No voy a molestarte más. Solo quería agradecerte por algo que me enseñaste."

NO envíes nada más. Espera 72h.

¿Por qué funciona? Rompe el patrón de expectativa.`;
        }

        return `🎯 TU TÉCNICA: "REACTIVACIÓN EMOCIONAL"

MENSAJE ESPECÍFICO:
"Vi algo y recordé cuando [memoria positiva]. Espero que estés bien."

Envía solo esto. No esperes respuesta inmediata.

¿Por qué funciona? Reactiva conexión emocional sin presión.`;
    } catch (error) {
        console.warn('Erro ao gerar técnica:', error);
        return "🎯 TU TÉCNICA: Plan personalizado disponible.";
    }
}

// ✅ CORREÇÃO: getPersonalizedContent simplificada
export function getPersonalizedContent(content, gender) {
    try {
        if (typeof content === "string") {
            return content;
        }

        if (typeof content === "object" && content !== null) {
            if (content.SOY_HOMBRE && content.SOY_MUJER) {
                return gender === "SOY HOMBRE" ? content.SOY_HOMBRE : content.SOY_MUJER;
            }
        }

        return content;
    } catch (error) {
        console.warn('Erro ao personalizar conteúdo:', error);
        return content || '';
    }
}

// ✅ DADOS SIMPLIFICADOS E SEGUROS
export const quizSteps = [
    {
        id: 1,
        question: "¡NO DEJES QUE LA PERSONA QUE AMAS SALGA DE TU VIDA PARA SIEMPRE!",
        description: "INICIANDO ANÁLISIS PSICOLÓGICO - Para revelar si ella aún siente algo por ti, necesito mapear tu perfil emocional específico.",
        subtext: "Tu género influye directamente en cómo ella procesa la separación:",
        options: ["SOY HOMBRE", "SOY MUJER"],
        warning: "⚠️ IMPORTANTE: Este análisis fue desarrollado basándose en 12,000 casos reales de reconquista.",
        elements: {
            psychologicalTest: true,
            timer: "Análisis en progreso...",
        }
    },
    {
        id: 2,
        question: "MAPEANDO TU PERFIL EMOCIONAL...",
        description: "Tu edad determina qué técnicas psicológicas tendrán mayor impacto en tu caso específico.",
        subtext: "Selecciona tu rango de edad:",
        options: [
            "18-29 años → Fase de alta intensidad emocional",
            "30-39 años → Período de madurez y estabilidad", 
            "40-49 años → Etapa de reevaluación de prioridades",
            "50+ años → Fase de sabiduría emocional"
        ],
        elements: {
            counter: "personas analizadas hoy",
        }
    },
    {
        id: 3,
        question: "CALCULANDO PROBABILIDADES DE RECONQUISTA...",
        description: "El tiempo de separación es el factor más crítico para determinar qué técnicas usar.",
        subtext: "¿Cuánto tiempo llevan separados?",
        options: [
            "Menos de 1 semana → Ventana de oportunidad crítica",
            "1-4 semanas → Período de reflexión activa", 
            "1-6 meses → Fase de adaptación emocional",
            "Más de 6 meses → Etapa de reconstrucción profunda"
        ],
        elements: {
            profileComplete: "30%",
        }
    },
    {
        id: 4,
        question: "IDENTIFICANDO PATRÓN DE RUPTURA...",
        description: "Cómo terminó la relación revela su estado emocional actual.",
        subtext: "¿Cómo fue la separación?",
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
            profileComplete: "45%",
        }
    },
    {
        id: 5,
        question: "ANALIZANDO INTENSIDAD EMOCIONAL...",
        description: "La duración de la relación determina la profundidad del vínculo emocional.",
        subtext: "¿Cuánto tiempo estuvieron juntos?",
        options: [
            "Más de 3 años → Vínculo profundo establecido",
            "1-3 años → Conexión emocional sólida", 
            "6 meses-1 año → Atracción en desarrollo",
            "Menos de 6 meses → Química inicial"
        ],
        elements: {
            profileComplete: "60%",
        }
    },
    {
        id: 6,
        question: "DETECTANDO TU PUNTO DE DOLOR PRINCIPAL...",
        description: "Tu mayor sufrimiento revela qué necesitas sanar ANTES de aplicar cualquier técnica.",
        subtext: "¿Cuál fue la parte más dolorosa?",
        options: {
            SOY_HOMBRE: [
                "😔 La soledad y el vacío",
                "😢 La montaña rusa emocional",
                "😐 Los recuerdos constantes",
                "💔 Imaginarla con otro",
                "🤔 Los planes perdidos",
                "⚡ Otro"
            ],
            SOY_MUJER: [
                "😔 La soledad y el vacío",
                "😢 La montaña rusa emocional", 
                "😐 Los recuerdos constantes",
                "💔 Imaginarlo con otra",
                "🤔 Los planes perdidos",
                "⚡ Otro"
            ]
        },
        elements: {
            profileComplete: "70%",
        }
    },
    {
        id: 7,
        question: "EVALUANDO TU SITUACIÓN ACTUAL...",
        description: "Tu situación presente define tu PUNTO DE PARTIDA.",
        subtext: "¿Cuál es tu situación actual con tu ex?",
        options: {
            SOY_HOMBRE: [
                "🧐 Contacto cero",
                "😢 Me ignora", 
                "❌ Me bloqueó",
                "🤝 Solo temas necesarios",
                "🤔 Charlamos a veces",
                "😌 Somos 'amigos'",
                "🔥 Encuentros íntimos"
            ],
            SOY_MUJER: [
                "🧐 Contacto cero",
                "😢 Me ignora",
                "❌ Me bloqueó", 
                "🤝 Solo temas necesarios",
                "🤔 Charlamos a veces",
                "😌 Somos 'amigos'",
                "🔥 Encuentros íntimos"
            ]
        },
        elements: {
            profileComplete: "80%",
        }
    },
    {
        id: 8,
        question: "ANALIZANDO FACTOR DE COMPETENCIA...",
        description: "Esta información determina la URGENCIA de tu estrategia.",
        subtext: "¿Ya está saliendo con otra persona?",
        options: {
            SOY_HOMBRE: [
                "🚫 Está soltera",
                "🤔 No estoy seguro",
                "😔 Saliendo casual", 
                "💔 Relación seria",
                "🔄 Varias personas"
            ],
            SOY_MUJER: [
                "🚫 Está soltero",
                "🤔 No estoy segura",
                "😔 Saliendo casual",
                "💔 Relación seria", 
                "🔄 Varias personas"
            ]
        },
        elements: {
            profileComplete: "85%",
        }
    },
    {
        id: 9,
        question: "MIDIENDO TU NIVEL DE COMPROMISO...",
        description: "Tu nivel de determinación define qué tan profundo será tu plan personalizado.",
        subtext: "¿Cuánto quieres recuperar esta relación?",
        options: [
            "1 - No estoy seguro",
            "2 - Lo estoy considerando", 
            "3 - Lo quiero bastante",
            "4 - Lo quiero con toda mi alma"
        ],
        elements: {
            thermometer: true,
            profileComplete: "90%",
        }
    },
    {
        id: 10,
        question: "GENERANDO TU DIAGNÓSTICO PERSONALIZADO...",
        description: "Analizando todos tus datos para crear tu estrategia específica...",
        options: [],
        autoAdvance: true,
        elements: {
            expertPhoto: true,
            expertImage: "https://comprarplanseguro.shop/wp-content/uploads/2025/09/Generated-Image-September-07_-2025-12_00AM-_1_-e1757389439336.webp",
            autoMessage: "Procesando 9 variables críticas de tu caso...",
            profileComplete: "95%",
        }
    },
    {
        id: 11,
        question: "MIENTRAS ANALIZO TU CASO, DESCUBRE LA CIENCIA DETRAS DE ESTE METODO",
        description: "Una investigación reciente revela por qué el PLAN A funciona a nivel neurológico.",
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
        question: "🔮 ESTO ES LO QUE ELLA REALMENTE SENTIRÍA SI LE ESCRIBES HOY",
        description: "Basándome en tu situación exacta, aquí está la conversación que probablemente sucedería.",
        subtext: "Lo que verás es lo más probable que suceda:",
        options: [],
        elements: {
            whatsappSimulation: true,
            profileComplete: "100%",
        }
    },
    {
        id: 13,
        question: "🎯 TU PLAN A PERSONALIZADO ESTÁ LISTO",
        description: "Tu situación tiene 89% de probabilidad de éxito usando el Plan A.",
        options: ["🚀 QUIERO ACCEDER AL PLAN A COMPLETO AHORA"],
        elements: {
            finalReveal: true,
            profileComplete: "100%",
        }
    }
];

export const socialProofMessages = [
    "Estás entre el 17% más decidido a reconquistar",
    "Tu perfil muestra alta compatibilidad",
    "El 87% logró resultados en menos de 14 días",
    "Solo 27 spots disponibles hoy",
    "4,129 personas recuperaron sus relaciones este año"
];

export const testimonials = [
    {
        name: "Carlos M., 34 años",
        text: "Respondió en 3 días. Volvimos en 11.",
        rating: 5,
    }
];