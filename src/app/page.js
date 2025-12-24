"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [creds, setCreds] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    // হার্ডকোডেড এডমিন
    if (creds.email === "admin@gmail.com" && creds.password === "Admin1234") {
      localStorage.setItem("user", JSON.stringify({ role: "admin" }));
      router.push("/admin");
    } else {
      // সাধারণ ইউজার (যেকোনো মেইল দিলেই ঢুকতে পারবে)
      localStorage.setItem("user", JSON.stringify({ role: "user", email: creds.email }));
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      <div className="z-10 text-center space-y-6">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          Silver Jubilee 2025
        </h1>
        <p className="text-blue-200 text-xl">Dept of ICT, Islamic University</p>
        
        <button 
          onClick={() => setShowLogin(true)}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg transition"
        >
          Login / Dashboard
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-2xl w-96 border border-slate-700">
            <h2 className="text-2xl text-white font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" placeholder="Email" required
                className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600"
                onChange={(e) => setCreds({...creds, email: e.target.value})}
              />
              <input 
                type="password" placeholder="Password (Optional for users)"
                className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600"
                onChange={(e) => setCreds({...creds, password: e.target.value})}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-2 text-gray-400">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-yellow-500 text-slate-900 font-bold rounded">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}