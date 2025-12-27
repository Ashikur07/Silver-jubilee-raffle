"use client";
import { useState, useEffect } from "react";
import { Sparkles, Trophy, Star } from "lucide-react";

// --- Components ---

// 1. The Fortune Wheel (Mobile: 340px Fixed | Desktop: Reduced to 420px)
const FortuneWheel = ({ isSpinning, winningNumber }) => {
  const [rotation, setRotation] = useState(0);

  const segments = [
    { label: "0-1K", color: "#ef4444" },   // Red
    { label: "1K-2K", color: "#f97316" },  // Orange
    { label: "2K-3K", color: "#f59e0b" },  // Amber
    { label: "3K-4K", color: "#eab308" },  // Yellow
    { label: "4K-5K", color: "#84cc16" },  // Lime
    { label: "5K-6K", color: "#10b981" },  // Emerald
    { label: "6K-7K", color: "#06b6d4" },  // Cyan
    { label: "7K-8K", color: "#3b82f6" },  // Blue
    { label: "8K-9K", color: "#8b5cf6" },  // Violet
    { label: "9K-10K", color: "#d946ef" }, // Fuchsia
  ];

  useEffect(() => {
    if (isSpinning) {
       // CSS rotation
    } else if (winningNumber) {
        let index = Math.floor((winningNumber - 1) / 1000);
        if (index < 0) index = 0;
        if (index > 9) index = 9;

        const segmentAngle = 36; 
        const targetRotation = 360 - (index * segmentAngle) - (segmentAngle / 2); 
        const totalRotation = 3600 + targetRotation; 
        setRotation(totalRotation);
    }
  }, [isSpinning, winningNumber]);

  return (
    <div className="relative flex flex-col items-center">
      
      {/* 1. WINNER Header + Arrow */}
      <div className="mb-[-20px] relative z-20 animate-bounce">
         <div className="bg-red-600 border-4 border-red-800 text-white font-black text-xl px-8 py-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase tracking-widest transform -skew-x-12">
            WINNER
         </div>
         <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 absolute left-1/2 transform -translate-x-1/2 -bottom-6 filter drop-shadow-xl"></div>
      </div>

      {/* 2. The Wheel */}
      <div className="relative flex items-center justify-center mt-6">
        <div 
            // SIZE LOGIC: 
            // Mobile: w-[340px] (Same as before - Perfect)
            // Desktop: w-[420px] (Reduced from 480px/500px)
            className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border-[10px] md:border-[12px] border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.4)] overflow-hidden relative transition-transform cubic-bezier(0.1, 0.7, 0.1, 1)"
            style={{ 
                transform: isSpinning ? `rotate(${rotation + 5000}deg)` : `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? "40s" : "6s",
            }}
        >
            {/* Segments */}
            {segments.map((seg, i) => (
                <div 
                    key={i}
                    className="absolute top-0 left-0 w-full h-full origin-center"
                    style={{
                        transform: `rotate(${i * 36}deg)`,
                    }}
                >
                    {/* Color Slice */}
                    <div 
                        className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left border-l border-white/20"
                        style={{
                            transform: `rotate(0deg) skewY(-54deg)`, 
                            background: seg.color,
                        }}
                    ></div>
                    
                    {/* Text Label */}
                    <div 
                        className="absolute top-0 left-0 w-full h-1/2 flex justify-center origin-bottom"
                        style={{
                            transform: `rotate(18deg)`, 
                        }}
                    >
                        <div 
                           // Padding: Mobile pt-8 (Same), Desktop pt-10 (Reduced slightly)
                           className="h-full flex items-start pt-8 md:pt-10"
                           style={{ transformOrigin: "bottom center" }}
                        >
                            <span 
                              // Text Size: Mobile text-lg (Same), Desktop text-xl (Reduced)
                              className="text-white font-black text-lg md:text-xl drop-shadow-md whitespace-nowrap block"
                              style={{
                                 transform: `rotate(-90deg)`,
                              }}
                            >
                                {seg.label}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-[6px] border-gray-200 z-10">
                <Star className="text-yellow-500 w-10 h-10 md:w-12 md:h-12 fill-yellow-500 animate-pulse" />
            </div>
        </div>
      </div>
    </div>
  );
};

// 2. Winning Card (Size Adjusted for Desktop Balance)
const WinningTicketCard = ({ number, prize }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    return (
        <div className={`relative z-50 transform transition-all duration-1000 ease-out 
            ${visible ? "scale-100 rotate-0 opacity-100 translate-y-0" : "scale-0 rotate-[720deg] opacity-0 translate-y-96"}
        `}>
            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-50 animate-pulse"></div>
            <div className="w-[340px] md:w-[500px] h-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl border-4 border-yellow-400 p-2 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 md:p-8 flex flex-col items-center justify-center border border-white/10">
                    <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 mb-4 md:mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
                    <h3 className="text-gray-300 text-sm md:text-lg uppercase tracking-[0.4em] mb-2 font-bold">Winner For</h3>
                    <h2 className="text-2xl md:text-5xl text-white font-black mb-6 md:mb-8 text-center uppercase">{prize || "Grand Prize"}</h2>
                    
                    <div className="bg-white/10 px-8 md:px-12 py-4 md:py-6 rounded-2xl border-2 border-yellow-500/50 relative shadow-inner">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] md:text-sm font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">Lucky Ticket</span>
                        <span className="text-5xl md:text-8xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-600 drop-shadow-lg">
                            {number}
                        </span>
                    </div>
                    
                    <div className="mt-6 md:mt-8 flex items-center gap-3 text-yellow-500/80 text-[10px] md:text-sm font-semibold uppercase tracking-widest">
                        <Sparkles size={18} /> Silver Jubilee 2025 <Sparkles size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---
export default function LiveDraw() {
  const [status, setStatus] = useState({ isSpinning: false, lastWinner: null, currentPrize: "" });
  const [showWinner, setShowWinner] = useState(false);

  // Polling Logic
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/draw/status");
      const data = await res.json();
      
      if (data.isSpinning && !status.isSpinning) {
          setShowWinner(false);
      }
      if (!data.isSpinning && status.isSpinning && data.lastWinner) {
          setTimeout(() => setShowWinner(true), 6500); 
      }
      setStatus(data);
    }, 1000);
    return () => clearInterval(interval);
  }, [status.isSpinning]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e3a8a_0%,#020617_80%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      {/* Confetti */}
      {showWinner && (
         <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-60 animate-pulse z-50"></div>
      )}

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center relative w-full scale-95 md:scale-100">
        
        {/* Header Text */}
        <div className={`transition-all duration-500 mb-6 text-center ${showWinner ? "opacity-0 translate-y-[-50px] hidden" : "opacity-100"}`}>
            <h2 className="text-yellow-500 font-bold tracking-[0.4em] uppercase mb-2 animate-pulse text-xs md:text-sm">
                {status.isSpinning ? "Spinning..." : "Ready to Draw"}
            </h2>
            <h1 className="text-3xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {status.currentPrize || "Grand Prize"}
            </h1>
        </div>

        {/* The Stage Area */}
        <div className="relative flex items-center justify-center h-[480px] md:h-[500px] w-full">
            
            {/* The Wheel */}
            <div className={`transition-all duration-1000 transform ${showWinner ? "scale-0 opacity-0 blur-2xl" : "scale-100 opacity-100"}`}>
                <FortuneWheel isSpinning={status.isSpinning} winningNumber={status.lastWinner} />
            </div>

            {/* The Winner Card */}
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                {showWinner && status.lastWinner && (
                    <div className="pointer-events-auto">
                        <WinningTicketCard number={status.lastWinner} prize={status.currentPrize} />
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}