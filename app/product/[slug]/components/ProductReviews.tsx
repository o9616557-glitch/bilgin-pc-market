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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#050814]/50 border border-white/5">
          <p className="text-xs text-slate-400 font-bold">{reviews.length} Toplam Değerlendirme</p>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2.5 rounded-md text-xs uppercase tracking-wider transition-all">Yorum Yap</button>
        </div>
      ) : (
        <form onSubmit={send} className="p-4 rounded-xl bg-[#0b1329] border border-blue-500/30 flex flex-col gap-4">
          {success && <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-bold text-center text-blue-400">{success}</div>}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className={`text-xl ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-600'}`}>★</button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required type="text" value={newReview.reviewer} onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2 text-xs focus:outline-none" placeholder="Adınız Soyadınız" />
            <input required type="email" value={newReview.email} onChange={(e) => setNewReview({ ...newReview, email: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2 text-xs focus:outline-none" placeholder="E-posta" />
          </div>
          <textarea required value={newReview.review} onChange={(e) => setNewReview({ ...newReview, review: e.target.value })} rows={3} className="w-full bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none" placeholder="Ürün yorumunuz..." />
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white font-black px-6 py-2 rounded-md text-xs uppercase tracking-widest sm:self-end">{submitting ? "Gönderiliyor..." : "Yorumu Gönder"}</button>
        </form>
      )}
      <div className="space-y-4">
        {reviews.map((r) => {
          const rReplies = replies.filter((rep) => Number(rep.parent_id) === Number(r.id));
          return (
            <div key={r.id} className="p-4 rounded-xl bg-[#050814]/40 border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-slate-200 block">{r.reviewer}</span>
                <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '★' : '☆'}</span>)}
                </div>
              </div>
              <div className="text-slate-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: r.review }} />
              {rReplies.map((rep) => (
                <div key={rep.id} className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-lg ml-4 text-xs">
                  <div className="text-[10px] text-emerald-400 font-black uppercase mb-1">👨‍💻 Mağaza Yetkilisi Yanıtı</div>
                  <div className="text-slate-300" dangerouslySetInnerHTML={{ __html: rep.review }} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}