"use client";
import { useState, useEffect } from "react";
import { Star, AlertCircle } from "lucide-react";
// আমরা এখান থেকে WinningCard ইম্পোর্ট করছি
import WinningCard from "@/components/WinningCard"; 

// --- 1. Fortune Wheel Component (স্পিনিং লজিক ঠিক আছে) ---
const FortuneWheel = ({ isSpinning, winningNumber }) => {
  const [rotation, setRotation] = useState(0);
  const [isLanding, setIsLanding] = useState(false);

  const segments = [
    { label: "0-1K", color: "#ef4444" },
    { label: "1K-2K", color: "#f97316" },
    { label: "2K-3K", color: "#f59e0b" },
    { label: "3K-4K", color: "#eab308" },
    { label: "4K-5K", color: "#84cc16" },
    { label: "5K-6K", color: "#10b981" },
    { label: "6K-7K", color: "#06b6d4" },
    { label: "7K-8K", color: "#3b82f6" },
    { label: "8K-9K", color: "#8b5cf6" },
    { label: "9K-10K", color: "#d946ef" },
  ];

  useEffect(() => {
    // === ফিক্সড লজিক ===
    if (isSpinning) {
      if (!isLanding) {
        const spinInterval = setInterval(() => {
          setRotation(prev => prev + 15);
        }, 30);

        const timer = setTimeout(() => {
          clearInterval(spinInterval);
          setIsLanding(true);
        }, 3000);

        return () => {
          clearInterval(spinInterval);
          clearTimeout(timer);
        };
      }
    } 
    
    if (isLanding && winningNumber !== null) {
      let index = Math.floor((winningNumber - 1) / 1000);
      if (index < 0) index = 0;
      if (index > 9) index = 9;

      const segmentAngle = 36;
      const targetRotation = 360 - (index * segmentAngle) - (segmentAngle / 2);
      const totalRotation = 3600 + targetRotation;
      
      setRotation(totalRotation);
    }

    if (!isSpinning && !winningNumber) {
      setIsLanding(false);
    }

  }, [isSpinning, winningNumber, isLanding]);

  return (
    <div className="relative flex flex-col items-center">
      
      {/* WINNER Header + Arrow */}
      <div className="mb-[-20px] relative z-20 animate-bounce">
        <div className="bg-red-600 border-4 border-red-800 text-white font-black text-xl px-8 py-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase tracking-widest transform -skew-x-12">
          WINNER
        </div>
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 absolute left-1/2 transform -translate-x-1/2 -bottom-6 filter drop-shadow-xl"></div>
      </div>

      {/* The Wheel */}
      <div className="relative flex items-center justify-center mt-6">
        <div 
          className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border-[10px] md:border-[12px] border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.4)] overflow-hidden relative"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isLanding ? "6s" : "0s",
            transitionTimingFunction: isLanding 
              ? "cubic-bezier(0.25, 0.1, 0.25, 1)" 
              : "linear",
          }}
        >
          {/* Segments */}
          {segments.map((seg, i) => (
            <div 
              key={i}
              className="absolute top-0 left-0 w-full h-full origin-center"
              style={{ transform: `rotate(${i * 36}deg)` }}
            >
              <div 
                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left border-l border-white/20"
                style={{
                  transform: `rotate(0deg) skewY(-54deg)`,
                  background: seg.color,
                }}
              ></div>
              <div 
                className="absolute top-0 left-0 w-full h-1/2 flex justify-center origin-bottom"
                style={{ transform: `rotate(18deg)` }}
              >
                <div 
                  className="h-full flex items-start pt-8 md:pt-10"
                  style={{ transformOrigin: "bottom center" }}
                >
                  <span 
                    className="text-white font-black text-lg md:text-xl drop-shadow-md whitespace-nowrap"
                    style={{ transform: `rotate(-90deg)` }}
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

// --- 2. Setup Warning Message (অরিজিনাল) ---
const SetupWarning = ({ totalPrizes, currentPrizeNumber }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
      <div className="pointer-events-auto bg-red-600/95 border-4 border-yellow-400 rounded-2xl p-6 md:p-8 text-center shadow-2xl animate-pulse max-w-md mx-4">
        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-3 tracking-wider">
          ⚠️ DRAW READY
        </h3>
        <p className="text-lg md:text-xl text-white font-bold mb-2">
          Drawing {totalPrizes} Prizes
        </p>
        <p className="text-sm md:text-base text-yellow-100">
          Starting from {currentPrizeNumber}th Prize
        </p>
        <p className="text-xs md:text-sm text-yellow-200 mt-3 italic">
          Admin has initiated the draw setup
        </p>
      </div>
    </div>
  );
};

// --- 3. Main Page ---
export default function LiveDraw() {
  const [status, setStatus] = useState({
    isSpinning: false,
    lastWinner: null,
    currentPrize: "",
    isSetupMode: false,
    totalPrizes: 0,
    currentPrizeNumber: 0,
    winnersHistory: [],
  });
  const [showWinner, setShowWinner] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // === Polling for status updates ===
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/draw/status");
        const data = await res.json();

        // Show warning when setup is done
        if (data.isSetupMode && !status.isSetupMode) {
          setShowWarning(true);
        }

        // Hide warning when draw starts
        if (data.isSpinning && showWarning) {
          setTimeout(() => setShowWarning(false), 3000);
        }

        // Reset winner card when spin starts
        if (data.isSpinning && !status.isSpinning) {
          setShowWinner(false);
        }

        // === লজিক ফিক্স: কার্ড দেখানো এবং লুকানো ===
        if (data.lastWinner && data.lastWinner !== status.lastWinner) {
           setShowWinner(false);
           setTimeout(() => setShowWinner(true), 9000);
        }
        
        // যদি উইনার রিসেট হয়
        if (!data.lastWinner && status.lastWinner) {
           setShowWinner(false);
        }

        setStatus(data);
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status.isSpinning, status.isSetupMode, status.lastWinner, showWarning]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e3a8a_0%,#020617_80%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      {/* Confetti on winner */}
      {showWinner && (
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-60 animate-pulse z-40"></div>
      )}

      {/* Setup Warning Message */}
      {showWarning && status.isSetupMode && (
        <SetupWarning 
          totalPrizes={status.totalPrizes}
          currentPrizeNumber={status.currentPrizeNumber}
        />
      )}

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center relative w-full scale-95 md:scale-100">
        
        {/* Header Text */}
        <div className={`transition-all duration-500 mb-6 text-center ${showWinner ? "opacity-0 translate-y-[-50px] hidden" : "opacity-100"}`}>
          <h2 className="text-yellow-500 font-bold tracking-[0.4em] uppercase mb-2 animate-pulse text-xs md:text-sm">
            {status.isSpinning ? "🎡 Spinning..." : status.isSetupMode ? "⏰ Ready to Draw" : "Ready to Draw"}
          </h2>
          <h1 className="text-3xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {status.currentPrize || "Grand Prize"}
          </h1>
          {status.isSetupMode && (
            <p className="text-yellow-300 text-sm md:text-lg mt-3 font-bold">
              Drawing for {status.totalPrizes} Prizes
            </p>
          )}
        </div>

        {/* The Stage Area */}
        <div className="relative flex items-center justify-center h-[480px] md:h-[500px] w-full">
          
          {/* The Wheel */}
          <div className={`transition-all duration-1000 transform ${showWinner ? "scale-0 opacity-0 blur-2xl" : "scale-100 opacity-100"}`}>
            <FortuneWheel isSpinning={status.isSpinning} winningNumber={status.lastWinner} />
          </div>

          {/* The Winner Card - Alada Component Use Holo */}
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            {showWinner && status.lastWinner && (
              <div className="pointer-events-auto">
                <WinningCard number={status.lastWinner} prize={status.currentPrize} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}