"use client";
import { useState } from "react";

export default function Admin() {
  const [range, setRange] = useState({ start: "", end: "" });
  const [msg, setMsg] = useState("");

  const submitOffline = async () => {
    const res = await fetch("/api/admin/offline-entry", {
      method: "POST",
      body: JSON.stringify({ startRange: range.start, endRange: range.end }),
    });
    const data = await res.json();
    if(data.success) setMsg(`Success! ${data.count} tickets added.`);
    else setMsg("Error: " + data.message);
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Offline Ticket Entry</h1>
      <div className="space-y-4">
        <input 
          placeholder="Start (e.g. 1001)" 
          className="border p-2 w-full"
          onChange={(e) => setRange({...range, start: e.target.value})}
        />
        <input 
          placeholder="End (e.g. 1050)" 
          className="border p-2 w-full"
          onChange={(e) => setRange({...range, end: e.target.value})}
        />
        <button onClick={submitOffline} className="bg-black text-white px-4 py-2 rounded">
          Add to Database
        </button>
        {msg && <p className="mt-4 text-green-600">{msg}</p>}
      </div>
    </div>
  );
}