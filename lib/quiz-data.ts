// quiz-data.js

// ✅ INICIALIZAÇÃO GLOBAL MELHORADA
if (typeof window !== 'undefined') {
    // Inicialização mais segura
    window.quizAnswers = window.quizAnswers || {};
}

// 1. Funções de personalização

/**
 * Retrieves the answer for a specific quiz question from global storage.
 * @param {string} questionId - The ID of the question (e.g., 'question1').
 * @returns {string} The answer to the question, or an empty string if not found.
 */
export function getUserAnswer(questionId) {
    if (typeof window === 'undefined' || !window.quizAnswers) {
        return ''; // Return empty string if not in browser or quizAnswers not initialized
    }
    return window.quizAnswers[questionId] || '';
}

/**
 * Determines the user's gender based on their answer to question 1.
 * @returns {string} 'SOY HOMBRE' or 'SOY MUJER', defaults to 'SOY HOMBRE'.
 */
export function getUserGender() {
    const gender = getUserAnswer('question1');
    return gender || 'SOY HOMBRE'; // Default to 'SOY HOMBRE' if not set
}

/**
 * Generates a random ex-partner's name based on the user's gender.
 * @returns {string} A personalized ex-partner's name.
 */
export function getExName() {
    const gender = getUserGender();
    const femaleNames = ['María'];
    const maleNames = ['Carlos'];

    const names = gender === "SOY HOMBRE" ? femaleNames : maleNames;
    return names[Math.floor(Math.random() * names.length)];
}

/**
 * Returns a fixed avatar image URL for the ex-partner.
 * @returns {string} The URL of the ex-partner's avatar.
 */
export function getExAvatar() {
    // Fixed image URL as per previous discussions
    return "https://i.ibb.co/5hbjyZFJ/CASAL-JOSE.webp";
}

/**
 * Returns the fixed header name for the quiz.
 * @returns {string} The header name.
 */
export function getHeaderName() {
    return "José Plan"; // Fixed header name as per previous discussions
}

/**
 * Generates a personalized first message based on the user's current situation (question 7).
 * @returns {string} A personalized first message.
 */
export function getPersonalizedFirstMessage() {
    const currentSituation = getUserAnswer('question7');

    if (currentSituation.includes("contacto cero")) {
        return `Hola, encontré algo que es tuyo. ¿Cuándo puedes pasar a recogerlo?`;
    }
    if (currentSituation.includes("me ignora")) {
        return `Hola, no voy a molestarte más. Solo quería agradecerte por algo que me enseñaste.`;
    }
    if (currentSituation.includes("bloqueado")) {
        return `Hola, María me pidió preguntarte sobre el evento del viernes.`; // Using a generic name here, could be dynamic
    }
    if (currentSituation.includes("cosas necesarias")) {
        return `Hola, vi esta foto nuestra del viaje a la playa y me hizo sonreír. Espero que estés bien.`;
    }
    if (currentSituation.includes("charlamos")) {
        return `Hola, tengo que contarte algo curioso que me pasó que te va a hacer reír. ¿Tienes 5 minutos para una llamada?`;
    }
    if (currentSituation.includes("amigos")) {
        return `Hola, me acordé de algo que me dijiste el otro día y me hizo pensar. ¿Cómo estás?`;
    }
    if (currentSituation.includes("Encuentros íntimos")) {
        return `Hola, anoche fue increíble. ¿Te gustaría repetirlo pronto?`;
    }

    return `Hola, vi algo que me recordó a cuando fuimos al parque. Me alegró el día. Espero que estés bien.`;
}

/**
 * Generates a personalized response from the ex-partner based on the user's current situation (question 7).
 * @returns {string} A personalized ex-partner's response.
 */
