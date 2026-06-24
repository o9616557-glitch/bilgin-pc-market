"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Trash2, MessageSquare, Star, 
  HelpCircle, ArrowLeft, Loader2, Send, X, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  // 👑 GÜVENLİK DUVARI
  const { data: session, status } = useSession();
  const router = useRouter();
  const ADMIN_EMAIL = "o9616557@gmail.com"; 

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [silinecekYorumID, setSilinecekYorumID] = useState<string | null>(null);

  const GIZLI_ANAHTAR = "Bilgin123";

  useEffect(() => {
    if (status !== "loading") {
      if (!session || session?.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/"); 
      } else {
        fetchData();
      }
    }
  }, [session, status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", { headers: { "x-patron-anahtar": GIZLI_ANAHTAR } });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (error) {
      toast.error("Veriler çekilirken hata oluştu.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-patron-anahtar": GIZLI_ANAHTAR },
        body: JSON.stringify({ id, onaylandi: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? "Yorum gizlendi." : "Yorum onaylandı!");
        fetchData();
      }
    } catch (error) { toast.error("Durum güncellenemedi."); }
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return toast.error("Şefim boş cevap gönderemeyiz!");
    const toastId = toast.loading("Cevap iletiliyor...");
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-patron-anahtar": GIZLI_ANAHTAR },
        body: JSON.stringify({ id, answer: replyText, onaylandi: true })
      });
      if (res.ok) { 
        setReplyId(null); 
        setReplyText(""); 
        toast.success("Cevabınız yayınlandı!", { id: toastId });
        fetchData(); 
      }
    } catch (error) { toast.error("Cevap iletilemedi.", { id: toastId }); }
  };

  const handleDelete = async () => {
    if (!silinecekYorumID) return;
    try {
      const res = await fetch(`/api/reviews?id=${silinecekYorumID}`, {
        method: "DELETE", headers: { "x-patron-anahtar": GIZLI_ANAHTAR }
      });
      if (res.ok) {
        setSilinecekYorumID(null);
        toast.success("Kalıcı olarak silindi!");
        fetchData();
      }
    } catch (error) { toast.error("Silinemedi."); }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>
        <p className="mt-6 text-indigo-400 font-bold uppercase tracking-widest text-sm animate-pulse">Güvenlik Duvarı Geçiliyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600 blur-[200px] opacity-[0.03] pointer-events-none rounded-full"></div>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-8 relative z-10">
        
        {/* ÜST BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-xs font-black uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Ana Panele Dön
            </Link>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-indigo-500" />
              Yorum & Soru Yönetimi
            </h1>
          </div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 border border-slate-800 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-slate-300 hover:text-white shadow-md">
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : "🔄 Verileri Yenile"}
          </button>
        </div>

        {/* İÇERİK */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="font-black text-indigo-400 uppercase tracking-widest">Yorumlar Çekiliyor...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl py-20 flex flex-col items-center justify-center text-center shadow-xl">
            <div className="w-20 h-20 bg-[#020617] rounded-full border border-slate-800 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Bekleyen Hiç Yorum veya Soru Yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {data.map((item) => (
              <div key={item._id} className={`group bg-[#0f172a] border transition-all rounded-2xl p-6 shadow-xl ${item.onaylandi ? 'border-slate-800 hover:border-indigo-500/30' : 'border-amber-500/30 bg-amber-500/5'}`}>
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      {item.type === "question" ? (
                        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase flex items-center gap-1.5"><HelpCircle size={12} /> SORU</span>
                      ) : (
                        <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase flex items-center gap-1.5"><Star size={12} /> YORUM</span>
                      )}
                      {!item.onaylandi && <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase animate-pulse flex items-center gap-1.5"><ShieldAlert size={12} /> ONAY BEKLİYOR</span>}
                    </div>
                    
                    <h3 className="text-white font-black text-lg mb-1">{item.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed italic mb-4">"{item.text}"</p>
                    
                    {item.answer && (
                      <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 text-sm text-indigo-200 mt-auto">
                        <span className="font-black block mb-1 text-indigo-400 text-[10px] uppercase tracking-widest">Mağaza Cevabı:</span>
                        {item.answer}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-3 justify-end md:justify-start border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0">
                    <button onClick={() => handleToggleStatus(item._id, item.onaylandi)} className={`flex items-center justify-center gap-2 p-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${item.onaylandi ? 'bg-[#020617] border border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`} title={item.onaylandi ? "Gizle" : "Onayla ve Yayınla"}>
                      {item.onaylandi ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                      <span className="hidden md:inline">{item.onaylandi ? "Gizle" : "Onayla"}</span>
                    </button>
                    
                    <button onClick={() => { setReplyId(replyId === item._id ? null : item._id); setReplyText(item.answer || ""); }} className="flex items-center justify-center gap-2 p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                      <MessageSquare size={16} /> <span className="hidden md:inline">Cevapla</span>
                    </button>
                    
                    <button onClick={() => setSilinecekYorumID(item._id)} className="flex items-center justify-center gap-2 p-3.5 bg-[#020617] border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest shadow-md">
                      <Trash2 size={16} /> <span className="hidden md:inline">Sil</span>
                    </button>
                  </div>

                </div>

                {/* CEVAPLAMA ALANI */}
                {replyId === item._id && (
                  <div className="mt-5 pt-5 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <textarea 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)} 
                        placeholder="Müşteriye cevabınızı yazın..." 
                        className="flex-1 bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl p-4 text-sm text-white focus:outline-none transition-colors min-h-[60px] resize-y custom-scrollbar" 
                      />
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button onClick={() => handleSendReply(item._id)} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                          <Send size={14} /> Gönder
                        </button>
                        <button onClick={() => setReplyId(null)} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800 text-slate-400 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center">
                          İptal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SİLME ONAY MODALI */}
      {silinecekYorumID && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-5 bg-red-500/10 relative z-10"><Trash2 className="w-7 h-7 text-red-400 animate-pulse" /></div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10">Yorumu Sil</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed relative z-10">Bu yorumu/soruyu kalıcı olarak çöpe atmak istediğinize emin misiniz?<span className="block text-red-400 font-bold mt-2">Bu işlem geri alınamaz!</span></p>
            <div className="flex w-full gap-3 relative z-10">
              <button onClick={() => setSilinecekYorumID(null)} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
              <button onClick={handleDelete} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
      `}</style>
    </div>
  );
}