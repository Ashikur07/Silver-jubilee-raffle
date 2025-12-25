"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Ticket, Users, CheckCircle, Zap, Grid } from "lucide-react";
import Link from "next/link";

// --- Components ---

// 1. Premium Ticket Visual Component (ডিজাইন অপরিবর্তিত)
const DemoTicket = ({ number, type = "large" }) => (
  <div className={`relative ${type === "large" ? "w-full max-w-2xl h-64" : "w-64 h-32"} mx-auto transition-all duration-500`}>
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 rounded-xl shadow-2xl transform rotate-1"></div>
    <div className="absolute inset-0 bg-slate-900 m-1 rounded-lg flex overflow-hidden border border-yellow-500/50">
      {/* Left Stub */}
      <div className={`${type === "large" ? "w-1/3 p-6" : "w-1/3 p-2"} bg-slate-800 border-r-2 border-dashed border-yellow-500/30 flex flex-col justify-between relative`}>
        <div className={`absolute -top-3 -right-3 w-6 h-6 bg-slate-950 rounded-full z-10`}></div>
        <div className={`absolute -bottom-3 -right-3 w-6 h-6 bg-slate-950 rounded-full z-10`}></div>
        
        <div className="text-yellow-500 font-bold uppercase text-[10px] tracking-widest">Silver Jubilee</div>
        <div className="text-slate-400 text-[10px]">IU ICT Dept</div>
      </div>
      
      {/* Right Content */}
      <div className={`${type === "large" ? "w-2/3 p-6" : "w-2/3 p-2"} flex flex-col items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`}>
        <div className={`text-center ${type === "large" ? "space-y-2" : ""}`}>
           <span className={`block text-gray-400 uppercase tracking-widest ${type === "large" ? "text-sm" : "text-[8px]"}`}>
             Ticket Number
           </span>
           <span className={`block font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 ${type === "large" ? "text-6xl" : "text-2xl"}`}>
             {number || "XXXX"}
           </span>
           {type === "large" && <p className="text-yellow-500/80 text-xs mt-2">Win Laptop, Smartphone & More!</p>}
        </div>
      </div>
    </div>
  </div>
);

// --- Main Page ---

