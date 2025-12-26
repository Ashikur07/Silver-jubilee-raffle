"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [totalPrizes, setTotalPrizes] = useState("");
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    const res = await fetch("/api/draw/status");
    const data = await res.json();
    setStatus(data);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSet = async () => {
    await fetch("/api/draw/control", {
      method: "POST",
      body: JSON.stringify({
        action: "set",
        totalPrizes: Number(totalPrizes),
      }),
    });
    fetchStatus();
  };

  const handleStart = async () => {
    await fetch("/api/draw/control", {
      method: "POST",
      body: JSON.stringify({ action: "start" }),
    });
    fetchStatus();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl mb-8">Admin Control Panel</h1>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-xl">
        <label className="block mb-2">Total Prizes</label>
        <input
          type="number"
          className="w-full p-3 rounded bg-slate-900 border border-slate-600 mb-4"
          value={totalPrizes}
          onChange={(e) => setTotalPrizes(e.target.value)}
        />

        <button
          onClick={handleSet}
          className="w-full mb-4 py-3 bg-yellow-500 text-black font-bold rounded"
        >
          Set Draw
        </button>

        {status?.phase === "ready" && (
          <button
            onClick={handleStart}
            className="w-full py-4 bg-green-600 hover:bg-green-500 font-bold rounded text-xl"
          >
            Start for {status.currentPrizeIndex}th Prize
          </button>
        )}

        {status?.phase === "finished" && (
          <p className="text-green-400 mt-4 text-center">
            🎉 All prizes drawn successfully
          </p>
        )}

        <div className="mt-6 text-center">
          <a
            href="/draw"
            target="_blank"
            className="text-blue-400 underline"
          >
            Open Draw Screen
          </a>
        </div>
      </div>
    </div>
  );
}
