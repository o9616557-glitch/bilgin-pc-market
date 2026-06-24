"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingCart, LayoutDashboard, LogOut, 
  Trash2, Edit, Plus, Truck, AlertCircle, CheckCircle2, 
  Search, X, Save, Crown, MessageSquare, Image as ImageIcon,
  Loader2,
  Clock,
  User,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPaneli() {
  // 👑 1. GÜVENLİK DUVARI: GOOGLE VIP KONTROLÜ
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const ADMIN_EMAIL = "o9616557@gmail.com"; 

  useEffect(() => {
    if (status !== "loading") {
      if (!session || session?.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/"); 
      }
    }
  }, [session, status, router]);

  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [aktifSekme, setAktifSekme] = useState<"siparisler" | "urunler">("siparisler");
  const [yukleniyor, setYukleniyor] = useState(true);

  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [silinecekSiparisID, setSilinecekSiparisID] = useState<string | null>(null);
  const [kargoBekleyenID, setKargoBekleyenID] = useState<string | null>(null);

  const [urunler, setUrunler] = useState<any[]>([]);
  const [duzenlenenUrun, setDuzenlenenUrun] = useState<any | null>(null);
  const [yeniUrunModu, setYeniUrunModu] = useState(false);

  const [formIsim, setFormIsim] = useState("");
  const [formFiyat, setFormFiyat] = useState("");
  const [formIndirimliFiyat, setFormIndirimliFiyat] = useState(""); 
  const [formHavaleIndirimi, setFormHavaleIndirimi] = useState("5"); 
  const [formStok, setFormStok] = useState("Stokta Var");
  const [formStokAdedi, setFormStokAdedi] = useState(""); 
  const [formResim, setFormResim] = useState("");
  const [formKategori, setFormKategori] = useState("Bilgisayar");

  const PATRON_SIFRESI = "Bilgin123";

  useEffect(() => {
    const patronGirdiMi = sessionStorage.getItem("patronGiris");
    if (patronGirdiMi === "basarili") {
      setGirisYapildi(true);
      verileriYukle();
    } else {
      setYukleniyor(false);
    }
  }, []);

  const verileriYukle = async () => {
    setYukleniyor(true);
    await siparisleriGetir();
    await urunleriGetir();
    setYukleniyor(false);
  };

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault();
    if (sifre === PATRON_SIFRESI) {
      sessionStorage.setItem("patronGiris", "basarili"); 
      setGirisYapildi(true);
      verileriYukle();
      toast.success("Komuta Merkezine Hoş Geldiniz!");
    } else {
      toast.error("Hatalı Şifre!");
    }
  };

  const cikisYap = () => { 
    sessionStorage.removeItem("patronGiris"); 
    setGirisYapildi(false); 
    toast.success("Sistemden çıkış yapıldı.");
  };

  const siparisleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/siparisler?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      const data = await res.json();
      if (data.success) setSiparisler(data.siparisler);
    } catch (e) {}
  };

  const durumGuncelle = async (id: string, yeniDurum: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, yeniDurum }) });
      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, durum: yeniDurum } : s));
        toast.success("Sipariş durumu güncellendi!");
      }
    } catch (e) { toast.error("Durum güncellenemedi."); }
  };

  const mesajGuncelle = async (id: string, musteriMesaji: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, musteriMesaji }) });
      if ((await res.json()).success) toast.success("Mesaj müşteriye iletildi!");
    } catch (e) { toast.error("Mesaj iletilemedi."); }
  };

  const kargoGuncelle = async (id: string, kargoFirmasi: string, takipNo: string, durumuGuncelle: boolean) => {
    try {
      const gonderilecekVeri: any = { id, kargoFirmasi, takipNo };
      if (durumuGuncelle) gonderilecekVeri.yeniDurum = "Kargoya Verildi";

      const res = await fetch("/api/admin/siparisler", { 
        method: "PUT", 
        headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, 
        body: JSON.stringify(gonderilecekVeri) 
      });
      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, kargoFirmasi, takipNo, durum: durumuGuncelle ? "Kargoya Verildi" : s.durum } : s));
        setKargoBekleyenID(null); 
        toast.success(durumuGuncelle ? "Kargo Girildi ve Müşteriye Bildirildi!" : "Kargo Bilgileri Güncellendi!");
      }
    } catch (e) {
      toast.error("Kargo kaydedilemedi.");
    }
  };

  const siparisSilmeIslemi = async () => {
    if (!silinecekSiparisID) return;
    try {
      const res = await fetch(`/api/admin/siparisler?id=${silinecekSiparisID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setSiparisler(siparisler.filter(s => s._id !== silinecekSiparisID));
        setSilinecekSiparisID(null);
        toast.success("Sipariş kalıcı olarak silindi!");
      }
    } catch (e) { toast.error("Silinemedi."); }
  };

  const urunleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/products?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      const data = await res.json();
      if (data.success) setUrunler(data.urunler);
    } catch (e) {}
  };

  const urunKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gonderilecekVeri: any = {
        isim: formIsim, fiyat: formFiyat, indirimliFiyat: formIndirimliFiyat, havaleIndirimi: formHavaleIndirimi, stokDurumu: formStok, stokAdedi: formStokAdedi, resim: formResim, kategori: formKategori
      };
      if (duzenlenenUrun) gonderilecekVeri.id = duzenlenenUrun._id;

      const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(gonderilecekVeri) });
      if ((await res.json()).success) {
        toast.success(duzenlenenUrun ? "Ürün güncellendi!" : "Yeni ürün eklendi!");
        formuKapat();
        urunleriGetir();
      }
    } catch (e) { toast.error("Hata oluştu."); }
  };

  const urunSilmeIslemi = async (id: string) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin şefim?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setUrunler(urunler.filter(u => u._id !== id));
        toast.success("Ürün silindi!");
      }
    } catch (e) { toast.error("Silinemedi."); }
  };

  const urunDuzenleModunuAc = (urun: any) => {
    setDuzenlenenUrun(urun);
    setFormIsim(urun.isim || urun.name || "");
    const orjFiyat = urun.regular_price || urun.fiyat || urun.price || 0;
    setFormFiyat(orjFiyat.toString());
    setFormIndirimliFiyat(urun.indirimliFiyat ? urun.indirimliFiyat.toString() : ""); 
    setFormHavaleIndirimi(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi.toString() : "5");
    setFormStok(urun.stokDurumu || "Stokta Var");
    const temizAdet = (urun.stokAdedi !== null && urun.stokAdedi !== undefined && urun.stokAdedi !== "" && Number(urun.stokAdedi) !== 10) ? urun.stokAdedi.toString() : "";
    setFormStokAdedi(temizAdet);
    setFormResim(urun.resim || "");
    setFormKategori(urun.kategori || "Bilgisayar");
    setYeniUrunModu(true);
  };

  const yeniUrunModunuAc = () => {
    setDuzenlenenUrun(null);
    setFormIsim(""); setFormFiyat(""); setFormIndirimliFiyat(""); setFormHavaleIndirimi("5"); setFormStok("Stokta Var"); setFormStokAdedi(""); setFormResim(""); setFormKategori("Bilgisayar");
    setYeniUrunModu(true);
  };

  const formuKapat = () => {
    setYeniUrunModu(false);
    setDuzenlenenUrun(null);
  };

  const durumRengi = (durum: string) => {
    if (!durum) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    if (durum === "Ödendi / Hazırlanıyor" || durum.includes("Başarılı")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"; 
    if (durum === "Kargoya Verildi") return "text-blue-400 bg-blue-400/10 border-blue-400/20"; 
    if (durum === "İptal Edildi") return "text-rose-400 bg-rose-400/10 border-rose-400/20"; 
    return "text-amber-400 bg-amber-400/10 border-amber-400/20"; 
  };

  if (status === "loading" || (yukleniyor && !girisYapildi)) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>
        <p className="mt-6 text-indigo-400 font-bold uppercase tracking-widest text-sm animate-pulse">Güvenlik Duvarı Geçiliyor...</p>
      </div>
    );
  }

  // 🔒 ŞİFRE EKRANI (VIP KAPI)
  if (!girisYapildi) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-600 blur-[250px] opacity-10 pointer-events-none rounded-full"></div>
        
        <form onSubmit={girisYap} className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 sm:p-10 w-full max-w-md flex flex-col items-center shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-[#020617] border border-rose-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(225,29,72,0.2)]">
            <Crown className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Komuta Merkezi</h2>
          <p className="text-slate-400 text-sm mb-8 text-center font-medium">Lütfen yönetici şifrenizi girerek kimliğinizi doğrulayın.</p>
          
          <input 
            type="password" 
            value={sifre} 
            onChange={(e) => setSifre(e.target.value)} 
            placeholder="Yönetici Şifresi" 
            className="w-full bg-[#020617] border border-slate-800 focus:border-rose-500/50 rounded-xl px-5 py-4 text-white text-center tracking-widest focus:outline-none transition-all mb-6" 
            required 
          />
          <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all">
            KİLİDİ AÇ
          </button>
        </form>
      </div>
    );
  }

  // 🚀 ANA KONTROL PANELİ
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* ⬅️ SOL MENÜ (SIDEBAR) */}
      <div className="w-full md:w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0 h-auto md:h-screen sticky top-0 z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-white tracking-widest text-sm uppercase">Bilgin PC</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider">Yönetim Katı</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button onClick={() => setAktifSekme("siparisler")} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${aktifSekme === "siparisler" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner" : "text-slate-400 hover:bg-[#020617] hover:text-white border border-transparent"}`}>
            <ShoppingCart className="w-5 h-5" /> Siparişler <span className="ml-auto bg-[#020617] px-2 py-0.5 rounded text-[10px] border border-slate-800">{siparisler.length}</span>
          </button>
          
          <button onClick={() => setAktifSekme("urunler")} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${aktifSekme === "urunler" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner" : "text-slate-400 hover:bg-[#020617] hover:text-white border border-transparent"}`}>
            <Package className="w-5 h-5" /> Ürünler <span className="ml-auto bg-[#020617] px-2 py-0.5 rounded text-[10px] border border-slate-800">{urunler.length}</span>
          </button>
{/* 🚀 YUMUŞAK GEÇİŞ MOTORU: Sayfayı yenilemeden fişek gibi diğer sayfaya geçer */}
          <button onClick={() => router.push("/admin/reviews")} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-[#020617] hover:text-white border border-transparent transition-all">
            <MessageSquare className="w-5 h-5" /> Yorumlar
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <button onClick={cikisYap} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#020617] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 font-black uppercase tracking-widest text-xs transition-all shadow-md">
            <LogOut className="w-4 h-4" /> Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* ➡️ SAĞ İÇERİK ALANI */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020617] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600 blur-[200px] opacity-[0.03] pointer-events-none rounded-full"></div>
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          
          {/* ÜST BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {aktifSekme === "siparisler" ? "Sipariş Yönetimi" : "Envanter ve Ürünler"}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {aktifSekme === "siparisler" ? "Müşteri siparişlerini, kargo durumlarını ve ödemeleri buradan yönetin." : "Mağazadaki donanımları, stokları ve fiyatları güncelleyin."}
              </p>
            </div>

            {aktifSekme === "urunler" && (
              <button onClick={yeniUrunModunuAc} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0">
                <Plus className="w-4 h-4" /> Yeni Ürün Ekle
              </button>
            )}
          </div>

          {yukleniyor ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="font-black text-indigo-400 uppercase tracking-widest">Veriler Çekiliyor...</p>
            </div>
          ) : aktifSekme === "siparisler" ? (
            
            /* 📦 SİPARİŞLER LİSTESİ */
            <div className="flex flex-col gap-6">
              {siparisler.map((siparis) => (
                <div key={siparis._id} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6 transition-all hover:border-indigo-500/30">
                  
                  {/* BAŞLIK & DURUM */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800/80 pb-5">
                    <div>
                      <div className="text-xl font-black text-white tracking-tight mb-1">{siparis.siparisKodu}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> {new Date(siparis.tarih).toLocaleString("tr-TR")}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-black uppercase tracking-widest text-[10px] ${durumRengi(siparis.durum)}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <select 
                          onChange={(e) => {
                            if (e.target.value === "Kargoya Verildi") {
                              setKargoBekleyenID(siparis._id);
                            } else {
                              durumGuncelle(siparis._id, e.target.value);
                              if (kargoBekleyenID === siparis._id) setKargoBekleyenID(null);
                            }
                          }} 
                          value={kargoBekleyenID === siparis._id ? "kargo_bekleniyor" : siparis.durum} 
                          className="bg-transparent border-none outline-none cursor-pointer appearance-none"
                        >
                          <option value="Ödeme Bekliyor (Havale)" className="bg-[#0f172a] text-slate-300">Bekliyor (Havale)</option>
                          <option value="Ödendi / Hazırlanıyor" className="bg-[#0f172a] text-slate-300">Hazırlanıyor</option>
                          {kargoBekleyenID === siparis._id && <option value="kargo_bekleniyor" className="bg-[#0f172a] text-slate-300">Bilgiler Giriliyor...</option>}
                          <option value="Kargoya Verildi" className="bg-[#0f172a] text-slate-300">Kargoya Verildi</option>
                          <option value="Tamamlandı" className="bg-[#0f172a] text-slate-300">Tamamlandı</option>
                          <option value="İptal Edildi" className="bg-[#0f172a] text-slate-300">İptal Edildi</option>
                        </select>
                      </div>
                      <button onClick={() => setSilinecekSiparisID(siparis._id)} className="w-10 h-10 flex items-center justify-center bg-[#020617] border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 rounded-xl transition-all shadow-md" title="Siparişi Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* BİLGİ KARTLARI */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Müşteri */}
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2"><User className="w-4 h-4 text-indigo-400" /> Müşteri Bilgileri</div>
                      <div className="text-sm font-bold text-white mb-1">{siparis.musteri?.ad} {siparis.musteri?.soyad}</div>
                      <div className="text-xs text-slate-400 mb-1">{siparis.musteri?.telefon} • {siparis.musteri?.eposta}</div>
                      <div className="text-xs text-slate-400">{siparis.musteri?.adres ? `${siparis.musteri.adres}, ` : ""}{siparis.musteri?.ilce} / {siparis.musteri?.sehir}</div>
                    </div>

                    {/* Ödeme */}
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-2 w-full"><CreditCard className="w-4 h-4 text-emerald-400" /> Ödeme Özeti</div>
                      <div className="text-xs font-bold text-slate-400 bg-slate-800/50 px-3 py-1 rounded-lg mb-2 uppercase tracking-wider">{siparis.odemeYontemi === "kart" ? "Kredi Kartı" : "Havale / EFT"}</div>
                      <div className="text-2xl font-black text-emerald-400">{Number((siparis.toplamTutar) || (siparis.Tutar) || 0).toLocaleString("tr-TR")} <span className="text-sm">TL</span></div>
                    </div>

                    {/* Ürünler */}
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800 max-h-[160px] overflow-y-auto custom-scrollbar">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2 sticky top-0 bg-[#020617] pb-2"><Package className="w-4 h-4 text-cyan-400" /> Sipariş İçeriği</div>
                      <div className="flex flex-col gap-3">
                        {siparis.sepet?.map((urun: any, i: number) => (
                          <div key={i} className="flex flex-col border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                            <div className="text-xs font-bold text-slate-200 line-clamp-1"><span className="text-indigo-400 mr-1">{urun.adet}x</span>{urun.isim || urun.name}</div>
                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {urun.id || urun._id || "Tanımsız"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* NOTLAR VE KARGO */}
                  <div className="flex flex-col lg:flex-row gap-4 border-t border-slate-800/80 pt-5">
                    
                    <div className="flex-1 flex flex-col gap-3">
                      {siparis.siparisNotu && siparis.siparisNotu !== "Not eklenmemiş" && (
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                          <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Müşterinin Sipariş Notu</div>
                          <div className="text-sm text-slate-300 font-medium italic">"{siparis.siparisNotu}"</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 ml-1">Müşteri Takip Ekranına Mesaj Bırak</div>
                        <input type="text" defaultValue={siparis.musteriMesaji || ""} onBlur={(e) => mesajGuncelle(siparis._id, e.target.value)} placeholder="Müşteriye iletilecek notu yazıp boşluğa tıklayın..." className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                      </div>
                    </div>

                    {(siparis.durum === "Kargoya Verildi" || kargoBekleyenID === siparis._id) && (
                      <div className="flex-1 bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 flex flex-col justify-center">
                        <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Truck className="w-4 h-4" /> Kargo Takip Bilgileri</div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input id={`firma-${siparis._id}`} defaultValue={siparis.kargoFirmasi || ""} placeholder="Firma (Örn: Yurtiçi)" className="flex-1 bg-[#020617] border border-blue-500/30 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                          <input id={`takip-${siparis._id}`} defaultValue={siparis.takipNo || ""} placeholder="Takip Numarası" className="flex-[2] bg-[#020617] border border-blue-500/30 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none tracking-widest transition-colors" />
                        </div>
                        <button 
                          onClick={() => {
                            const f = (document.getElementById(`firma-${siparis._id}`) as HTMLInputElement).value;
                            const t = (document.getElementById(`takip-${siparis._id}`) as HTMLInputElement).value;
                            if(!f || !t) return toast.error("Şefim, Firma ve Takip Numarası boş olamaz!");
                            kargoGuncelle(siparis._id, f, t, kargoBekleyenID === siparis._id);
                          }} 
                          className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        >
                          {kargoBekleyenID === siparis._id ? "KAYDET VE BİLDİR" : "GÜNCELLE"}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          ) : (
            
            /* 💻 ÜRÜNLER LİSTESİ */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {urunler.map((urun) => {
                const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
                const indirimliFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : null;
                const gosterilenFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;
                const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
                const gosterilecekDurum = (urun.stokDurumu === "Tükendi" || stokSifirMi) ? "Tükendi" : "Stokta Var";
                const adetGosterilecekMi = urun.stokAdedi !== null && urun.stokAdedi !== undefined && urun.stokAdedi !== "" && Number(urun.stokAdedi) !== 10 && Number(urun.stokAdedi) > 0;

                return (
                  <div key={urun._id} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.05)] group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                          <span className="bg-[#020617] border border-slate-800 text-indigo-400 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg w-fit">{urun.kategori || "Genel"}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${gosterilecekDurum === "Tükendi" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${gosterilecekDurum === "Tükendi" ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`}></span>
                            {gosterilecekDurum}
                          </div>
                          {adetGosterilecekMi && <span className="text-[10px] text-slate-500 font-bold">{urun.stokAdedi} Adet</span>}
                        </div>
                      </div>
                      
                      <div className="text-sm font-bold text-slate-200 leading-snug mb-4 line-clamp-2 min-h-[40px] group-hover:text-white transition-colors">{urun.isim || urun.name}</div>

                      <div className="bg-[#020617] border border-slate-800 rounded-xl p-4 mb-5">
                        {indirimliFiyat ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 line-through decoration-rose-500/50 mb-0.5">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                            <span className="text-xl font-black text-indigo-400">{gosterilenFiyat.toLocaleString("tr-TR")} <span className="text-sm text-slate-500 font-bold">TL</span></span>
                          </div>
                        ) : (
                          <div className="text-xl font-black text-indigo-400">{gosterilenFiyat.toLocaleString("tr-TR")} <span className="text-sm text-slate-500 font-bold">TL</span></div>
                        )}
                        <div className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-wider">Havale İndirimi: <span className="text-white">%{(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5)}</span></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button onClick={() => urunDuzenleModunuAc(urun)} className="flex-1 flex justify-center items-center gap-2 bg-[#020617] border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <Edit className="w-3.5 h-3.5" /> Düzenle
                      </button>
                      <button onClick={() => urunSilmeIslemi(urun._id)} className="flex-1 flex justify-center items-center gap-2 bg-[#020617] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md">
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* 🚀 YENİ ÜRÜN / DÜZENLEME MODALI */}
      {yeniUrunModu && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={urunKaydet} className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Package className="w-6 h-6 text-indigo-400" /> {duzenlenenUrun ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button type="button" onClick={formuKapat} className="text-slate-500 hover:text-white bg-[#020617] p-1.5 rounded-xl border border-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Ürün Adı</label>
                <input type="text" value={formIsim} onChange={(e) => setFormIsim(e.target.value)} required className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Normal Fiyat (TL)</label>
                  <input type="number" value={formFiyat} onChange={(e) => setFormFiyat(e.target.value)} required className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">İndirimli Fiyat (TL)</label>
                  <input type="number" value={formIndirimliFiyat} onChange={(e) => setFormIndirimliFiyat(e.target.value)} placeholder="İsteğe bağlı" className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Stok Adedi</label>
                  <input type="number" value={formStokAdedi} onChange={(e) => setFormStokAdedi(e.target.value)} placeholder="Boş = Sınırsız" className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Havale İndirimi (%)</label>
                  <input type="number" value={formHavaleIndirimi} onChange={(e) => setFormHavaleIndirimi(e.target.value)} min="0" max="100" className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Stok Durumu</label>
                  <select value={formStok} onChange={(e) => setFormStok(e.target.value)} className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors appearance-none">
                    <option value="Stokta Var">Stokta Var</option>
                    <option value="Tükendi">Tükendi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                  <input type="text" value={formKategori} onChange={(e) => setFormKategori(e.target.value)} className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Resim URL Yolu</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input type="text" value={formResim} onChange={(e) => setFormResim(e.target.value)} placeholder="https://..." className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800/80">
                <button type="button" onClick={formuKapat} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800 text-slate-300 font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all">İptal</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex justify-center items-center gap-2">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      {silinecekSiparisID && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-5 bg-red-500/10 relative z-10"><Trash2 className="w-7 h-7 text-red-400 animate-pulse" /></div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10">Siparişi Sil</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed relative z-10">Bu siparişi kalıcı olarak silmek istediğinize emin misiniz?<span className="block text-red-400 font-bold mt-2">Bu işlem geri alınamaz!</span></p>
            <div className="flex w-full gap-3 relative z-10">
              <button onClick={() => setSilinecekSiparisID(null)} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
              <button onClick={siparisSilmeIslemi} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]">Evet, Sil</button>
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