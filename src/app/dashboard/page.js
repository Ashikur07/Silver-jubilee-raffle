"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Ticket, GraduationCap, Calendar, User } from "lucide-react";

export default function DashboardMenu() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">
              Welcome, {session?.user?.name?.split(" ")[0] || "Student"}!
            </h1>
            <p className="text-gray-400 mt-1">Student Portal • Dept of ICT</p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
            {session?.user?.image ? (
               <img src={session.user.image} className="w-full h-full rounded-full" />
            ) : (
               <User className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Raffle Draw Card (Active Feature) */}
          <Link href="/dashboard/raffle-draw" className="group">
            <div className="bg-gradient-to-br from-blue-900 to-slate-800 p-8 rounded-2xl border border-blue-500/30 hover:border-yellow-500 transition-all transform hover:-translate-y-1 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Ticket size={100} />
               </div>
               <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:text-yellow-400 transition">
                  <Ticket size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Silver Jubilee Raffle</h3>
               <p className="text-sm text-gray-400">Buy tickets, view status & win exclusive prizes.</p>
               <span className="inline-block mt-4 text-xs font-bold text-yellow-500 uppercase tracking-wider group-hover:underline">
                 Enter Now &rarr;
               </span>
            </div>
          </Link>

          {/* Dummy Feature 1 */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 opacity-60 cursor-not-allowed">
             <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                <GraduationCap size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Convocation</h3>
             <p className="text-sm text-gray-400">Registration closed.</p>
          </div>

          {/* Dummy Feature 2 */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 opacity-60 cursor-not-allowed">
             <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                <Calendar size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Event Schedule</h3>
             <p className="text-sm text-gray-400">Coming soon.</p>
          </div>

        </div>
      </div>
    </div>
  );
}