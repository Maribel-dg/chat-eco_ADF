import { motion } from "motion/react";
import React from "react";

interface ChatBubbleProps {
  sender: string;
  text: string;
  role: "user" | "model";
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ sender, text, role }) => {
  const isBot = role === "model";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${!isBot ? 'items-end' : 'items-start'} max-w-full md:max-w-[85%] ${!isBot ? 'ml-auto' : 'mr-auto'} mb-6 group`}
    >
      <div className={`text-[10px] mb-1 uppercase font-bold tracking-widest ${!isBot ? 'text-gray-500' : 'text-[#39ff14]'}`}>
        [{!isBot ? 'OPERADOR' : 'SISTEMA'}] {sender}
      </div>
      <div 
        className={`p-4 transition-all duration-300 relative ${
          !isBot 
            ? 'message-user' 
            : 'message-bot'
        }`}
      >
        <div className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap ${!isBot ? 'text-gray-300' : 'text-[#39ff14]'}`}>
          {text}
        </div>
        
        {/* Subtle decorative glow for bot messages */}
        {isBot && <div className="absolute inset-0 bg-[#39ff14]/5 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
