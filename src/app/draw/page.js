"use client";
import { useState, useEffect } from "react";
import { Sparkles, Trophy, Star } from "lucide-react";

/* ---------------- Fortune Wheel ---------------- */

const FortuneWheel = ({ isSpinning, winningNumber }) => {
  const [rotation, setRotation] = useState(0);

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
    if (isSpinning && winningNumber) {
      let index = Math.floor((winningNumber - 1) / 1000);
      if (index < 0) index = 0;
      if (index > 9) index = 9;

      const segmentAngle = 36;
      const targetRotation =
        360 - index * segmentAngle - segmentAngle / 2;

      const totalRotation =
        rotation +
        360 * 2 + // slow
        360 * 5 + // fast
        targetRotation;

      setRotation(totalRotation);
    }
  }, [isSpinning, winningNumber]);

  return (
    <div className="relative flex flex-col items-center">
      {/* WINNER Arrow */}
      <div className="mb-[-20px] relative z-20 animate-bounce">
        <div className="bg-red-600 border-4 border-red-800 text-white font-black text-xl px-8 py-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase tracking-widest -skew-x-12">
          WINNER
        </div>
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 absolute left-1/2 -translate-x-1/2 -bottom-6"></div>
      </div>

      {/* Wheel */}
      <div className="relative flex items-center justify-center mt-6">
        <div
          className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border-[10px] md:border-[12px] border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.4)] overflow-hidden relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 12s cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "none",
          }}
        >
          {segments.map((seg, i) => (
            <div
              key={i}
              className="absolute top-0 left-0 w-full h-full"
              style={{ transform: `rotate(${i * 36}deg)` }}
            >
              <div
                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                style={{
                  transform: "skewY(-54deg)",
                  background: seg.color,
                }}
              />
              <div
                className="absolute top-0 left-0 w-full h-1/2 flex justify-center origin-bottom"
                style={{ transform: "rotate(18deg)" }}
              >
                <div className="h-full flex items-start pt-8 md:pt-10">
                  <span className="text-white font-black text-lg md:text-xl rotate-[-90deg]">
                    {seg.label}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center border-[6px] border-gray-200 z-10">
            <Star className="text-yellow-500 w-10 h-10 md:w-12 md:h-12 fill-yellow-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Winner Card ---------------- */

const WinningTicketCard = ({ number, prize }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className={`transition-all duration-1000 ${
        visible
          ? "scale-100 opacity-100"
          : "scale-0 opacity-0 translate-y-40"
      }`}
    >
      <div className="w-[340px] md:w-[500px] bg-slate-900 rounded-2xl border-4 border-yellow-400 p-6 text-center">
        <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
          {prize}
        </h2>
        <div className="text-6xl md:text-8xl font-black text-yellow-400">
          {number}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */

export default function LiveDraw() {
  const [status, setStatus] = useState({
    isSpinning: false,
    lastWinner: null,
    currentPrizeIndex: null,
    totalPrizes: null,
    phase: "idle", // idle | ready | spinning
  });

  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/draw/status");
      const data = await res.json();

      if (data.phase === "spinning") {
        setShowWinner(false);
      }

      if (
        status.phase === "spinning" &&
        data.phase === "ready" &&
        data.lastWinner
      ) {
        setTimeout(() => setShowWinner(true), 5000);
      }

      setStatus(data);
    }, 1000);

    return () => clearInterval(interval);
  }, [status.phase]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        {status.phase === "ready" && (
          <p className="text-red-400 animate-pulse">
            ⚠️ Draw for {status.currentPrizeIndex} prizes is about to start
          </p>
        )}

        <div className={`${showWinner ? "hidden" : "block"}`}>
          <FortuneWheel
            isSpinning={status.phase === "spinning"}
            winningNumber={status.lastWinner}
          />
        </div>

        {showWinner && (
          <WinningTicketCard
            number={status.lastWinner}
            prize={`${status.currentPrizeIndex}th Prize`}
          />
        )}
      </div>
    </div>
  );
}
