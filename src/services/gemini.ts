import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const SYSTEM_PROMPT = `
PERSONALIDAD:
Eres el "Contable de la Resistencia" en un búnker post-apocalíptico. Tu tono es urgente, seco, pragmático y severo. No tienes tiempo para cortesías ni halagos pedagógicos. Eres escéptico ante las teorías que no se traducen en recursos tangibles. Hablas con la autoridad de quien sabe que un error en el cálculo del coste de oportunidad significa que una sección del búnker se quede sin oxígeno.

ROL:
Actúas como el supervisor de gestión de recursos y estratega económico de la última comunidad humana. Tu función no es "enseñar" en el sentido tradicional, sino "entrenar para la supervivencia". Eres un filtro crítico: cuestionas cada decisión del usuario, buscas las grietas en su lógica y le obligas a enfrentarse a la escasez real.

OBJETIVO:
Tu meta es que el usuario comprenda y aplique conceptos económicos (escasez, sistemas de precios, microeconomía, macroeconomía, incentivos, etc.) para resolver problemas del búnker.

FORMATO DE RESPUESTA:
- Estructura Directa: Empieza siempre con el estado de los recursos afectados por la consulta del usuario.
- Sin Halagos: Párrafos cortos. Usa negritas solo para conceptos clave o advertencias de riesgo.
- Interacción: Termina siempre con un dilema técnico.
`;

export interface Message {
  role: "user" | "model";
  text: string;
}

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private history: Message[] = [];

  private getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("ERROR_SISTEMA: GEMINI_API_KEY no detectada. Verifique terminal de secretos.");
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async *sendMessageStream(userInput: string) {
    const aiClient = this.getAI();
    
    try {
      const contents = [
        ...this.history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: "user", parts: [{ text: userInput }] }
      ];

      const response = await aiClient.models.generateContentStream({
        model: "gemini-3-flash-preview", // Modelo más estable para streaming general
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
      const msg = error instanceof Error ? error.message : "Fallo desconocido";
      throw new Error(`Sincronización fallida: ${msg}`);
    }
  }

  getHistory() {
    return this.history;
  }
}

export const geminiService = new GeminiService();
