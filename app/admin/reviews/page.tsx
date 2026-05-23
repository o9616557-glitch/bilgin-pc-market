"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Trash2, MessageSquare, Star, HelpCircle, ArrowLeft, Loader2, Send
} from "lucide-react";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const GIZLI_ANAHTAR = "Bilgin123";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", { headers: { "x-patron-anahtar": GIZLI_ANAHTAR } });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (error) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-patron-anahtar": GIZLI_ANAHTAR },
        body: JSON.stringify({ id, onaylandi: !currentStatus })
      });
      if (res.ok) fetchData();
    } catch (error) {}
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-patron-anahtar": GIZLI_ANAHTAR },
        body: JSON.stringify({ id, answer: replyText, onaylandi: true })
      });
      if (res.ok) { setReplyId(null); setReplyText(""); fetchData(); }
    } catch (error) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Şefim bu yorumu kalıcı olarak çöpe atıyoruz, emin misin?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE", headers: { "x-patron-anahtar": GIZLI_ANAHTAR }
      });
      if (res.ok) fetchData();
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-[#00e5ff] mb-2 hover:underline">
              <ArrowLeft size={16} /> Panel'e Dön
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Yorum & Soru Yönetimi</h1>
          </div>
          <button onClick={fetchData} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/10">
            {loading ? <Loader2 className="animate-spin text-[#00e5ff]" /> : "🔄 Verileri Yenile"}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20"><Loader2 size={48} className="animate-spin text-[#00e5ff] mb-4" /></div>
        ) : data.length === 0 ? (
          <div className="bg-[#0b1329] border border-dashed border-white/10 rounded-3xl py-20 text-center text-slate-500 font-bold">Hiç yorum yok.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {data.map((item) => (
              <div key={item._id} className={`group relative bg-[#0b1329] border transition-all rounded-2xl p-5 ${item.onaylandi ? 'border-white/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {item.type === "question" ? (
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1"><HelpCircle size={10} /> SORU</span>
                      ) : (
                        <span className="bg-purple-500/10 text-purple-400 text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1"><Star size={10} /> YORUM</span>
                      )}
                      {!item.onaylandi && <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase animate-pulse">ONAY BEKLİYOR</span>}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-slate-300 text-sm italic mb-3">"{item.text}"</p>
                    {item.answer && (
                      <div className="bg-[#050814] p-3 rounded-xl border-l-4 border-[#00e5ff] text-xs text-[#00e5ff] mb-3">
                        <span className="font-black block mb-1">MAĞAZA CEVABI:</span>{item.answer}
                      </div>
                    )}
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <button onClick={() => handleToggleStatus(item._id, item.onaylandi)} className={`p-3 rounded-xl ${item.onaylandi ? 'bg-zinc-800 text-zinc-500' : 'bg-[#10b981] text-black'}`}>
                      {item.onaylandi ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                    </button>
                    {/* ŞEFİM: Mavi cevap butonu artık HEM SORU HEM YORUM için açık */}
                    <button onClick={() => { setReplyId(item._id); setReplyText(item.answer || ""); }} className="p-3 bg-blue-600 text-white rounded-xl">
                      <MessageSquare size={20} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {replyId === item._id && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Cevabınız..." className="flex-1 bg-[#050814] border border-white/10 rounded-xl p-3 text-sm text-white" rows={2} />
                      <button onClick={() => handleSendReply(item._id)} className="bg-[#00e5ff] text-black px-4 rounded-xl font-black uppercase text-xs flex items-center gap-2"><Send size={16} /> Gönder</button>
                      <button onClick={() => setReplyId(null)} className="bg-white/5 text-slate-400 px-4 rounded-xl font-bold text-xs">İptal</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}