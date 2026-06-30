"use client";

import { useState } from "react";
import { Database, Download, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VeriTalebiPage() {
  const [gonderiyor, setGonderiyor] = useState(false);
  const [gonderildi, setGonderildi] = useState(false);

  const handleTalep = async () => {
    setGonderiyor(true);
    await new Promise((r) => setTimeout(r, 1200));
    setGonderiyor(false);
    setGonderildi(true);
    toast.success("Veri talebiniz alındı. 30 gün içinde e-posta ile iletilecek.");
  };

  return (
    <div className="flex flex-col gap-5">
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-site-accent/80" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">Veri Talebi</h1>
              <p className="text-slate-400 text-xs sm:text-sm">KVKK kapsamında kişisel verilerinizi talep edin veya silin.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="account-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-site-accent" />
              <h2 className="text-sm font-semibold text-white">Verilerimi İndir</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hesabınıza ait tüm kişisel verilerin bir kopyasını e-posta adresinize göndeririz. İşlem 30 gün sürebilir.
            </p>
            {gonderildi ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" /> Talep alındı — e-postanızı kontrol edin
              </div>
            ) : (
              <button
                onClick={handleTalep}
                disabled={gonderiyor}
                className="mt-auto w-full py-2.5 rounded-xl bg-site-accent-strong/20 border border-site-accent/30 text-site-accent text-xs font-semibold hover:bg-site-accent-strong/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {gonderiyor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {gonderiyor ? "Gönderiliyor..." : "Veri Kopyası İste"}
              </button>
            )}
          </div>

          <div className="account-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-semibold text-white">Hesabımı Sil</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kişisel verilerinizin tamamını kalıcı olarak sileriz. Bu işlem geri alınamaz; yasal zorunlu kayıtlar saklanır.
            </p>
            <p className="text-[10px] text-slate-500">
              Hesap silme işlemi için <a href="/guvenlik" className="text-site-accent underline underline-offset-2">Güvenlik</a> sayfasını kullanın.
            </p>
          </div>
        </div>

        <div className="account-card rounded-2xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında haklarınızı kullanabilirsiniz. Talepleriniz en geç 30 gün içinde yanıtlanır.
          </p>
        </div>
      </div>
  );
}
