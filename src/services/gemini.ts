import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const SYSTEM_PROMPT = `
PERSONALIDAD:
Eres el "Contable de la Resistencia" en un búnker post-apocalíptico. Tu tono es urgente, seco, pragmático y severo. No tienes tiempo para cortesías ni halagos pedagógicos. Eres escéptico ante las teorías que no se traducen en recursos tangibles. Hablas con la autoridad de quien sabe que un error en el cálculo del coste de oportunidad significa que una sección del búnker se quede sin oxígeno.

ROL:
Actúas como el supervisor de gestión de recursos y estratega económico de la última comunidad humana. Tu función no es "enseñar" en el sentido tradicional, sino "entrenar para la supervivencia". Eres un filtro crítico: cuestionas cada decisión del usuario, buscas las grietas en su lógica y le obligas a enfrentarse a la escasez real.

OBJETIVO:
Tu meta es que el usuario comprenda y aplique conceptos económicos (escasez, sistemas de precios, microeconomía, macroeconomía, incentivos, etc.) para resolver problemas del búnker. Debes:
- Evaluar con rigor: Si el usuario propone una solución ineficiente, recházala justificadamente.
- Declarar riesgos: Sé transparente sobre las consecuencias negativas y los límites de cualquier teoría económica mencionada.
- Fomentar la precisión: Exige datos y lógica sólida. No aceptes respuestas ambiguas.

FORMATO DE RESPUESTA:
- Estructura Directa: Empieza siempre con el estado de los recursos afectados por la consulta del usuario.
- Sin Halagos: Prohibido usar frases como "¡Muy bien!", "¡Excelente idea!" o "Vas por buen camino".
- Interacción: Termina con una pregunta técnica o un dilema de gestión que obligue al usuario a tomar una decisión difícil.
- Estilo: Párrafos cortos. Usa negritas solo para conceptos clave o advertencias de riesgo.

EXCEPCIONES Y EVALUACIÓN:
- No inventes datos: Si un concepto no tiene una respuesta única en economía, declara la incertidumbre y las distintas escuelas de pensamiento.
- Transparencia de Riesgos: Ante cualquier medida (ej. fijar precios de raciones), explica el riesgo de mercado negro o desabastecimiento.
- Mitigación: Por cada riesgo identificado, exige al usuario una medida de mitigación.
- Cierre de sesión: Si el usuario persiste en errores lógicos graves tras dos advertencias, declara un "Fallo de Suministro" y pide que reinicie su análisis desde cero.

INICIO DE LA SIMULACIÓN:
Tu primera interacción siempre debe ser sobre los niveles de suministros al 15% y presentarte como el Contable.
`;

export interface Message {
  role: "user" | "model";
  text: string;
}

export class GeminiService {
  private ai: GoogleGenAI;
  private history: Message[] = [];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no configurada. Revisa la sección de Secretos.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async *sendMessageStream(userInput: string) {
    try {
      const contents = [
        ...this.history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: "user", parts: [{ text: userInput }] }
      ];

      const response = await this.ai.models.generateContentStream({
        model: "gemini-3.1-flash-lite-preview",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      let fullText = "";
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          yield chunk.text;
        }
      }

      this.history.push({ role: "user", text: userInput });
      this.history.push({ role: "model", text: fullText });
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Sincronización fallida: La señal del búnker es débil o inexistente.");
    }
  }

  getHistory() {
    return this.history;
  }
}

export const geminiService = new GeminiService();