export default function RaffleDrawPage() {
  const { data: session } = useSession();
  
  // States
  const [activeTab, setActiveTab] = useState("auto");
  // লজিক আপডেট: টোটাল ৫০০০ ফিক্সড, নেক্সট এভেইলেবল ক্যালকুলেট হবে সোল্ডের ওপর ভিত্তি করে
  const [stats, setStats] = useState({ total: 5000, sold: 0, nextAvailable: 5001 });
  
  // Manual Selection States
  const [tickets, setTickets] = useState([]);
  // লজিক আপডেট: এখন আমরা _id এর বদলে ticketNumber স্টোর করব
  const [selectedNumbers, setSelectedNumbers] = useState([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Auto Buy States
  const [quantity, setQuantity] = useState(1);
  const [previewRange, setPreviewRange] = useState("");

  // ডাটা লোড করা
  useEffect(() => {
    fetchData();
  }, [page, activeTab]); 

  // প্রিভিউ রেঞ্জ ক্যালকুলেশন
  useEffect(() => {
    if (stats.nextAvailable) {
      // ১০,০০০ এর বেশি যেন না যায়
      const end = Math.min(10000, stats.nextAvailable + parseInt(quantity) - 1);
      setPreviewRange(`${stats.nextAvailable} - ${end}`);
    }
  }, [quantity, stats.nextAvailable]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ১. গ্রিডের ডাটা আনা (API এখন মিক্সড ডাটা দিবে)
      const res = await fetch(`/api/tickets?page=${page}`);
      const data = await res.json();
      setTickets(data.tickets || []);
      
      // ২. স্ট্যাটাস আপডেট করা
      setStats(prev => ({
          ...prev,
          sold: data.sold,
          // Next Available Logic: 5001 + Sold Count (সিকোয়েন্সিয়াল লজিক)
          nextAvailable: 5001 + data.sold 
      }));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  // লজিক আপডেট: সিলেকশন এখন নাম্বারের ভিত্তিতে হবে
  const toggleSelect = (ticketNumber, status) => {
    if (status === "sold") return;
    
    if (selectedNumbers.includes(ticketNumber)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== ticketNumber));
    } else {
      setSelectedNumbers([...selectedNumbers, ticketNumber]);
    }
  };

  const handleBuy = async (mode) => {
    let numbersToBuy = [];

    if (mode === 'auto') {
      // Auto Logic: nextAvailable থেকে শুরু করে quantity পর্যন্ত নাম্বার জেনারেট করা
      const start = stats.nextAvailable;
      for(let i=0; i<quantity; i++) {
          if(start + i <= 10000) numbersToBuy.push(start + i);
      }
      
      if(numbersToBuy.length === 0) return alert("No tickets available in this range!");

      if(!confirm(`Buy ${numbersToBuy.length} tickets (${numbersToBuy[0]} - ${numbersToBuy[numbersToBuy.length-1]})?`)) return;
    } 
    
    if (mode === 'manual') {
      if(selectedNumbers.length === 0) return alert("Please select at least one ticket.");
      numbersToBuy = selectedNumbers;
      
      if(!confirm(`Confirm purchase of ${selectedNumbers.length} tickets?`)) return;
    }

    // API Call (Logic Updated to send ticketNumbers)
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ticketNumbers: numbersToBuy, 
          email: session?.user?.email || "guest@user.com"
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("🎉 Purchase Successful!");
        setSelectedNumbers([]); // সিলেকশন ক্লিয়ার
        fetchData(); // ডাটা রিফ্রেশ
        // অটো মোডে থাকলে কোয়ান্টিটি রিসেট করতে পারো চাইলে
        if(mode === 'auto') setQuantity(1);
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* 1. Header & Back Button */}
      <div className="bg-slate-900/50 backdrop-blur border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
           <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
             <ArrowLeft size={18} /> <span className="text-sm font-medium">Back</span>
           </Link>
           <h1 className="text-lg font-bold text-yellow-500 uppercase tracking-widest">Raffle Draw 2025</h1>
           <div className="w-6"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-12">
        
        {/* 2. Hero Demo Ticket */}
        <div className="text-center space-y-6 animate-in slide-in-from-top-10 duration-700">
           <h2 className="text-3xl md:text-5xl font-bold text-white">Grab Your Lucky Chance!</h2>
           <p className="text-blue-200">Exclusive tickets for the 25th Silver Jubilee Celebration.</p>
           {/* ডেমো টিকেটে এখন প্রিভিউ বা ডিফল্ট কিছু দেখাবে */}
           <DemoTicket number={activeTab === 'auto' ? (previewRange || "WIN") : "SELECT"} type="large" />
        </div>

        {/* 3. Stats Cards */}
        <div className="grid grid-cols-3 gap-4 md:gap-8">
           <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl text-center shadow-lg">
              <Ticket className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-gray-400 uppercase">Total Tickets</div>
           </div>
           <div className="bg-slate-900 border border-yellow-500/30 p-6 rounded-2xl text-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-500/5"></div>
              <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{stats.total - stats.sold}</div>
              <div className="text-xs text-gray-400 uppercase">Remaining</div>
           </div>
           <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl text-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.sold}</div>
              <div className="text-xs text-gray-400 uppercase">Sold Out</div>
           </div>
        </div>

        {/* 4. Purchase Section (Tabs) */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
           
           {/* Tabs */}
           <div className="flex border-b border-slate-800">
              <button 
                onClick={() => setActiveTab('auto')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                  ${activeTab === 'auto' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:bg-slate-800'}
                `}
              >
                <Zap size={16} /> Quick Auto Buy
              </button>
              <button 
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                  ${activeTab === 'manual' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:bg-slate-800'}
                `}
              >
                <Grid size={16} /> Choose Manually
              </button>
           </div>

           {/* Tab Content */}
           <div className="p-8">
              
              {/* --- AUTO BUY MODE --- */}
              {activeTab === 'auto' && (
                <div className="flex flex-col md:flex-row items-center gap-10 animate-in fade-in zoom-in duration-300">
                   
                   {/* Left: Input */}
                   <div className="w-full md:w-1/2 space-y-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">How many tickets do you want?</label>
                        <div className="flex items-center gap-4">
                           <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 bg-slate-800 rounded-lg text-xl font-bold hover:bg-slate-700">-</button>
                           <input 
                             type="number" 
                             value={quantity}
                             onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                             className="w-full h-12 bg-slate-950 border border-slate-700 rounded-lg text-center text-xl font-bold focus:border-yellow-500 outline-none"
                           />
                           <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 bg-slate-800 rounded-lg text-xl font-bold hover:bg-slate-700">+</button>
                        </div>
                      </div>
                      <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-sm text-blue-200">
                          💡 System will automatically assign the next available numbers for you. Fast & Easy!
                      </div>
                      <button 
                          onClick={() => handleBuy('auto')}
                          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
                      >
                          Buy Now
                      </button>
                   </div>

                   {/* Right: Dynamic Preview */}
                   <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Your Ticket Preview</p>
                      <DemoTicket number={previewRange || "..."} type="small" />
                      <div className="mt-4 text-center">
                         <p className="text-sm text-gray-400">You will receive numbers:</p>
                         <p className="text-xl font-bold text-yellow-500">{previewRange}</p>
                      </div>
                   </div>
                </div>
              )}

              {/* --- MANUAL MODE --- */}
              {activeTab === 'manual' && (
                <div className="animate-in fade-in zoom-in duration-300">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Select Your Numbers</h3>
                      
                      {/* Pagination: 50 Tickets Per Page */}
                      <div className="flex items-center gap-2">
                         <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page===1} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 text-xs">Prev</button>
                         <span className="text-xs text-gray-400">Page {page} ({(page-1)*50 + 5001} - {page*50 + 5000})</span>
                         <button onClick={() => setPage(page + 1)} disabled={(page*50 + 5000) >= 10000} className="px-3 py-1 bg-slate-800 rounded text-xs disabled:opacity-50">Next</button>
                      </div>
                   </div>

                   {/* Grid - Logic Updated for Numbers */}
                   {loading ? (
                     <div className="text-center py-20 text-gray-500 animate-pulse">Loading Seat Plan...</div>
                   ) : (
                     <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                        {tickets.map((t) => (
                          <button
                            key={t.ticketNumber} // Unique key হিসেবে এখন নাম্বার ব্যবহার হচ্ছে
                            onClick={() => toggleSelect(t.ticketNumber, t.status)}
                            disabled={t.status === "sold"}
                            className={`
                              relative p-2 h-12 rounded-lg text-xs font-bold transition-all duration-200 border
                              ${t.status === "sold" 
                                ? "bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed" 
                                : selectedNumbers.includes(t.ticketNumber) 
                                  ? "bg-yellow-500 text-slate-900 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] transform scale-110 z-10" 
                                  : "bg-slate-900 text-gray-400 border-slate-700 hover:border-yellow-500 hover:text-white"}
                            `}
                          >
                            {t.ticketNumber}
                          </button>
                        ))}
                     </div>
                   )}

                   {/* Sticky Footer for Manual Mode */}
                   {selectedNumbers.length > 0 && (
                      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur border border-yellow-500 p-4 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
                         <div className="pl-4">
                            <span className="text-xs text-gray-400 uppercase block">Selected</span>
                            <span className="text-xl font-bold text-white">{selectedNumbers.length} Tickets</span>
                         </div>
                         <button 
                           onClick={() => handleBuy('manual')}
                           className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full"
                         >
                           Confirm Buy
                         </button>
                      </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}