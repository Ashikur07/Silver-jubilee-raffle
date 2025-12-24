"use client";
import { useState, useEffect } from "react";

export default function LiveDraw() {
  const [status, setStatus] = useState({ isSpinning: false, lastWinner: null, currentPrize: "" });
  const [displayNum, setDisplayNum] = useState(1000);

  // Polling Effect (প্রতি ১ সেকেন্ড পর পর চেক করবে)
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/draw/status");
      const data = await res.json();
      setStatus(data);
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, []);

  // Spinning Animation Effect
  useEffect(() => {
    let spinInterval;
    if (status.isSpinning) {
      spinInterval = setInterval(() => {
        // র‍্যান্ডম নাম্বার দেখাবে যখন ঘুরবে
        setDisplayNum(Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000);
      }, 50); // খুব দ্রুত সংখ্যা পরিবর্তন হবে
    } else if (status.lastWinner) {
      setDisplayNum(status.lastWinner);
    }
    return () => clearInterval(spinInterval);
  }, [status.isSpinning, status.lastWinner]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Lights Effect */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black"></div>

      <div className="z-10 text-center">
        <h2 className="text-4xl text-yellow-500 font-bold mb-2 uppercase tracking-[0.5em]">
          {status.isSpinning ? "Drawing For..." : "Winner For"}
        </h2>
        <h1 className="text-6xl text-white font-black mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {status.currentPrize || "Grand Prize"}
        </h1>

        {/* The Circle */}
        <div className={`
           relative w-96 h-96 rounded-full border-[8px] flex items-center justify-center bg-slate-900 shadow-[0_0_100px_rgba(59,130,246,0.5)]
           ${status.isSpinning ? "border-blue-500 animate-pulse" : "border-yellow-500 scale-110 transition-transform duration-500"}
        `}>
           {/* Decorative Rings */}
           <div className={`absolute inset-0 border-4 border-dashed border-white/20 rounded-full ${status.isSpinning ? "animate-spin-slow" : ""}`}></div>
           
           <div className="text-center">
              <span className="block text-gray-400 text-sm uppercase tracking-widest mb-2">Ticket Number</span>
              <span className={`block text-8xl font-mono font-bold ${status.isSpinning ? "text-gray-300 blur-sm" : "text-white"}`}>
                {displayNum}
              </span>
           </div>
        </div>

        {/* Winner Announcement */}
        {!status.isSpinning && status.lastWinner && (
          <div className="mt-12 animate-bounce">
             <div className="text-3xl text-green-400 font-bold">Congratulations!</div>
             <p className="text-gray-400">Please collect your prize from the stage.</p>
          </div>
        )}
      </div>
    </div>
  );
}