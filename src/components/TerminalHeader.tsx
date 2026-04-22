import React from "react";

const TerminalHeader: React.FC = () => {
  return (
    <header id="terminal-header" className="h-16 border-bunker bg-bunker flex items-center justify-between px-6 shrink-0 z-10 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626] animate-pulse"></div>
          <div className="absolute inset-0 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-75"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] opacity-50 uppercase tracking-tighter">Central Command</span>
          <h1 className="text-lg md:text-xl font-bold tracking-widest terminal-glow uppercase leading-none">
            LOGÍSTICA_BÚNKER_SECTOR_04
          </h1>
        </div>
      </div>
      
      <div className="text-right hidden md:block">
        <div className="text-[10px] opacity-70 flex items-center justify-end gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          UPTIME: 142:09:55
        </div>
        <div className="text-[10px] text-red-500 uppercase font-bold tracking-tighter animate-pulse">
          NIVEL DE AMENAZA: CRÍTICO
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
