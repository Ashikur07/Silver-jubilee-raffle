"use client";
import React, { useEffect, useState, useRef } from "react";

export default function FortuneWheel({ startSpin, winnerData, onFinish }) {
  const [rotation, setRotation] = useState(0);
  const [transition, setTransition] = useState("none");
  const [showWinnerCard, setShowWinnerCard] = useState(false);

  useEffect(() => {
    if (startSpin && winnerData) {
      handleSpinSequence();
    }
  }, [startSpin, winnerData]);

  const handleSpinSequence = () => {
    // 1. Reset
    setShowWinnerCard(false);
    setTransition("none");
    setRotation(0);

    // Force reflow
    setTimeout(() => {
      // 2. The Logic:
      // Total duration: ~15-16s
      // We use a custom cubic-bezier to simulate: Slow Start -> Fast Spin -> Slow End
      // cubic-bezier(x1, y1, x2, y2)
      // ease-in-out is (0.42, 0, 0.58, 1). We want more dramatic.
      
      const spinDuration = 16; // seconds
      const totalRotations = 50; // 50 full circles
      const segmentAngle = 360 / 12; // Assuming 12 segments
      
      // Calculate where to stop based on winner (Optional: random position logic can be added)
      // For now, let's just spin a lot. If you want precise landing on a number, math is needed.
      // But for visual effect mostly:
      const targetRotation = (360 * totalRotations) + (Math.random() * 360); 

      setTransition(`transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`);
      setRotation(targetRotation);

      // 3. Show Winner Card after animation
      setTimeout(() => {
        setShowWinnerCard(true);
        if(onFinish) onFinish();
      }, spinDuration * 1000);

    }, 50);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer / Arrow */}
      <div className="absolute top-[-20px] z-20 w-10 h-12 bg-red-600 shadow-lg" 
           style={{ clipPath: "polygon(100% 0, 0 0, 50% 100%)" }}>
      </div>

      {/* Wheel Image/Div */}
      <div 
        className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border-8 border-yellow-500 shadow-[0_0_50px_rgba(255,215,0,0.5)] bg-slate-800 relative overflow-hidden"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: transition
        }}
      >
        {/* Wheel Segments (Design) */}
        {/* এখানে তোমার আগের ডিজাইনের সেগমেন্টগুলো বসবে (Radical Text সহ) */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white opacity-20 text-6xl font-black">ICT 25</span>
        </div>
      </div>

      {/* FINAL WINNER CARD OVERLAY */}
      {showWinnerCard && winnerData && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in zoom-in duration-500">
           <div className="bg-white text-black p-8 rounded-2xl shadow-2xl text-center border-4 border-yellow-400">
              <h3 className="text-xl font-bold uppercase text-gray-500">Winner!</h3>
              <h1 className="text-5xl font-black text-red-600 my-2">{winnerData.ticketNumber || "Ticket #"}</h1>
              <p className="text-lg font-semibold">{winnerData.name || "Lucky Student"}</p>
           </div>
        </div>
      )}
    </div>
  );
}