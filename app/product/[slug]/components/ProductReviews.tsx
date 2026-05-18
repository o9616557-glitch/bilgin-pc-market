"use client";

import React, { useState, useEffect } from "react";

interface Review { id: number; parent_id: number; date_created: string; review: string; rating: number; reviewer: string; }

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ reviewer: "", email: "", review: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const res = await fetch(`/api/reviews?product=${productId}`);
      if (res.ok) {
        const data: Review[] = await res.json();
        setReviews(data.filter((r) => Number(r.parent_id) === 0 && !r.review.includes("[SORU]")));
        setReplies(data.filter((r) => Number(r.parent_id) > 0));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: productId, ...newReview, is_question: false }) });
      if (res.ok) {
        setSuccess("Yorumunuz iletildi şefim! Onaylanınca görünecektir.");
        setTimeout(() => { setShowForm(false); setNewReview({ reviewer: "", email: "", review: "", rating: 5 }); setSuccess(""); load(); }, 3000);
      }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6 pt-3">
      
      {!showForm ? (
        // 🚀 DÜMDÜZ YAZI YERİNE MODERN İSTATİSTİK ROZETİ (BADGE) VE PREMIUM BUTON
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 rounded-xl bg-[#050814]/40 border border-white/5 shadow-inner">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <span className="text-xl">⭐</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-slate-100">
                {reviews.length} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Değerlendirme</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">Gerçek müşteri deneyimleri</span>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-lg text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            Yorum Yap & Puanla
          </button>
        </div>
      ) : (
        <form onSubmit={send} className="p-5 rounded-xl bg-[#0b1329] border border-blue-500/30 flex flex-col gap-4 shadow-[0_0_20px_rgba(37,99,235,0.05)]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-blue-400 font-black text-xs uppercase tracking-widest">Deneyiminizi Yazın</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
          </div>

          {success && <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-bold text-center text-blue-400">{success}</div>}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Puan Verin</label>
            <div className="flex items-center gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className={`text-2xl transition-all hover:scale-110 ${star <= newReview.rating ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-slate-600 hover:text-amber-400/50'}`}>★</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required type="text" value={newReview.reviewer} onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Adınız Soyadınız" />
            <input required type="email" value={newReview.email} onChange={(e) => setNewReview({ ...newReview, email: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="E-posta Adresiniz" />
          </div>
          
          <textarea required value={newReview.review} onChange={(e) => setNewReview({ ...newReview, review: e.target.value })} rows={4} className="w-full bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-500/50 resize-none transition-colors" placeholder="Ürün yorumunuzu detaylıca buraya yazın..." />
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-lg text-xs uppercase tracking-widest sm:self-end transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
          </button>
        </form>
      )}

      <div className="space-y-4 mt-4">
        {reviews.length > 0 ? (
          reviews.map((r) => {
            const rReplies = replies.filter((rep) => Number(rep.parent_id) === Number(r.id));
            return (
              <div key={r.id} className="p-5 rounded-xl bg-[#050814]/40 border border-white/5 space-y-4 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs uppercase border border-blue-500/20">
                      {r.reviewer.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-200">{r.reviewer}</span>
                      <span className="text-[9px] text-slate-500">{new Date(r.date_created).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 text-sm drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '★' : '☆'}</span>)}
                  </div>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed pl-11" dangerouslySetInnerHTML={{ __html: r.review }} />
                
                {rReplies.map((rep) => (
                  <div key={rep.id} className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-lg ml-11 mt-3 text-xs relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50"></div>
                    <div className="text-[10px] text-blue-400 font-black uppercase mb-1.5 flex items-center gap-1.5">
                      <span className="text-sm">👨‍💻</span> Mağaza Yetkilisi Yanıtı
                    </div>
                    <div className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: rep.review }} />
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          !showForm && <div className="text-center py-8 text-slate-500 text-xs border border-white/5 border-dashed rounded-xl bg-[#050814]/20">Bu ürüne henüz yorum yapılmamış. İlk değerlendiren sen ol!</div>
        )}
      </div>
    </div>
  );
}