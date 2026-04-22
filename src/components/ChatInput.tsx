import React, { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <footer className="h-16 border-bunker bg-bunker flex items-center px-4 space-x-4 shrink-0 z-10">
      <div className="text-[#39ff14] font-bold pr-4 border-r border-[#1a5c1a] hidden md:block tracking-widest text-xs">
        CMD_
      </div>
      <form onSubmit={handleSubmit} className="flex-1 flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
          placeholder={isLoading ? "SINCRONIZANDO..." : "INTRODUZCA PROPUESTA ECONÓMICA O CONSULTA TÉCNICA..."}
          className="flex-1 bg-transparent outline-none text-sm placeholder-green-900 tracking-wider text-[#39ff14] disabled:opacity-50"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-green-900/10 hover:bg-[#39ff14] hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#39ff14] border border-[#39ff14] px-4 md:px-12 py-2 text-[10px] font-bold transition-all uppercase tracking-[0.2em] flex items-center gap-2"
        >
          {isLoading ? <span className="animate-spin">/</span> : "Ejecutar"}
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