export function getPersonalizedExResponse() {
    const currentSituation = getUserAnswer('question7');

    if (currentSituation.includes("contacto cero")) {
        return "¿Qué cosa? No recuerdo haber dejado nada...";
    }
    if (currentSituation.includes("me ignora")) {
        return "¿Qué me enseñaste? Me tienes curiosa...";
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
    if (currentSituation.includes("amigos")) {
        return "Bien, ¿y tú? ¿Qué te hizo pensar?";
    }
    if (currentSituation.includes("Encuentros íntimos")) {
        return "Sí, me encantaría. ¿Cuándo estás libre?";
    }

    return "Gracias por acordarte de mí. ¿Cómo has estado?";
}

/**
 * Returns a generic follow-up message.
 * @returns {string} The follow-up message.
 */
export function getPersonalizedFollowUp() {
    return "Me alegra que respondas. ¿Te parece si hablamos mejor mañana? Tengo algunas cosas que hacer ahora.";
}

/**
 * Generates a personalized first insight/error message based on quiz answers.
 * @returns {string} A personalized insight message.
 */
export function getPersonalizedFirstInsight() {
    const currentSituation = getUserAnswer('question7');
    const timeApart = getUserAnswer('question3'); // Not directly used in return, but good to have for context
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
    if (whoEnded.includes("terminó conmigo") || whoEnded.includes("Él terminó conmigo")) {
        return "❌ ERROR DETECTADO: Después de que TE DEJARAN, tu estrategia actual está creando más RESISTENCIA. El 84% cometen este error psicológico.";
    }

    return "❌ ERROR DETECTADO: Tu estrategia actual está generando el EFECTO CONTRARIO al que buscas. Hay un patrón específico que debes romper.";
}

/**
 * Generates a personalized technique based on quiz answers.
 * @returns {string} A personalized technique description.
 */
export function getPersonalizedTechnique() {
    const currentSituation = getUserAnswer('question7');
    const timeApart = getUserAnswer('question3');
    const gender = getUserGender();
    const pronoun = gender === "SOY HOMBRE" ? "ella" : "él";

    if (currentSituation.includes("contacto cero")) {
        return `🎯 TU TÉCNICA: "RUPTURA DEL SILENCIO MAGNÉTICO"
        
Tu situación: Contacto cero + ${timeApart}

PASO 1: Envía exactamente este mensaje en 48h:
"Hey ${getExName()}, encontré algo que te pertenece. ¿Cuándo puedes pasar a recogerlo?"

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
    if (currentSituation.includes("bloqueado")) {
        return `🎯 TU TÉCNICA: "ACCESO INDIRECTO ESTRATÉGICO"
        
Tu situación: Bloqueado + ${timeApart} separados

PASO 1: Usa un contacto en común (amigo o familiar) para enviar un mensaje indirecto sobre algo neutral.
PASO 2: El mensaje debe generar una pregunta o curiosidad en ${pronoun} sobre ti, sin mencionarte directamente.
PASO 3: Espera a que ${pronoun} inicie el contacto.

¿Por qué funciona? Evita la confrontación directa y activa la curiosidad, haciendo que ${pronoun} rompa el bloqueo por iniciativa propia.`;
    }
    if (currentSituation.includes("cosas necesarias")) {
        return `🎯 TU TÉCNICA: "ESCALADA EMOCIONAL SUTIL"
        
Tu situación: Solo temas necesarios + ${timeApart} separados

PASO 1: En el próximo contacto por "necesidad", añade una frase corta y positiva sobre un recuerdo compartido.
"Por cierto, vi [lugar/canción] y me acordé de [momento divertido]. Espero que todo bien."
PASO 2: No esperes respuesta sobre el recuerdo. Si responde, mantén la conversación breve y positiva.
PASO 3: Repite esto en futuros contactos, aumentando sutilmente la carga emocional positiva.

¿Por qué funciona? Transforma el contacto funcional en emocional, reavivando la conexión sin parecer desesperado.`;
    }
    if (currentSituation.includes("charlamos")) {
        return `🎯 TU TÉCNICA: "DIFERENCIACIÓN DE VALOR"
        
Tu situación: Charlamos a veces + ${timeApart} separados

PASO 1: Durante la próxima conversación, introduce un tema nuevo y apasionante en tu vida (hobby, proyecto, viaje).
PASO 2: Muestra entusiasmo genuino y deja que ${pronoun} perciba tu crecimiento personal.
PASO 3: Finaliza la conversación de forma positiva, dejando a ${pronoun} con ganas de saber más.

¿Por qué funciona? Rompe el patrón de "amigos" y te posiciona como una persona interesante y con valor propio, generando intriga.`;
    }
    if (currentSituation.includes("amigos")) {
        return `🎯 TU TÉCNICA: "RUPTURA DE PATRÓN AMISTOSO"
        
Tu situación: Somos 'amigos' + ${timeApart} separados

PASO 1: En la próxima interacción, haz un comentario que sugiera una conexión más profunda o un recuerdo íntimo, pero de forma casual.
"Me acordé de [momento íntimo] y sonreí. Esas cosas solo pasan contigo."
PASO 2: Observa su reacción. Si hay incomodidad, retrocede. Si hay intriga, mantén la distancia por un tiempo.
PASO 3: Reduce la frecuencia de contacto "amistoso" para crear un vacío.

¿Por qué funciona? Desafía la zona de confort de la amistad, forzando a ${pronoun} a reevaluar la naturaleza de su relación contigo.`;
    }
    if (currentSituation.includes("Encuentros íntimos")) {
        return `🎯 TU TÉCNICA: "DEFINICIÓN DE RELACIÓN CLARA"
        
Tu situación: Encuentros íntimos + ${timeApart} separados

PASO 1: En el próximo encuentro, después de un momento íntimo, inicia una conversación honesta sobre lo que ambos buscan.
"Me encanta pasar tiempo contigo así, pero necesito entender qué estamos construyendo."
PASO 2: Expresa tus deseos y escucha los de ${pronoun} sin presionar.
PASO 3: Si no hay alineación, establece límites claros o considera alejarte para que ${pronoun} sienta tu ausencia.

¿Por qué funciona? Transforma la ambigüedad en claridad, forzando una decisión y mostrando que valoras tu tiempo y emociones.`;
    }

    return `🎯 TU TÉCNICA: "REACTIVACIÓN EMOCIONAL"
        
Para tu situación específica: ${currentSituation}

MENSAJE ESPECÍFICO:
"Vi [algo específico] y recordé cuando [memoria positiva compartida]. Espero que estés bien."

Envía solo esto. No esperes respuesta inmediata.

¿Por qué funciona? Reactiva conexión emocional sin presión ni demandas.`;
}

/**
 * Personalizes content (string or object) based on the user's gender.
 * If content is an object with 'SOY_HOMBRE' and 'SOY_MUJER' keys, it returns the appropriate value.
 * @param {string|object} content - The content to personalize.
 * @param {string} gender - The user's gender ('SOY HOMBRE' or 'SOY MUJER').
 * @returns {string|object} The personalized content.
 */
export function getPersonalizedContent(content, gender) {
    if (typeof content === "string") {
        return content;
    }

    if (typeof content === "object" && content !== null) {
        if (content.SOY_HOMBRE && content.SOY_MUJER) {
            return gender === "SOY HOMBRE" ? content.SOY_HOMBRE : content.SOY_MUJER;
        }
        // Fallback for older versions if any
        if (content.masculino && content.feminino) {
            return gender === "SOY HOMBRE" ? content.masculino : content.feminino;
        }
        return content; // Return original object if no gender-specific keys match
    }

    return content;
}

// 2. Arrays exportados

export const quizSteps = [
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
        question: "🔮 ESTO ES LO QUE ELLA REALMENTE SENTIRÍA SI LE ESCRIBES HOY",
        description: "Basándome en tu situación exacta y en 12,000 casos reales, aquí está la conversación que probablemente sucedería. No es una predicción genérica - es específica para ti.",
        subtext: "Lo que verás en los próximos segundos es lo más probable que suceda en la vida real:",
        options: [], // No options for this step, it's an animation
        elements: {
            whatsappSimulation: true,
            phoneSimulation: true,
            typingAnimation: true,
            personalizedChat: true,
            cinematicReveal: true,
            profileComplete: "100%",
            badge: "ANÁLISIS PREDICTIVO PERSONALIZADO"
            // ✅ REMOVIDO: customComponent: "PhoneSimulationStep"
        },
        note: "Esta demostración usa IA para predecir las respuestas más probables basándose en tu situación específica."
    },
    {
        id: 13,
        question: "🎯 TU PLAN A PERSONALIZADO ESTÁ LISTO",
        // ✅ CORRIGIDO: description agora é string, não função
        description: "Después de crear tu demostración específica, he confirmado que tu situación tiene **89% de probabilidad de éxito** usando el Plan A. Esta es la evaluación completa de tu caso específico basada en las 9 variables críticas analizadas.",
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

export const socialProofMessages = [
    "Estás entre el 17% más decidido a reconquistar",
    "Tu perfil muestra alta compatibilidad",
    "El 87% de personas en tu situación lograron resultados en menos de 14 días",
    "Estás más comprometido que el 73% que hizo esta prueba",
    "Solo 27 spots disponibles hoy para este método",
    "4,129 personas recuperaron sus relaciones este año"
];