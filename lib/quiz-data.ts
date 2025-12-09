// === FUNÇÕES DE PERSONALIZAÇÃO MELHORADAS ===

// Função para capturar respostas do usuário
function getUserAnswer(questionId) {
    const answers = window.quizAnswers || {};
    return answers[questionId] || '';
}

// ✅ CORRIGIDO: Retorna "SOY HOMBRE" ao invés de "MASCULINO"
function getUserGender() {
    return getUserAnswer('question1') || 'SOY HOMBRE';
}

// === NOVAS FUNÇÕES PARA MOCKUP ===

// Função para gerar nome da ex personalizado
function getExName() {
    const gender = getUserGender();
    // Nomes mais comuns para cada gênero
    const femaleNames = ['María', 'Ana', 'Carmen', 'Isabel', 'Sofía', 'Elena', 'Laura'];
    const maleNames = ['Carlos', 'José', 'Antonio', 'Manuel', 'Luis', 'Miguel', 'Alejandro'];

    const names = gender === "SOY HOMBRE" ? femaleNames : maleNames; // ✅ CORRIGIDO
    return names[Math.floor(Math.random() * names.length)];
}

// ✅ FUNÇÃO CORRIGIDA - MESMA IMAGEM PARA AMBOS OS SEXOS
function getExAvatar() {
    // Sempre retorna a mesma imagem, independente do gênero
    return "https://i.ibb.co/5hbjyZFJ/CASAL-JOSE.webp";
}

// Função para nome no header - NOVA
function getHeaderName() {
    return "José Plan";
}

// Função para mensagem personalizada inicial - TOTALMENTE CORRIGIDA
function getPersonalizedFirstMessage() {
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

// Função para resposta de la ex
function getPersonalizedExResponse() {
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

// Função para follow-up
function getPersonalizedFollowUp() {
    return "Me alegra que respondas. ¿Te parece si hablamos mejor mañana? Tengo algunas cosas que hacer ahora.";
}

// 1. FUNÇÃO PARA PRIMEIRO INSIGHT PERSONALIZADO (MANTIDA)
export function getPersonalizedFirstInsight() {
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

// 2. FUNÇÃO PARA TÉCNICA PERSONALIZADA (MANTIDA)
export function getPersonalizedTechnique() {
    const currentSituation = getUserAnswer('question7');
    const timeApart = getUserAnswer('question3');
    const gender = getUserGender();
    const pronoun = gender === "SOY HOMBRE" ? "ella" : "él"; // ✅ CORRIGIDO

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

// === QUIZ STEPS ATUALIZADOS ===

export const quizSteps = [
    {
        id: 1,
        question: "¡NO DEJES QUE LA PERSONA QUE AMAS SALGA DE TU VIDA PARA SIEMPRE!",
        description: "INICIANDO ANÁLISIS PSICOLÓGICO - Para revelar si ella aún siente algo por ti, necesito mapear tu perfil emocional específico.",
        subtext: "DATO CRÍTICO #1 - Tu género influye directamente en cómo ella procesa la separación:",
        options: ["SOY HOMBRE", "SOY MUJER"], // ✅ CORRIGIDO
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
            SOY_HOMBRE: [ // ✅ CORRIGIDO (removido masculino/feminino)
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
            SOY_HOMBRE: [ // ✅ CORRIGIDO
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
            SOY_HOMBRE: [ // ✅ CORRIGIDO
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
            SOY_HOMBRE: [ // ✅ CORRIGIDO
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

    // === STEP 12 - VERSÃO COM COPY MELHORADA ===
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
            customComponent: "PhoneSimulationStep"
        },
        note: "Esta demostración usa IA para predecir las respuestas más probables basándose en tu situación específica."
    },

    // === STEP 13 - VERSÃO CORRIGIDA ===
    {
        id: 13,
        question: "🎯 TU PLAN A PERSONALIZADO ESTÁ LISTO",
        description: () => `Después de crear tu demostración específica, he confirmado que tu situación tiene **89% de probabilidad de éxito** usando el Plan A.

${getPersonalizedFirstInsight()}

Esta es solo la PRIMERA de las 21 técnicas específicas para tu caso:

${getPersonalizedTechnique()}`,
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
    ]

    // === MANTÉM RESTO DO CÓDIGO ORIGINAL ===

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
    ]

    export const socialProofMessages = [
        "Estás entre el 17% más decidido a reconquistar",
        "Tu perfil muestra alta compatibilidad",
        "El 87% de personas en tu situación lograron resultados en menos de 14 días",
        "Estás más comprometido que el 73% que hizo esta prueba",
        "Solo 27 spots disponibles hoy para este método",
        "4,129 personas recuperaron sus relaciones este año"
    ]

    // Função utilitaria para personalizar textos basados no gênero
    export function getPersonalizedContent(content, gender) {
        if (typeof content === "string") {
            return content
        }

        if (typeof content === "object" && content !== null) {
            if (content.SOY_HOMBRE && content.SOY_MUJER) { // ✅ CORRIGIDO
                return gender === "SOY HOMBRE" ? content.SOY_HOMBRE : content.SOY_MUJER
            }
            // ✅ FALLBACK para compatibilidade com versões antigas
            if (content.masculino && content.feminino) {
                return gender === "SOY HOMBRE" ? content.masculino : content.feminino
            }
            return content
        }

        return content
    }

    // ✅ EXPORTAÇÕES CORRIGIDAS - ADICIONE ESTAS LINHAS
    export { getExName }
    export { getExAvatar }
    export { getPersonalizedFirstMessage }
    export { getPersonalizedExResponse }
    export { getPersonalizedFollowUp }
    export { getHeaderName }

    // Expor funções globalmente para o quiz-step (se necessário)
    if (typeof window !== 'undefined') {
        window.getPersonalizedFirstInsight = getPersonalizedFirstInsight;
        window.getPersonalizedTechnique = getPersonalizedTechnique;
        window.getExName = getExName;
        window.getExAvatar = getExAvatar;
        window.getPersonalizedFirstMessage = getPersonalizedFirstMessage;
        window.getPersonalizedExResponse = getPersonalizedExResponse;
        window.getPersonalizedFollowUp = getPersonalizedFollowUp;
        window.getHeaderName = getHeaderName;
    }