"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // ১. এডমিন চেক (Hardcoded credentials)
    if (formData.email === "admin@gmail.com" && formData.password === "Admin1234") {
      // লোকাল স্টোরেজে সেভ রাখছি যে এডমিন লগিন করেছে
      localStorage.setItem("user", JSON.stringify({ role: "admin", email: formData.email }));
      router.push("/admin"); // এডমিন ড্যাশবোর্ডে পাঠাও
    } 
    // ২. সাধারণ ইউজার চেক (যেকোনো মেইল দিলেই হবে)
    else if (formData.email) {
      // সাধারণ ইউজার হিসেবে সেভ
      localStorage.setItem("user", JSON.stringify({ role: "user", email: formData.email }));
      router.push("/dashboard"); // ইউজার টিকেট কেনার পেজে পাঠাও
    } 
    else {
      setError("Please enter a valid email.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Effects (Design) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse"></div>
      <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* Main Landing Content */}
      <div className="z-10 text-center space-y-8 p-4">
        
        {/* Jubilee Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-sm font-semibold backdrop-blur-md shadow-lg mb-4">
          <Sparkles size={16} /> 25 Years Celebration
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
          Silver Jubilee <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700">
            Raffle Draw 2025
          </span>
        </h1>

        <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto">
          Department of ICT, Islamic University invites you to the grand celebration.
          Get your lucky ticket now!
        </p>

        {/* Action Button */}
        <button 
          onClick={() => setShowLogin(true)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
        >
          Enter Portal
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* LOGIN MODAL (Pop-up) */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Lock className="text-yellow-500 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Login</h2>
              <p className="text-gray-400 text-sm">Enter your details to proceed</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  className="w-full p-3 rounded-lg bg-slate-950 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Password (Admin Only)</label>
                <input 
                  type="password" 
                  placeholder="******"
                  className="w-full p-3 rounded-lg bg-slate-950 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none transition"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <p className="text-[10px] text-gray-500 mt-1">* Regular users can leave password blank</p>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button 
                type="submit" 
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-colors mt-2"
              >
                Access Dashboard
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="absolute bottom-4 text-center text-gray-500 text-xs">
        &copy; 2025 ICT Dept, IU. Developed for Silver Jubilee.
      </div>
    </main>
  );
}