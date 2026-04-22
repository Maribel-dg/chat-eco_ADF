import React, { useState, useEffect, useRef } from "react";
import TerminalHeader from "./components/TerminalHeader";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import { geminiService, Message } from "./services/gemini";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Informe de situación: Los niveles de suministros están al 15%. Soy el Contable. Si vas a proponer una estrategia económica para la gestión de raciones, asegúrate de que sea sólida. Aquí no hay margen para el error teórico. ¿Qué concepto quieres aplicar para evitar el colapso?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Placeholder for the incoming bot message
    const botMessagePlaceholder: Message = { role: "model", text: "" };
    setMessages((prev) => [...prev, botMessagePlaceholder]);

    try {
      let streamingText = "";
      const stream = geminiService.sendMessageStream(text);
      
      for await (const chunk of stream) {
        streamingText += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: "model", 
            text: streamingText 
          };
          return newMessages;
        });
      }
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: "model", 
          text: `ADVERTENCIA: ${error instanceof Error ? error.message : "Error desconocido en el enlace de datos."}` 
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="terminal-root" className="h-screen w-screen flex flex-col p-4 space-y-4 bg-[#050505] relative overflow-hidden">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      
      <TerminalHeader />

      <main className="flex-1 flex space-x-4 min-h-0 z-10">
        {/* Sidebar Status */}
        <aside className="w-64 hidden xl:flex flex-col space-y-4 shrink-0">
          <div className="flex-1 border-bunker bg-[#0d110d] p-4 flex flex-col space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-green-900">
                <span>Suministros</span><span>15%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: "15%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-green-900">
                <span>Oxígeno</span><span>84%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: "84%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-green-900">
                <span>Energía Geotérmica</span><span>42%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: "42%" }}></div>
              </div>
            </div>

            <div className="pt-8 border-t border-green-900/30">
              <div className="text-[10px] text-green-900 mb-2 font-bold uppercase">RECURSOS_EN_RIESGO</div>
              <ul className="text-[11px] space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 font-bold">!</span> <span>Agua Potable</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-yellow-500 font-bold">-</span> <span>Medicamentos Fase I</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 font-bold">+</span> <span>Chatarra Procesada</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-24 border-bunker bg-black p-3 text-[9px] flex flex-col justify-center gap-1">
            <div className="text-green-900 italic tracking-tight uppercase">SISTEMA: PROTOCOLO P.R.O.F.E. v2.0.4</div>
            <div className="text-green-900 italic tracking-tight uppercase">Encripción: AES-256-VCL</div>
            <div className="text-green-900 italic tracking-tight uppercase">Despliegue: Edge Node 7</div>
          </div>
        </aside>

        {/* Chat Section */}
        <div className="flex-1 border-bunker bg-[#0d110d] flex flex-col min-w-0 relative">
          <div className="absolute top-2 right-4 text-[9px] text-green-900 uppercase font-bold z-10 tracking-widest">
            LOGS_SESSION_LIVE
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide z-10"
          >
            {messages.map((msg, idx) => (
              <ChatBubble 
                key={idx} 
                role={msg.role} 
                sender={msg.role === "model" ? "CONTABLE_DE_LA_RESISTENCIA" : "OPERADOR_BUNKER"} 
                text={msg.text} 
              />
            ))}
            
            {loading && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto mb-6">
                <div className="text-[10px] text-[#39ff14]/70 font-bold mb-1 uppercase tracking-wider">
                  [SISTEMA] CONTABLE_DE_LA_RESISTENCIA
                </div>
                <div className="h-10 flex items-center space-x-2 italic text-[#39ff14]/50 text-xs">
                  <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse"></div>
                  <span className="typing-blink">Sincronizando señales del búnker</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} isLoading={loading} />
    </div>
  );
}
