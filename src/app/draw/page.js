"use client";
import { useState } from "react";

export default function DrawPage() {
  const [winner, setWinner] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    setWinner(null);

    // একটু নাটকীয় ভাব আনার জন্য ৩ সেকেন্ড অপেক্ষা
    setTimeout(async () => {
      const res = await fetch("/api/draw");
      const data = await res.json();
      setWinner(data);
      setIsDrawing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-10 text-yellow-500">🏆 Grand Raffle Draw 🏆</h1>
      
      <div className="w-80 h-80 flex items-center justify-center border-4 border-slate-700 rounded-full relative bg-slate-900 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
        {isDrawing ? (
          <div className="text-6xl font-mono animate-pulse text-gray-400">
             ...
          </div>
        ) : winner ? (
          <div className="text-center animate-bounce">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Winner Ticket</p>
            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mt-2">
              #{winner.ticketNumber}
            </h2>
            <p className="text-xs text-gray-500 mt-2 capitalize">Type: {winner.type}</p>
          </div>
        ) : (
          <div className="text-gray-600 text-xl">Ready?</div>
        )}
      </div>

      <button
        onClick={handleDraw}
        disabled={isDrawing}
        className="mt-12 px-10 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-full shadow-lg transition transform active:scale-95 disabled:opacity-50"
      >
        {isDrawing ? "Drawing..." : "Start Draw"}
      </button>
    </div>
  );
}