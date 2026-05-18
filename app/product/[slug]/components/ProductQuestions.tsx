"use client";

import React, { useState, useEffect } from "react";

interface Review { id: number; parent?: number; date_created: string; review: string; rating: number; reviewer: string; }

export default function ProductQuestions({ productId }: { productId: number }) {
  const [questions, setQuestions] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Review[]>([]);
  const [newQuestion, setNewQuestion] = useState({ name: "", email: "", question: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const res = await fetch(`/api/reviews?product=${productId}&_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data: Review[] = await res.json();
        setQuestions(data.filter((q) => (!q.parent || Number(q.parent) === 0) && q.review.includes("[SORU]")));
        setReplies(data.filter((r) => r.parent && Number(r.parent) > 0));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: productId, reviewer: newQuestion.name, reviewer_email: newQuestion.email, review: newQuestion.question, rating: 0, is_question: true }) });
      if (res.ok) {
        setSuccess("Sorunuz başarıyla iletildi!");
        setTimeout(() => { setNewQuestion({ name: "", email: "", question: "" }); setSuccess(""); load(); }, 3000);
      }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6 pt-3">
      <form onSubmit={send} className="p-4 sm:p-5 rounded-xl bg-[#050814]/40 border border-white/5 flex flex-col gap-3 sm:gap-4 shadow-inner">
        {success && <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs font-bold text-center text-emerald-400">{success}</div>}
        <textarea required value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} rows={3} className="w-full bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-3 text-sm focus:outline-none resize-none transition-colors focus:border-blue-500/50" placeholder="Ürünle ilgili sorunuzu yazın..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"><input required type="text" value={newQuestion.name} onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })} className="bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-3 text-sm focus:outline-none transition-colors focus:border-blue-500/50" placeholder="Adınız" /><input required type="email" value={newQuestion.email} onChange={(e) => setNewQuestion({ ...newQuestion, email: e.target.value })} className="bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-3 text-sm focus:outline-none transition-colors focus:border-blue-500/50" placeholder="E-Posta Adresiniz" /></div>
        <button type="submit" disabled={submitting} className="bg-white/5 border border-white/10 text-white font-black px-6 py-3 rounded-lg text-xs uppercase tracking-widest sm:self-end hover:bg-blue-600 hover:border-blue-500 transition-all disabled:opacity-50 mt-1">{submitting ? "İletiliyor..." : "Soruyu Gönder"}</button>
      </form>

      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q) => {
            const cleanText = q.review.replace("[SORU]", "").trim();
            const qReplies = replies.filter((r) => Number(r.parent) === Number(q.id));
            return (
              <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-[#050814]/20 border border-white/5 flex flex-col gap-2 sm:gap-3 hover:border-white/10 transition-colors">
                <div>
                  <span className="text-blue-400 font-bold block mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm"><span className="text-sm">❓</span> Müşteri Sorusu ({q.reviewer})</span>
                  {/* 🚀 MOBİLDE GİRİNTİ AZALTILDI: Yazılar ferahladı */}
                  <div className="text-slate-200 mt-2 pl-3 sm:pl-4 border-l-2 border-blue-500/40 py-1 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: cleanText }} />
                </div>
                {qReplies.length > 0 ? (
                  qReplies.map((reply) => (
                    <div key={reply.id} className="bg-emerald-500/10 border border-emerald-500/20 p-3 sm:p-4 rounded-lg ml-0 sm:ml-4 shadow-inner relative overflow-hidden mt-3 sm:mt-2">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50"></div>
                      <div className="text-[10px] sm:text-xs text-emerald-400 font-black uppercase mb-1.5 flex items-center gap-1.5"><span className="text-sm">👨‍💻</span> Mağaza Yetkilisi Cevabı</div>
                      <div className="text-slate-300 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: reply.review }} />
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] sm:text-xs text-slate-500 font-bold italic ml-0 sm:ml-4 mt-2 flex items-center gap-1">⚙️ Mağaza yetkilisinin onayı ve cevabı bekleniyor...</div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs border border-white/5 border-dashed rounded-xl bg-[#050814]/20">Henüz soru sorulmamış. İlk soruyu siz sorun!</div>
        )}
      </div>
    </div>
  );
}