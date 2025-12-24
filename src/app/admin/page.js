"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [prize, setPrize] = useState("1st Prize");
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleDrawControl = async (action) => {
    if (action === "start") setIsDrawing(true);
    
    const res = await fetch("/api/draw/control", {
      method: "POST",
      body: JSON.stringify({ action, prize }),
    });
    
    if (action === "stop") {
      const data = await res.json();
      setWinner(data.winner);
      setIsDrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
       <h1 className="text-3xl mb-8">Admin Control Panel</h1>

       <div className="grid grid-cols-2 gap-10">
         {/* Draw Control */}
         <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Live Raffle Control</h2>
            
            <div className="mb-6">
               <label className="block mb-2">Select Prize Category</label>
               <select 
                 className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                 onChange={(e) => setPrize(e.target.value)}
               >
                 <option>1st Prize (Laptop)</option>
                 <option>2nd Prize (Smartphone)</option>
                 <option>3rd Prize (Smart Watch)</option>
                 <option>Special Prize</option>
               </select>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => handleDrawControl("start")}
                 disabled={isDrawing}
                 className={`flex-1 py-4 font-bold rounded text-xl ${isDrawing ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'}`}
               >
                 Start Spin
               </button>
               <button 
                 onClick={() => handleDrawControl("stop")}
                 disabled={!isDrawing}
                 className={`flex-1 py-4 font-bold rounded text-xl ${!isDrawing ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-500'}`}
               >
                 Stop & Pick Winner
               </button>
            </div>

            {winner && (
               <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500 text-center rounded">
                  Last Winner: <span className="text-2xl font-bold text-yellow-400">#{winner}</span>
               </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-slate-700 text-center">
               <a href="/draw" target="_blank" className="text-blue-400 underline text-lg">
                  Open Big Screen Draw Page ➡
               </a>
            </div>
         </div>

         {/* Offline Ticket Entry (Short version) */}
         <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 opacity-50 pointer-events-none">
            <h2 className="text-xl font-bold mb-4">Offline Entry (Coming Soon)</h2>
            <p>Use the same grid system as User Dashboard but fetching `type=offline` tickets.</p>
         </div>
       </div>
    </div>
  );
}