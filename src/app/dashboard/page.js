"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [stats, setStats] = useState({ total: 0, sold: 0 });
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) router.push("/");
    setUser(u);
    fetchTickets(1);
  }, []);

  const fetchTickets = async (p) => {
    const res = await fetch(`/api/tickets?type=online&page=${p}`);
    const data = await res.json();
    setTickets(data.tickets);
    setStats({ total: data.total, sold: data.sold });
    setPage(p);
  };

  const toggleSelect = (ticket) => {
    if (ticket.status === "sold") return;
    if (selected.includes(ticket._id)) {
      setSelected(selected.filter(id => id !== ticket._id));
    } else {
      setSelected([...selected, ticket._id]);
    }
  };

  const buyTickets = async () => {
    if(!confirm(`Buy ${selected.length} tickets?`)) return;
    await fetch("/api/tickets", {
      method: "POST",
      body: JSON.stringify({ ticketIds: selected, email: user.email }),
    });
    alert("Purchase Successful!");
    setSelected([]);
    fetchTickets(page);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">Buy Online Tickets</h1>
          <div className="bg-slate-800 p-4 rounded-lg flex gap-6">
            <div>Total: {stats.total}</div>
            <div className="text-green-400">Available: {stats.total - stats.sold}</div>
            <div className="text-red-400">Sold: {stats.sold}</div>
          </div>
        </div>

        {/* Demo Ticket Visual */}
        <div className="flex justify-center mb-10">
           <div className="w-96 h-40 bg-gradient-to-r from-blue-900 to-slate-800 border-2 border-yellow-500 rounded-xl flex overflow-hidden shadow-2xl relative">
              <div className="w-2/3 p-4 border-r border-dashed border-yellow-500/50 flex flex-col justify-between">
                 <h3 className="text-yellow-400 font-bold uppercase text-xs">Silver Jubilee 2025</h3>
                 <div className="text-2xl font-bold">Raffle Draw</div>
                 <div className="text-xs text-gray-400">Dept of ICT, Islamic University</div>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center bg-black/20">
                 <span className="text-gray-400 text-[10px] uppercase">Ticket No</span>
                 <span className="text-2xl font-mono font-bold text-white">XXXX</span>
              </div>
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
           </div>
        </div>

        {/* Bus/Train Style Selection Grid */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
           <div className="flex justify-between mb-4">
              <button onClick={() => fetchTickets(page > 1 ? page - 1 : 1)} disabled={page===1} className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50">Prev 100</button>
              <span>Showing Page {page} (Tickets {(page-1)*100 + 5001} - {page*100 + 5000})</span>
              <button onClick={() => fetchTickets(page + 1)} className="px-4 py-2 bg-blue-600 rounded">Next 100</button>
           </div>

           <div className="grid grid-cols-10 gap-2">
              {tickets.map((t) => (
                <button
                  key={t._id}
                  onClick={() => toggleSelect(t)}
                  disabled={t.status === "sold"}
                  className={`
                    p-2 rounded text-xs font-bold transition
                    ${t.status === "sold" ? "bg-red-900 text-red-300 cursor-not-allowed" : 
                      selected.includes(t._id) ? "bg-yellow-500 text-black scale-110" : "bg-green-700 hover:bg-green-600 text-white"}
                  `}
                >
                  {t.ticketNumber}
                </button>
              ))}
           </div>
        </div>

        {/* Sticky Buy Bar */}
        {selected.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-slate-800 border-t border-slate-700 p-4 flex justify-between items-center px-10 animate-slide-up">
             <div>Selected: {selected.length} Tickets</div>
             <button onClick={buyTickets} className="px-8 py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400">
               Confirm Purchase
             </button>
          </div>
        )}
      </div>
    </div>
  );
}