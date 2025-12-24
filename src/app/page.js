"use client";
import { useState } from "react";
import { Sparkles, Ticket as TicketIcon } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const buyTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/buy-ticket", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) setTicket(data.ticket);
    else alert(data.message);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

      <div className="z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-sm font-semibold backdrop-blur-md">
            <Sparkles size={16} /> 25th Silver Jubilee
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 drop-shadow-lg">
            Raffle Draw
          </h1>
          <p className="text-blue-200">Dept of ICT, Islamic University</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

          {!ticket ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Secure Your Chance!</h2>
                <p className="text-sm text-gray-300">Enter your email to grab an exclusive online ticket.</p>
              </div>

              <form onSubmit={buyTicket} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-gray-500 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Generating..." : "Get My Ticket Now"}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-4">
                *Online tickets start from #5001
              </p>
            </div>
          ) : (
            // Success State - The Ticket
            <div className="text-center animate-in zoom-in duration-500">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border border-green-500/30">
                  <Sparkles size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">Congratulations!</h2>
              <p className="text-blue-200 mb-6">Here is your raffle ticket number</p>

              <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-1 rounded-2xl shadow-xl transform hover:rotate-1 transition-transform cursor-default">
                <div className="bg-slate-900 rounded-xl p-6 border border-yellow-500/50 relative overflow-hidden">
                   {/* Background Pattern */}
                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                   
                   <p className="text-yellow-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">Ticket Number</p>
                   <div className="text-6xl font-black text-white tracking-tight drop-shadow-md">
                     #{ticket.ticketNumber}
                   </div>
                   <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                      <span>Owner: {ticket.userMail.split('@')[0]}...</span>
                      <span>Type: Online</span>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => setTicket(null)}
                className="mt-8 text-sm text-gray-400 hover:text-white underline transition"
              >
                Buy Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}