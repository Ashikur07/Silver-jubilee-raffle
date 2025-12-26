"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FortuneWheel from "@/components/FortuneWheel"; // আগের কম্পোনেন্ট

export default function DrawPage() {
  const [status, setStatus] = useState({ 
    animationPhase: "idle", 
    winner: null, 
    currentPrizeRank: 10 
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(false);

  // Poll server every 1 second to check admin action
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get("/api/draw/status");
        
        // Logic to trigger animations based on phase
        if (data.animationPhase === "ready" && status.animationPhase !== "ready") {
           // Step 1: Show Ready Alert
           setStatus(data);
           setShowAlert(true);
           
           // After 3 seconds, Auto start spin (Backend doesn't need to change, Frontend takes over)
           setTimeout(() => {
             setShowAlert(false);
             setSpinTrigger(true); // Triggers wheel spin
           }, 3000); 
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status.animationPhase]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-10"></div>

      {/* ALERT POPUP (Cinematic) */}
      {showAlert && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
          <div className="text-center">
             <h2 className="text-4xl md:text-6xl font-black text-yellow-400 mb-4 animate-bounce">
               Are You Ready?
             </h2>
             <p className="text-2xl text-white font-bold tracking-widest uppercase">
               Drawing for {status.currentPrizeRank}th Prize
             </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        <h1 className="text-yellow-500 font-bold tracking-[0.5em] uppercase text-sm md:text-xl">
          Grand Raffle Draw 2025
        </h1>

        {/* The Wheel Section */}
        <div className="transform scale-90 md:scale-100 transition-all duration-1000">
          <FortuneWheel 
             startSpin={spinTrigger} 
             winnerData={status.winner} // Pass the winner info
             onFinish={() => console.log("Animation Done")}
          />
        </div>

        {/* Winner Announcement (Shows only after spin ends) */}
        {/* এটা Wheel কম্পোনেন্টের ভেতর থেকেও হ্যান্ডেল করা যাবে */}
      </div>
    </div>
  );
}