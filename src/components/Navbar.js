"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Sparkles, LogOut, LayoutDashboard, Home as HomeIcon } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // এডমিন পেজে বা লগিন পেজে আলাদা স্টাইল চাইলে কন্ডিশন দেওয়া যায়, আপাতত সবখানেই রাখছি
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Home Link */}
          <Link href="/" className="flex items-center gap-2 text-yellow-500 font-bold text-lg hover:text-yellow-400 transition">
            <Sparkles className="w-5 h-5" />
            <span>IU Jubilee</span>
          </Link>

          {/* Right Side Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className={`flex items-center gap-1 text-sm font-medium transition ${pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              <HomeIcon className="w-4 h-4" /> Home
            </Link>

            {session ? (
              <>
                <Link 
                  href={session.user?.email === "admin@gmail.com" ? "/admin" : "/dashboard"}
                  className={`flex items-center gap-1 text-sm font-medium transition ${pathname.includes("dashboard") || pathname.includes("admin") ? "text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                <div className="h-4 w-px bg-gray-700"></div>

                <div className="hidden md:block text-xs text-gray-400">
                  {session.user?.name || session.user?.email}
                </div>

                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-red-600/20"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </>
            ) : (
              <Link 
                href="/" 
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}