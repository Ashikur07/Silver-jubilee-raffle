"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"; // useEffect বাদ দিলাম
import { Sparkles, Lock, LayoutDashboard } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");

    if (adminData.email === "admin@gmail.com" && adminData.password === "Admin1234") {
      localStorage.setItem("user", JSON.stringify({ role: "admin", email: adminData.email }));
      router.push("/admin");
    } else {
      setError("Invalid Admin Credentials!");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-4">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="z-10 w-full max-w-md space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-sm font-semibold backdrop-blur-md shadow-lg">
            <Sparkles size={16} /> 25 Years Celebration
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Silver Jubilee <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
              Raffle Draw
            </span>
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          
          {/* User Section: Condition based on Session */}
          <div className="mb-8">
            {session ? (
              // যদি লগিন করা থাকে
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
              </button>
            ) : (
              // যদি লগিন না থাকে
              <>
                <button 
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-slate-900 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
                >
                  <img 
                    src="https://authjs.dev/img/providers/google.svg" 
                    alt="Google" 
                    className="w-6 h-6"
                  />
                  Sign in with Google
                </button>
                <p className="text-center text-gray-500 text-xs mt-3">
                  For Students, Teachers & Guests
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          {!session && (
            <>
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <span className="relative bg-slate-900 px-4 text-xs text-gray-400 uppercase">OR Admin Access</span>
              </div>

              {/* Admin Login Form (Only show if not logged in user) */}
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Admin Email</label>
                  <input 
                    type="email" 
                    placeholder="admin@gmail.com" 
                    className="w-full p-3 rounded-lg bg-slate-950 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none"
                    value={adminData.email}
                    onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••" 
                    className="w-full p-3 rounded-lg bg-slate-950 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none"
                    value={adminData.password}
                    onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button 
                  type="submit"
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock size={16} /> Login as Admin
                </button>
              </form>
            </>
          )}

        </div>
      </div>

      <div className="absolute bottom-4 text-center text-gray-600 text-xs">
        &copy; 2025 ICT Dept, Islamic University.
      </div>
    </main>
  );
}