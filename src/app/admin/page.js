"use client";
import { useState } from "react";
import { Trophy, Play, RotateCcw, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [prize, setPrize] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastWinnerInfo, setLastWinnerInfo] = useState(null);

  // --- 1. Start Auto Draw Logic ---
  const handleDrawControl = async () => {
    if (!prize) return alert("⚠️ Please enter a prize name first!");
    
    // কনফার্মেশন
    if (!confirm(`Are you sure to START draw for: "${prize}"?`)) return;

    setIsDrawing(true);
    setLastWinnerInfo(null); // আগের ইনফো ক্লিয়ার

    try {
      const res = await fetch("/api/draw/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", prize }),
      });

      const data = await res.json();

      if (data.success) {
        // এডমিন সাথে সাথেই উইনার দেখতে পাবে
        setLastWinnerInfo(data.winner); 
        alert(`✅ Draw Started Successfully!\n\nWinner Ticket: ${data.winner}`);
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to connect server.");
    }

    // বাটন ৩ সেকেন্ড পর আবার এনাবল হবে (যাতে ডাবল ক্লিক না পড়ে)
    setTimeout(() => setIsDrawing(false), 3000);
  };

  // --- 2. Reset Screen Logic ---
  const handleReset = async () => {
    if (!confirm("⚠️ This will clear the public screen. Are you sure?")) return;
    
    try {
      await fetch("/api/draw/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      alert("✅ Screen Reset Successfully.");
      setLastWinnerInfo(null);
      setPrize("");
    } catch (error) {
      alert("❌ Reset Failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-slate-800 rounded-full border border-slate-700 shadow-lg">
             <ShieldCheck className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Raffle Admin Control</h1>
          <p className="text-gray-400 text-sm">Manage the live draw from here</p>
        </div>

        {/* Control Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
           
           {/* Input: Prize Name */}
           <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                 <Trophy size={16} className="text-yellow-500"/> Current Prize Name
              </label>
              <input 
                type="text" 
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="e.g. 1st Prize - Laptop"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
              />
           </div>

           {/* Button: Start Draw */}
           <button
             onClick={handleDrawControl}
             disabled={isDrawing || !prize}
             className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95
               ${isDrawing 
                 ? "bg-slate-700 text-gray-500 cursor-not-allowed" 
                 : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-green-500/20"
               }
             `}
           >
             {isDrawing ? (
               "Processing..."
             ) : (
               <>
                 <Play fill="currentColor" /> Start Auto Draw
               </>
             )}
           </button>

           {/* Info Box (Only shows after start) */}
           {lastWinnerInfo && (
             <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                <div className="space-y-1">
                   <p className="text-green-400 text-sm font-bold">Draw Running...</p>
                   <p className="text-gray-300 text-xs">
                     The system selected Ticket <span className="text-white font-mono font-bold">{lastWinnerInfo}</span>. 
                     Animation is playing on the main screen.
                   </p>
                </div>
             </div>
           )}

           <div className="border-t border-slate-800 pt-4">
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-lg border border-slate-700 text-gray-400 hover:bg-slate-800 hover:text-white transition flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw size={16} /> Reset Screen / Stop
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}