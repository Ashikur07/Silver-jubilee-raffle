"use client";
import { useState, useEffect } from "react";
import { Sparkles, Trophy } from "lucide-react";

export default function WinningCard({ number, prize }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className={`relative z-50 transform transition-all duration-1000 ease-out 
      ${visible ? "scale-100 rotate-0 opacity-100 translate-y-0" : "scale-0 rotate-[720deg] opacity-0 translate-y-96"}
    `}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-40 animate-pulse"></div>
      
      {/* Main Card Container */}
      <div className="w-[340px] md:w-[500px] h-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl border-4 border-yellow-400 p-2 shadow-2xl relative overflow-hidden">
        
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        {/* Inner Content */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 md:p-8 flex flex-col items-center justify-center border border-white/10">
          
          {/* Trophy Icon */}
          <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 mb-4 md:mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
          
          {/* "Winner For" */}
          <h3 className="text-gray-200 text-sm md:text-lg uppercase tracking-[0.5em] mb-2 font-bold drop-shadow-md">Winner For</h3>
          
          {/* Prize Name */}
          <h2 className="text-2xl md:text-5xl text-yellow-400 font-black mb-6 md:mb-8 text-center uppercase drop-shadow-lg">{prize || "Prize"}</h2>
          
          {/* Lucky Ticket Box (সাদা বক্স এবং কালো নম্বর) */}
          <div className="bg-white px-8 md:px-12 py-4 md:py-6 rounded-2xl border-2 border-yellow-500 relative shadow-inner w-full">
            
            {/* Badge */}
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] md:text-sm font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg border border-white/20">
              Lucky Ticket
            </span>
            
            {/* The Number */}
            <span className="block text-center font-mono text-6xl md:text-8xl font-black text-slate-900 drop-shadow-sm">
              {number}
            </span>
          </div>
          
          {/* Footer */}
          <div className="mt-6 md:mt-8 flex items-center gap-3 text-yellow-500/80 text-[10px] md:text-sm font-semibold uppercase tracking-widest">
            <Sparkles size={18} /> Silver Jubilee 2025 <Sparkles size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}