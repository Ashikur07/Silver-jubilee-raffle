// Admin Component Part
"use client";
import { useState } from "react";
import axios from "axios";

export default function AdminControl() {
  const [prizeRank, setPrizeRank] = useState(10); // ডিফল্ট ১০ম পুরস্কার
  const [loading, setLoading] = useState(false);

  const handleStartDraw = async () => {
    setLoading(true);
    try {
      // Start the draw
      await axios.post("/api/admin/spin", { 
        prizeRank: prizeRank, 
        action: "START" 
      });
      
      alert(`Draw started for ${prizeRank}th Prize!`);
      
      // Auto Decrement for next time (10 -> 9 -> 8)
      if (prizeRank > 1) {
        setPrizeRank(prev => prev - 1);
      }
    } catch (err) {
      alert("Error starting draw");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await axios.post("/api/admin/spin", { action: "RESET" });
    alert("System Reset for Next Draw");
  };

  return (
    <div className="p-10 bg-gray-800 text-white rounded-xl text-center space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400">Raffle Control Panel</h2>
      
      <div className="flex flex-col items-center gap-4">
        <label className="text-lg">Select Prize Rank:</label>
        <input 
          type="number" 
          value={prizeRank}
          onChange={(e) => setPrizeRank(Number(e.target.value))}
          className="p-3 rounded text-black text-center text-xl font-bold w-32"
        />
        
        <button 
          onClick={handleStartDraw} 
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Starting..." : `START DRAW (for ${prizeRank}th Prize)`}
        </button>

        <button 
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-4 text-sm"
        >
          Reset System (Stop Animation)
        </button>
      </div>
    </div>
  );
}