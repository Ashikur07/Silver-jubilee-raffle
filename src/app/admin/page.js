// admin/page.js
"use client";
import { useState, useEffect } from "react";
import { ChevronDown, Play, RotateCcw } from "lucide-react";

export default function AdminDashboard() {
  const [totalPrizes, setTotalPrizes] = useState("10");
  const [isSpinning, setIsSpinning] = useState(false); // Database status (only for display)
  const [lastWinner, setLastWinner] = useState(null);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [currentPrizeNumber, setCurrentPrizeNumber] = useState(0);
  const [isDrawComplete, setIsDrawComplete] = useState(false);
  const [winnersHistory, setWinnersHistory] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  
  // New: Local drawing state to control button locking independent of DB
  const [localIsDrawing, setLocalIsDrawing] = useState(false);

  // পোলিং: status চেক করো
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/draw/status");
      const data = await res.json();
      
      setIsSetupMode(data.isSetupMode || false);
      setCurrentPrizeNumber(data.currentPrizeNumber || 0);
      setIsSpinning(data.isSpinning || false); // স্ট্যাটাস টেক্সট দেখানোর জন্য আপডেট হবে
      setLastWinner(data.lastWinner || null);
      setWinnersHistory(data.winnersHistory || []);
      setIsDrawComplete(data.currentPrizeNumber === 0 && data.isSetupMode);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // === SET: কয়টা প্রাইজ সেট করবো ===
  const handleSetPrizes = async () => {
    if (!totalPrizes || totalPrizes < 1) {
      setFeedbackMsg("❌ Please select valid number of prizes");
      return;
    }

    try {
      const res = await fetch("/api/draw/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "set", 
          totalPrizes: parseInt(totalPrizes) 
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setFeedbackMsg(`✅ Setup done! Ready to draw for ${totalPrizes} prizes`);
        setIsSetupMode(true);
        setCurrentPrizeNumber(parseInt(totalPrizes));
      } else {
        setFeedbackMsg("❌ " + (data.error || "Setup failed"));
      }
    } catch (err) {
      setFeedbackMsg("❌ Error: " + err.message);
    }
  };

  // === START: কারেন্ট প্রাইজের ড্র এক্সিকিউট করো ===
  const handleStartDraw = async () => {
    if (!isSetupMode) {
      setFeedbackMsg("❌ Setup not complete");
      return;
    }

    try {
      // ১. বাটন লক করো (লোকালি)
      setLocalIsDrawing(true);
      setFeedbackMsg("⏳ Drawing...");
      
      const res = await fetch("/api/draw/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = await res.json();

      if (res.ok) {
        setLastWinner(data.winner);
        setFeedbackMsg(`✅ Winner #${data.winner} for ${data.currentPrize}`);
        
        // ২. হুইল অ্যানিমেশনের সাথে মিল রেখে ১২ সেকেন্ড অপেক্ষা করো
        await new Promise(resolve => setTimeout(resolve, 12000));
        
        if (data.isDrawComplete) {
          setIsDrawComplete(true);
          setFeedbackMsg("🎉 All draws complete!");
        } else {
          setFeedbackMsg("✅ Ready for next draw!");
        }
      } else {
        setFeedbackMsg("❌ " + (data.error || "Draw failed"));
      }
    } catch (err) {
      setFeedbackMsg("❌ Error: " + err.message);
    } finally {
      // ৩. কাজ শেষে বাটন আনলক করো
      setLocalIsDrawing(false);
    }
  };

  // === RESET: সব কিছু রিসেট করো ===
  const handleReset = async () => {
    try {
      const res = await fetch("/api/draw/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });

      if (res.ok) {
        setIsSetupMode(false);
        setCurrentPrizeNumber(0);
        setLastWinner(null);
        setIsDrawComplete(false);
        setWinnersHistory([]);
        setTotalPrizes("10");
        setFeedbackMsg("✅ Reset complete. Ready for new session");
        setLocalIsDrawing(false); // রিসেট করলে লকও খুলে দাও
      }
    } catch (err) {
      setFeedbackMsg("❌ Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-black mb-10 text-yellow-500">🎰 Admin Control Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* === LEFT: DRAW CONTROL === */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-yellow-500/30">
          <h2 className="text-3xl font-black mb-8 text-yellow-400">Multi-Prize Draw Setup</h2>

          {/* STATUS DISPLAY */}
          <div className="space-y-4 mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            {isSetupMode && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Prizes:</span>
                  <span className="text-2xl font-black text-yellow-400">{totalPrizes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Prize #:</span>
                  <span className="text-2xl font-black text-blue-400">{currentPrizeNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className={`text-lg font-bold ${isDrawComplete ? "text-green-400" : "text-orange-400"}`}>
                    {isDrawComplete ? "✅ All Complete" : `🔄 Drawing ${currentPrizeNumber} prizes`}
                  </span>
                </div>
              </>
            )}
            {!isSetupMode && (
              <div className="text-gray-400 text-center italic">Setup not started yet</div>
            )}
          </div>

          {/* SET MODE */}
          {!isSetupMode ? (
            <div className="space-y-4 mb-8">
              <label className="block text-sm font-bold text-gray-300 uppercase">Select Number of Prizes</label>
              <select 
                value={totalPrizes}
                onChange={(e) => setTotalPrizes(e.target.value)}
                className="w-full p-4 rounded-lg bg-slate-900 border-2 border-slate-700 text-white font-bold text-xl focus:border-yellow-500 outline-none"
              >
                {[1, 3, 5, 10, 15, 20, 25].map(num => (
                  <option key={num} value={num}>{num} Prizes</option>
                ))}
              </select>

              <button 
                onClick={handleSetPrizes}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl py-4 rounded-lg transition transform hover:scale-105 uppercase tracking-wider"
              >
                ⚙️ Set Prizes
              </button>
            </div>
          ) : (
            /* START MODE */
            <div className="space-y-4 mb-8">
              {/* এখানে disabled শর্তে localIsDrawing ব্যবহার করা হয়েছে */}
              <button 
                onClick={handleStartDraw}
                disabled={localIsDrawing || isDrawComplete}
                className={`w-full font-black text-xl py-4 rounded-lg transition transform hover:scale-105 uppercase tracking-wider ${
                  localIsDrawing || isDrawComplete
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 text-white"
                }`}
              >
                <Play className="inline mr-2" size={24} />
                {localIsDrawing ? "Drawing..." : `Start for ${currentPrizeNumber}th Prize`}
              </button>

              <button 
                onClick={handleReset}
                disabled={localIsDrawing} // ড্র চলার সময় রিসেটও বন্ধ থাকবে
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-3 rounded-lg transition transform hover:scale-105 uppercase tracking-wider disabled:opacity-50"
              >
                <RotateCcw className="inline mr-2" size={20} />
                Reset Session
              </button>
            </div>
          )}

          {/* FEEDBACK MESSAGE */}
          {feedbackMsg && (
            <div className={`p-4 rounded-lg text-center font-bold text-lg ${
              feedbackMsg.includes("❌") ? "bg-red-900/30 border border-red-500 text-red-200" :
              feedbackMsg.includes("✅") ? "bg-green-900/30 border border-green-500 text-green-200" :
              "bg-blue-900/30 border border-blue-500 text-blue-200"
            }`}>
              {feedbackMsg}
            </div>
          )}

          {lastWinner && !isDrawComplete && (
            <div className="mt-6 p-4 bg-yellow-500/20 border-2 border-yellow-400 rounded-lg text-center">
              <p className="text-gray-300 text-sm mb-1">Last Winner</p>
              <p className="text-4xl font-black text-yellow-300">#{lastWinner}</p>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-700 text-center">
            <a 
              href="/draw" 
              target="_blank" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              📺 Open Big Screen Draw Page →
            </a>
          </div>
        </div>

        {/* === RIGHT: WINNERS HISTORY === */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-slate-700">
          <h2 className="text-2xl font-black mb-6 text-green-400">🏆 Winners History</h2>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {winnersHistory && winnersHistory.length > 0 ? (
              winnersHistory.map((w, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 flex justify-between items-center hover:border-yellow-500 transition"
                >
                  <div>
                    <p className="text-yellow-400 font-black text-lg">#{w.ticketNumber}</p>
                    <p className="text-gray-400 text-sm">{w.prize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">✓ Winner</p>
                    <p className="text-gray-500 text-xs">#{w.prizeNumber || w.prize}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 italic">No winners yet</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}