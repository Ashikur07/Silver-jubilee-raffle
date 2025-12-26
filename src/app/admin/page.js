"use client";
import { useState, useEffect } from "react";
import { Trophy, Play, Settings, RotateCcw } from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [totalPrizes, setTotalPrizes] = useState(10);
  const [drawState, setDrawState] = useState(null); // DB থেকে স্টেট আনব
  const [isProcessing, setIsProcessing] = useState(false);

  // পেজ লোড হলে কারেন্ট স্টেট চেক করো
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000); // প্রতি ৩ সেকেন্ডে সিঙ্ক
    return () => clearInterval(interval);
  }, []);

  const fetchState = async () => {
    const res = await fetch("/api/draw/control"); // GET method call
    const data = await res.json();
    setDrawState(data);
    setLoading(false);
  };

  // ১. সেটআপ হ্যান্ডলার
  const handleSetup = async () => {
    if(!confirm(`Setup raffle for ${totalPrizes} prizes? Public screen will show 'Starting Soon'.`)) return;
    setIsProcessing(true);
    await fetch("/api/draw/control", {
        method: "POST",
        body: JSON.stringify({ action: "setup", totalCount: parseInt(totalPrizes) })
    });
    await fetchState();
    setIsProcessing(false);
  };

  // ২. স্টার্ট ড্র হ্যান্ডলার
  const handleStartDraw = async () => {
    const rank = drawState.currentPrizeRank;
    const label = rank === 1 ? "Grand Prize" : `${rank}th Prize`;

    if(!confirm(`Start spinning for: ${label}?`)) return;
    
    setIsProcessing(true);
    const res = await fetch("/api/draw/control", {
        method: "POST",
        body: JSON.stringify({ action: "start" }) // কোনো প্রাইজ নেম লাগবে না, অটো হবে
    });
    const data = await res.json();
    
    if(data.success) {
        alert(`🎯 Spin Started! Winner: ${data.winner}`);
    } else {
        alert("Error: " + data.message);
    }
    
    await fetchState();
    // বাটন ৫ সেকেন্ডের জন্য লক (এনিমেশন শুরু হওয়ার জন্য)
    setTimeout(() => setIsProcessing(false), 5000);
  };

  // ৩. রিসেট হ্যান্ডলার
  const handleReset = async () => {
    if(!confirm("⚠️ RESET EVERYTHING? This will stop the draw.")) return;
    await fetch("/api/draw/control", {
        method: "POST",
        body: JSON.stringify({ action: "reset" })
    });
    fetchState();
  };

  if(loading) return <div className="p-10 text-white">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Control</h1>
            <p className="text-gray-400 text-sm">Status: <span className="text-yellow-500 font-bold">{drawState?.status || "IDLE"}</span></p>
        </div>

        {/* CONDITION 1: SETUP PHASE (যদি IDLE বা FINISHED হয়) */}
        {(drawState?.status === "IDLE" || drawState?.status === "FINISHED") && (
            <div className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <label className="block text-sm text-gray-400 mb-2">Total Number of Prizes</label>
                    <input 
                      type="number" 
                      value={totalPrizes} 
                      onChange={(e) => setTotalPrizes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-600 rounded-lg p-3 text-white font-bold text-center text-xl focus:border-yellow-500 outline-none"
                    />
                </div>
                <button 
                  onClick={handleSetup}
                  disabled={isProcessing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                   <Settings size={20}/> Initialize Draw
                </button>
            </div>
        )}

        {/* CONDITION 2: DRAWING PHASE (যদি READY হয়) */}
        {drawState?.status === "READY" && (
            <div className="space-y-6 animate-in fade-in">
                
                {/* Status Indicator */}
                <div className="text-center bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                    <p className="text-gray-400 text-xs uppercase">Next Up</p>
                    <h2 className="text-3xl font-bold text-white mt-1">
                        {drawState.currentPrizeRank === 1 ? "🏆 Grand Prize" : `#${drawState.currentPrizeRank} Prize`}
                    </h2>
                    <p className="text-green-400 text-xs mt-1">Ready to Spin</p>
                </div>

                {/* THE MAIN BUTTON */}
                <button 
                  onClick={handleStartDraw}
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-2xl font-bold text-xl shadow-lg shadow-green-900/20 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1
                    ${isProcessing ? "bg-slate-700 cursor-not-allowed opacity-50" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"}
                  `}
                >
                   <span className="flex items-center gap-2">
                      <Play fill="white" /> START SPIN
                   </span>
                   <span className="text-xs font-normal opacity-80">
                      For Prize #{drawState.currentPrizeRank}
                   </span>
                </button>
                
                <div className="text-center text-xs text-gray-500">
                    Warning: Clicking start will immediately trigger the 16s animation on screen.
                </div>
            </div>
        )}

        {/* Footer Reset */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <button onClick={handleReset} className="text-red-500 text-xs hover:underline flex items-center justify-center gap-1 mx-auto">
                <RotateCcw size={12}/> Emergency Reset
            </button>
        </div>

      </div>
    </div>
  );
}