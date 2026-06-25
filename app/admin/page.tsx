"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingCart, LogOut, Trash2, Edit, Plus, Truck, 
  CheckCircle2, XCircle, MessageSquare, Save, Crown, 
  Star, HelpCircle, ShieldAlert, Clock, User, Headset, Send
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPaneli() {
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
const [girisYapildi, setGirisYapildi] = useState(true);
  const [aktifSekme, setAktifSekme] = useState<"siparisler" | "urunler" | "yorumlar" | "talepler">("siparisler");
  const [yukleniyor, setYukleniyor] = useState(true);

  // SİPARİŞ & GÜNCELLEME STATE'LERİ
  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [silinecekSiparisID, setSilinecekSiparisID] = useState<string | null>(null);
  const [guncellenenID, setGuncellenenID] = useState<string | null>(null); 

  // DESTEK TALEPLERİ STATE'LERİ (YENİ EKLENDİ) 🚀
  const [talepler, setTalepler] = useState<any[]>([]);
  const [talepCevaplari, setTalepCevaplari] = useState<{ [key: string]: string }>({});
  const [silinecekTalepID, setSilinecekTalepID] = useState<string | null>(null);

  // DİĞER STATELER
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
  
  const [yorumlar, setYorumlar] = useState<any[]>([]);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [silinecekYorumID, setSilinecekYorumID] = useState<string | null>(null);

  const PATRON_SIFRESI = "Bilgin123";
// 🚀 BİNGO: OTOMATİK AŞAĞI KAYDIRMA MOTORU
  useEffect(() => {
    const asagiKaydir = () => {
      // document tanımlı mı diye kontrol eder (Next.js hata vermesin diye)
      if (typeof document !== 'undefined') {
        const kutular = document.querySelectorAll('.admin-sohbet-kutusu');
        kutular.forEach((kutu) => {
          kutu.scrollTop = kutu.scrollHeight; 
        });
      }
    };
    
    // Mesajın ekrana gelme süresine karşı 2 kere garanti vuruş yapar
    setTimeout(asagiKaydir, 100);
    setTimeout(asagiKaydir, 500);
  }, [talepler]);
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
    await yorumlariGetir();
    await talepleriGetir(); // Yeni Destek Sistemi
    setYukleniyor(false);
  };

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault();
    if (sifre === PATRON_SIFRESI) {
      sessionStorage.setItem("patronGiris", "basarili"); 
      setGirisYapildi(true);
      verileriYukle();
      toast.success("Yönetim Katına Giriş Yapıldı.");
    } else {
      toast.error("Hatalı Şifre!");
    }
  };

  const cikisYap = () => { sessionStorage.removeItem("patronGiris"); setGirisYapildi(false); };

  // --- SİPARİŞ İŞLEMLERİ ---
  const siparisGuncelle = async (siparisId: string) => {
    try {
      const durum = (document.getElementById(`durum-${siparisId}`) as HTMLSelectElement).value;
      const mesaj = (document.getElementById(`mesaj-${siparisId}`) as HTMLInputElement).value;
      const firma = (document.getElementById(`firma-${siparisId}`) as HTMLInputElement)?.value || "";
      const takip = (document.getElementById(`takip-${siparisId}`) as HTMLInputElement)?.value || "";

      const payload = { id: siparisId, yeniDurum: durum, musteriMesaji: mesaj, kargoFirmasi: firma, takipNo: takip };
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(payload) });

      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === siparisId ? { ...s, durum, musteriMesaji: mesaj, kargoFirmasi: firma, takipNo: takip } : s));
        setGuncellenenID(siparisId);
        setTimeout(() => setGuncellenenID(null), 2000); 
      } else { toast.error("Güncelleme başarısız!"); }
    } catch (e) { toast.error("Sistem hatası!"); }
  };
  const siparisleriGetir = async () => { try { const res = await fetch(`/api/admin/siparisler?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }}); const data = await res.json(); if (data.success) setSiparisler(data.siparisler); } catch (e) {} };
  const siparisSilmeIslemi = async () => { if (!silinecekSiparisID) return; try { const res = await fetch(`/api/admin/siparisler?id=${silinecekSiparisID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }}); if ((await res.json()).success) { setSiparisler(siparisler.filter(s => s._id !== silinecekSiparisID)); setSilinecekSiparisID(null); toast.success("Sipariş silindi."); } } catch (e) { toast.error("Silinemedi."); } };

// 🚀 --- DESTEK TALEPLERİ İŞLEMLERİ (YENİ EKLENDİ) --- 🚀
  const talepleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/destek?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      const data = await res.json();
      if (data.success) setTalepler(data.talepler);
    } catch (e) {}
  }; // 🚀 DİKKAT: Fonksiyonu burada kapattık, hapishaneden çıktı!

  // 🚀 BİNGO: ADMİN RADARI (Sayfayı yenilemeden 5 saniyede bir yeni mesajları çeker)
  useEffect(() => {
    talepleriGetir(); // Sayfa ilk açıldığında 1 kere hemen çeker
    
    // 5000 milisaniye (5 saniye) aralıklarla arkadan sessizce günceller
    const radar = setInterval(() => {
      talepleriGetir();
    }, 5000); 

    // Sen başka sayfaya geçersen motoru durdurur (sistemi yormaz)
    return () => clearInterval(radar); 
  }, []); // <-- Buradaki boş köşeli parantez çok önemli, sadece sayfa açılınca motoru 1 kez kurar.

  const talepCevapGonder = async (id: string) => {
    const metin = talepCevaplari[id];
    if (!metin?.trim()) return toast.error("Cevap boş olamaz şefim!");
    
    const toastId = toast.loading("Cevap iletiliyor...");
    try {
      const res = await fetch("/api/admin/destek", { 
        method: "PUT", 
        headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, 
        body: JSON.stringify({ id, action: "reply", mesaj: metin }) 
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Cevap müşteriye iletildi! 🚀", { id: toastId });
        setTalepCevaplari(prev => ({...prev, [id]: ""}));
        talepleriGetir();
      } else { 
        // Eğer veritabanı reddederse tam olarak neden reddettiğini kırmızı ekranda yazacak!
        toast.error("Hata: " + (data.message || "Bilinmeyen bir sorun oluştu."), { id: toastId }); 
      }
    } catch (e: any) { 
      toast.error("Bağlantı Hatası: " + e.message, { id: toastId }); 
    }
  };

  const talepDurumGuncelle = async (id: string, yeniDurum: string) => {
    try {
      const res = await fetch("/api/admin/destek", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, action: "status", durum: yeniDurum }) });
      if ((await res.json()).success) {
        toast.success("Talep durumu güncellendi.");
        talepleriGetir(); // Durum değişince ekranı hemen yeniler
      }
    } catch (e) { toast.error("Güncellenemedi."); }
  };

  const talepSilmeIslemi = async () => {
    if (!silinecekTalepID) return;
    try {
      const res = await fetch(`/api/admin/destek?id=${silinecekTalepID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setTalepler(talepler.filter(t => t._id !== silinecekTalepID));
        setSilinecekTalepID(null);
        talepleriGetir(); // 🚀 BİNGO: Silme işleminden sonra veritabanını anında sorgular, radarı beklemez!
        toast.success("Talep silindi.");
      }
    } catch (e) { toast.error("Silinemedi."); }
  };
  // Ürün ve Yorum Fonksiyonları (Aynı)
  const urunleriGetir = async () => { try { const res = await fetch(`/api/admin/products?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }}); const data = await res.json(); if (data.success) setUrunler(data.urunler); } catch (e) {} };
  const urunKaydet = async (e: React.FormEvent) => { e.preventDefault(); try { const gonderilecekVeri: any = { isim: formIsim, fiyat: formFiyat, indirimliFiyat: formIndirimliFiyat, havaleIndirimi: formHavaleIndirimi, stokDurumu: formStok, stokAdedi: formStokAdedi, resim: formResim, kategori: formKategori }; if (duzenlenenUrun) gonderilecekVeri.id = duzenlenenUrun._id; const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(gonderilecekVeri) }); if ((await res.json()).success) { toast.success(duzenlenenUrun ? "Ürün güncellendi." : "Yeni ürün eklendi."); formuKapat(); urunleriGetir(); } } catch (e) { toast.error("Hata oluştu."); } };
  const urunSilmeIslemi = async (id: string) => { if (!window.confirm("Bu ürünü silmek istediğine emin misin?")) return; try { const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }}); if ((await res.json()).success) { setUrunler(urunler.filter(u => u._id !== id)); toast.success("Ürün silindi."); } } catch (e) { toast.error("Silinemedi."); } };
  const yorumlariGetir = async () => { try { const res = await fetch("/api/reviews", { headers: { "x-patron-anahtar": PATRON_SIFRESI } }); const result = await res.json(); if (result.success) setYorumlar(result.data); } catch (error) {} };
  const yorumDurumGuncelle = async (id: string, currentStatus: boolean) => { try { const res = await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, onaylandi: !currentStatus }) }); if (res.ok) { toast.success(currentStatus ? "Yorum gizlendi." : "Yorum yayında."); yorumlariGetir(); } } catch (error) { toast.error("Güncellenemedi."); } };
  const yorumCevapGonder = async (id: string) => { if (!replyText.trim()) return toast.error("Cevap boş olamaz!"); try { const res = await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, answer: replyText, onaylandi: true }) }); if (res.ok) { setReplyId(null); setReplyText(""); toast.success("Cevap yayınlandı."); yorumlariGetir(); } } catch (error) { toast.error("Gönderilemedi."); } };
  const yorumSilmeIslemi = async () => { if (!silinecekYorumID) return; try { const res = await fetch(`/api/reviews?id=${silinecekYorumID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }}); if (res.ok) { setSilinecekYorumID(null); toast.success("Yorum silindi."); yorumlariGetir(); } } catch (error) { toast.error("Silinemedi."); } };
  const urunDuzenleModunuAc = (urun: any) => { setDuzenlenenUrun(urun); setFormIsim(urun.isim || urun.name || ""); setFormFiyat((urun.regular_price || urun.fiyat || urun.price || 0).toString()); setFormIndirimliFiyat(urun.indirimliFiyat ? urun.indirimliFiyat.toString() : ""); setFormHavaleIndirimi(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi.toString() : "5"); setFormStok(urun.stokDurumu || "Stokta Var"); setFormStokAdedi((urun.stokAdedi !== null && urun.stokAdedi !== undefined && urun.stokAdedi !== "" && Number(urun.stokAdedi) !== 10) ? urun.stokAdedi.toString() : ""); setFormResim(urun.resim || ""); setFormKategori(urun.kategori || "Bilgisayar"); setYeniUrunModu(true); };
  const yeniUrunModunuAc = () => { setDuzenlenenUrun(null); setFormIsim(""); setFormFiyat(""); setFormIndirimliFiyat(""); setFormHavaleIndirimi("5"); setFormStok("Stokta Var"); setFormStokAdedi(""); setFormResim(""); setFormKategori("Bilgisayar"); setYeniUrunModu(true); };
  const formuKapat = () => { setYeniUrunModu(false); setDuzenlenenUrun(null); };
// 🚀 ŞİFRESİZ GİRİŞ İÇİN BÜTÜN VERİLERİ OTOMATİK ÇEKEN MOTOR
  useEffect(() => {
    if (typeof siparisleriGetir === "function") siparisleriGetir();
    if (typeof urunleriGetir === "function") urunleriGetir();
    if (typeof yorumlariGetir === "function") yorumlariGetir();
    // (Destek talepleri motorunu yukarıda zaten yapmıştık, o kendi kendine çalışıyor)
  }, []);
  if (status === "loading" || (yukleniyor && !girisYapildi)) {
    return <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-slate-500 text-sm font-bold tracking-widest uppercase">Sistem Başlatılıyor...</div>;
  }

  if (!girisYapildi) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
        <form onSubmit={girisYap} className="bg-[#111827] border border-slate-800 rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
          <Crown className="w-8 h-8 text-slate-400 mb-4" />
          <h2 className="text-lg font-bold text-slate-200 uppercase tracking-widest mb-6">Yönetim Girişi</h2>
          <input type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="Şifre" className="w-full bg-[#0b1120] border border-slate-700 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-300 text-center tracking-widest focus:outline-none transition-colors mb-4" required />
          <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold tracking-widest text-sm py-3 rounded-lg transition-colors">GİRİŞ YAP</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* ⬅️ SOL MENÜ */}
      <div className="w-full md:w-64 bg-[#111827] border-r border-slate-800 flex flex-col shrink-0 h-auto md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
            <Crown className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="font-bold text-slate-200 tracking-widest text-base uppercase">Bilgin PC</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider">Operasyon Paneli</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => setAktifSekme("siparisler")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "siparisler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <ShoppingCart className="w-5 h-5" /> Siparişler <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-xs border border-slate-700/50">{siparisler.length}</span>
          </button>
          
          <button onClick={() => setAktifSekme("talepler")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "talepler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <Headset className="w-5 h-5" /> Destek & İade <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-xs border border-slate-700/50">{talepler.filter(t => t.durum !== 'Çözüldü').length > 0 ? <span className="text-indigo-400">{talepler.filter(t => t.durum !== 'Çözüldü').length} Açık</span> : talepler.length}</span>
          </button>

          <button onClick={() => setAktifSekme("urunler")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "urunler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <Package className="w-5 h-5" /> Envanter <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-xs border border-slate-700/50">{urunler.length}</span>
          </button>

          <button onClick={() => setAktifSekme("yorumlar")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "yorumlar" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <MessageSquare className="w-5 h-5" /> Yorumlar <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-xs border border-slate-700/50">{yorumlar.filter(y => !y.onaylandi).length > 0 ? <span className="text-amber-500">{yorumlar.filter(y => !y.onaylandi).length} Yeni</span> : yorumlar.length}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={cikisYap} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider text-xs transition-colors border border-slate-700/50">
            <LogOut className="w-4 h-4" /> Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* ➡️ SAĞ İÇERİK ALANI */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0b1120]">
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-black text-slate-200 uppercase tracking-widest">
              {aktifSekme === "siparisler" ? "Operasyon ve Sipariş Yönetimi" : 
               aktifSekme === "talepler" ? "Destek ve İade Yönetimi" : 
               aktifSekme === "urunler" ? "Envanter Yönetimi" : "Soru ve Yorumlar"}
            </h2>
            {aktifSekme === "urunler" && (
              <button onClick={yeniUrunModunuAc} className="flex items-center gap-2 bg-slate-200 hover:bg-white text-slate-900 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors shrink-0">
                <Plus className="w-5 h-5" /> Yeni Ürün
              </button>
            )}
          </div>

          {yukleniyor ? (
            <div className="text-center py-20 text-slate-500 text-base font-bold tracking-widest uppercase">Veriler Yükleniyor...</div>
          ) : aktifSekme === "siparisler" ? (
            
            /* 📦 SİPARİŞLER BANT SİSTEMİ */
            <div className="flex flex-col gap-6">
              {siparisler.map((siparis) => (
                <div key={siparis._id} className="bg-[#111827] border border-slate-700 rounded-xl flex flex-col xl:flex-row overflow-hidden shadow-lg">
                  {/* SOL TARAF: BİLGİLER */}
                  <div className="flex-[3] p-6 flex flex-col gap-6 border-b xl:border-b-0 xl:border-r border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="text-xl font-black text-slate-200 tracking-wider mb-1">{siparis.siparisKodu}</div>
                        <div className="text-sm text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(siparis.tarih).toLocaleString("tr-TR")}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-500">{Number((siparis.toplamTutar) || (siparis.Tutar) || 0).toLocaleString("tr-TR")} <span className="text-sm text-emerald-600">TL</span></div>
                        <div className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded inline-block uppercase tracking-wider mt-1">{siparis.odemeYontemi === "kart" ? "Kredi Kartı" : "Havale / EFT"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#0b1120] p-5 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Müşteri Bilgileri</div>
                        <div className="text-base font-bold text-slate-300 mb-2">{siparis.musteri?.ad} {siparis.musteri?.soyad}</div>
                        <div className="text-sm text-slate-400 mb-2">{siparis.musteri?.telefon} <span className="mx-2">•</span> {siparis.musteri?.eposta}</div>
                        <div className="text-sm text-slate-400 leading-relaxed">{siparis.musteri?.adres ? `${siparis.musteri.adres}, ` : ""}{siparis.musteri?.ilce} / {siparis.musteri?.sehir}</div>
                        {siparis.siparisNotu && siparis.siparisNotu !== "Not eklenmemiş" && (
                          <div className="mt-3 p-3 bg-amber-900/20 border border-amber-900/30 rounded text-sm text-amber-200/80 italic">
                            <span className="font-bold uppercase text-[10px] block not-italic mb-1 text-amber-500/70">Müşteri Notu:</span>
                            "{siparis.siparisNotu}"
                          </div>
                        )}
                      </div>
                      <div className="bg-[#0b1120] p-5 rounded-lg border border-slate-800 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 sticky top-0 bg-[#0b1120] pb-2 flex items-center gap-2"><Package className="w-4 h-4" /> Sipariş İçeriği ({siparis.sepet?.length || 0} Parça)</div>
                        <div className="flex flex-col gap-3">
                          {siparis.sepet?.map((urun: any, i: number) => (
                            <div key={i} className="flex flex-col border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                              <div className="text-sm font-medium text-slate-300 leading-snug"><span className="font-black text-slate-500 mr-2 text-base">{urun.adet}x</span>{urun.isim || urun.name}</div>
                              <div className="text-[11px] text-slate-600 font-mono mt-1">ID: {urun.id || urun._id}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SAĞ TARAF: KONTROL PANELİ */}
                  <div className="flex-[2] bg-[#1a2333] p-6 flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sipariş Durumu</label>
                        <select id={`durum-${siparis._id}`} defaultValue={siparis.durum} className="w-full bg-[#0b1120] border border-slate-600 rounded-lg px-4 py-3 text-sm font-bold text-slate-200 focus:outline-none focus:border-slate-400 appearance-none">
                          <option value="Ödeme Bekliyor (Havale)">Ödeme Bekliyor (Havale)</option>
                          <option value="Ödendi / Hazırlanıyor">Ödendi / Hazırlanıyor</option>
                          <option value="Kargoya Verildi">Kargoya Verildi</option>
                          <option value="Tamamlandı">Tamamlandı</option>
                          <option value="İptal Edildi">İptal Edildi</option>
                        </select>
                      </div>
                      <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-lg">
                        <label className="block text-xs font-bold text-indigo-400/80 uppercase tracking-wider mb-2">Müşteriye Takip Mesajı Bırak</label>
                        <input type="text" id={`mesaj-${siparis._id}`} defaultValue={siparis.musteriMesaji || ""} placeholder="Örn: Kargonuz özenle paketlendi..." className="w-full bg-[#0b1120] border border-indigo-900/50 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors" />
                      </div>
                      <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
                        <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-wider mb-2">Kargo Bilgilerini İşle</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input type="text" id={`firma-${siparis._id}`} defaultValue={siparis.kargoFirmasi || ""} placeholder="Firma Adı" className="flex-1 bg-[#0b1120] border border-emerald-900/50 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-600/50" />
                          <input type="text" id={`takip-${siparis._id}`} defaultValue={siparis.takipNo || ""} placeholder="Takip No" className="flex-[2] bg-[#0b1120] border border-emerald-900/50 rounded-lg px-4 py-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-emerald-600/50 tracking-widest" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50 mt-2">
                      <button onClick={() => setSilinecekSiparisID(siparis._id)} className="w-14 flex items-center justify-center bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-500/30 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                      <button onClick={() => siparisGuncelle(siparis._id)} className={`flex-1 font-black uppercase tracking-widest text-sm py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${guncellenenID === siparis._id ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-white text-slate-900'}`}>{guncellenenID === siparis._id ? <><CheckCircle2 className="w-5 h-5" /> GÜNCELLENDİ</> : <><Save className="w-5 h-5" /> KAYDET VE GÜNCELLE</>}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : aktifSekme === "talepler" ? (
            
            /* 🚀 DESTEK VE İADE TALEPLERİ EKRANI */
            <div className="flex flex-col gap-6">
              {talepler.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-base font-bold tracking-widest uppercase">Hiç Destek Talebi Yok.</div>
              ) : talepler.map((talep) => (
                <div key={talep._id} className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col lg:flex-row">
                  
                  {/* Sol: Talep Bilgileri ve Mesaj Geçmişi */}
                  <div className="flex-[3] p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${talep.konu === 'iade' ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50' : talep.konu === 'teknik' ? 'bg-blue-950/30 text-blue-400 border border-blue-900/50' : 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/50'}`}>
                            {talep.konu === 'iade' ? 'İade İşlemi' : talep.konu === 'teknik' ? 'Teknik Destek' : 'Kargo / Diğer'}
                          </span>
                          <span className="text-xs text-slate-500 font-bold bg-[#0b1120] px-2 py-1 rounded border border-slate-800">#{talep.talepNo}</span>
                        </div>
                        <div className="text-slate-400 text-sm font-medium"><span className="text-slate-300 font-bold">{talep.kullaniciEmail}</span> tarafından açıldı</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${talep.durum === 'Çözüldü' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50' : talep.durum === 'Yanıt Bekleniyor' ? 'bg-amber-950/30 text-amber-500 border-amber-900/50' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {talep.durum}
                        </span>
                        <div className="text-xs text-slate-500 mt-2 font-medium">{new Date(talep.createdAt).toLocaleString("tr-TR")}</div>
                      </div>
                    </div>

                    {/* Mesaj Akışı */}
                    <div className="flex-1 bg-[#0b1120] border border-slate-800 rounded-lg p-5 flex flex-col gap-4 overflow-y-auto max-h-[400px] custom-scrollbar">
                      {talep.mesajlar?.map((msg: any, index: number) => (
                        <div key={index} className={`flex flex-col max-w-[80%] ${msg.gonderen === 'admin' ? 'self-end items-end' : 'self-start items-start'}`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${msg.gonderen === 'admin' ? 'text-indigo-400' : 'text-slate-400'}`}>
                            {msg.gonderen === 'admin' ? 'Müşteri Hizmetleri' : 'Müşteri'}
                          </div>
                          <div className={`p-4 rounded-xl text-sm leading-relaxed ${msg.gonderen === 'admin' ? 'bg-indigo-900/20 border border-indigo-900/40 text-indigo-100 rounded-tr-sm' : 'bg-slate-800/50 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                            {msg.metin.split('\n').map((satir: string, i: number) => <span key={i}>{satir}<br/></span>)}
                          </div>
                          <div className="text-[9px] text-slate-600 mt-1 font-medium">{new Date(msg.tarih).toLocaleString("tr-TR")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sağ: Operatör Yanıt Paneli */}
                  <div className="flex-[2] bg-[#1a2333] p-6 flex flex-col justify-between gap-6">
             <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] p-4 admin-sohbet-kutusu">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Talebi Yanıtla</label>
                        <textarea 
                          value={talepCevaplari[talep._id] || ""} 
                          onChange={(e) => setTalepCevaplari(prev => ({...prev, [talep._id]: e.target.value}))}
                          placeholder="Müşteriye cevabınızı yazın... (Örn: İade kodunuz: 12345)" 
                          className="w-full bg-[#0b1120] border border-slate-600 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 min-h-[150px] resize-none"
                        />
                      </div>
                      <button 
                        onClick={() => talepCevapGonder(talep._id)} 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> CEVAP GÖNDER
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-700/50 mt-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hızlı İşlemler</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => talepDurumGuncelle(talep._id, talep.durum === 'Çözüldü' ? 'Açık' : 'Çözüldü')} 
                          className={`flex-[3] font-bold uppercase text-[10px] tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${talep.durum === 'Çözüldü' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900/30'}`}
                        >
                          {talep.durum === 'Çözüldü' ? 'Tekrar Aç' : <><CheckCircle2 className="w-4 h-4" /> Çözüldü Olarak İşaretle</>}
                        </button>
                        <button onClick={() => setSilinecekTalepID(talep._id)} className="flex-1 flex items-center justify-center bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-500/30 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : aktifSekme === "urunler" ? (
            
            /* 💻 ÜRÜNLER (Bant Sistemi) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {urunler.map((urun) => {
                const gosterilenFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : Number(urun.regular_price || urun.fiyat || urun.price || 0);
                const gosterilecekDurum = (urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0") ? "Tükendi" : "Stokta Var";
                return (
                  <div key={urun._id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-[#0b1120] border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit">{urun.kategori || "Genel"}</span>
                        <div className="flex flex-col items-end gap-1.5">
                          <div className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${gosterilecekDurum === "Tükendi" ? "bg-red-950/30 border-red-900/50 text-red-500" : "bg-emerald-950/30 border-emerald-900/50 text-emerald-500"}`}>{gosterilecekDurum}</div>
                          {(urun.stokAdedi && Number(urun.stokAdedi) !== 10) ? <span className="text-xs text-slate-500 font-bold">{urun.stokAdedi} Adet</span> : null}
                        </div>
                      </div>
                      <div className="text-base font-medium text-slate-300 leading-snug mb-4 line-clamp-2 min-h-[48px]">{urun.isim || urun.name}</div>
                      <div className="bg-[#0b1120] rounded-lg p-4 mb-5 border border-slate-800/50">
                        <div className="text-xl font-bold text-slate-200">{gosterilenFiyat.toLocaleString("tr-TR")} <span className="text-sm text-slate-500">TL</span></div>
                        <div className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider">Havale İndirimi: %{(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5)}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => urunDuzenleModunuAc(urun)} className="flex-1 bg-[#0b1120] border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">Düzenle</button>
                      <button onClick={() => urunSilmeIslemi(urun._id)} className="flex-1 bg-[#0b1120] border border-slate-700 text-slate-500 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">Sil</button>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (

            /* 💬 YORUMLAR (Bant Sistemi) */
            <div className="flex flex-col gap-5">
              {yorumlar.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-base font-bold tracking-widest uppercase">Hiç Yorum Yok.</div>
              ) : yorumlar.map((item) => (
                <div key={item._id} className={`bg-[#111827] border rounded-xl p-6 ${item.onaylandi ? 'border-slate-800' : 'border-amber-900/50 bg-amber-950/10'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        {item.type === "question" ? <span className="bg-blue-950/30 text-blue-400 text-[10px] border border-blue-900/50 font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5"><HelpCircle size={12} /> Soru</span> : <span className="bg-purple-950/30 text-purple-400 text-[10px] border border-purple-900/50 font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5"><Star size={12} /> Yorum</span>}
                        {!item.onaylandi && <span className="bg-amber-950/30 text-amber-500 border border-amber-900/50 text-[10px] font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5"><ShieldAlert size={12} /> Onay Bekliyor</span>}
                      </div>
                      <h3 className="text-slate-200 font-bold text-base mb-2">{item.name}</h3>
                      <p className="text-slate-400 text-sm italic mb-4 leading-relaxed">"{item.text}"</p>
                      {item.answer && <div className="bg-[#0b1120] p-4 rounded-lg border-l-2 border-slate-600 text-sm text-slate-400 mt-auto"><span className="font-bold text-[10px] uppercase tracking-wider block mb-1">Mağaza Cevabı:</span>{item.answer}</div>}
                    </div>
                    <div className="flex md:flex-col gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
                      <button onClick={() => yorumDurumGuncelle(item._id, item.onaylandi)} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-colors ${item.onaylandi ? 'bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-slate-300' : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900/30'}`}>{item.onaylandi ? <XCircle size={16} /> : <CheckCircle2 size={16} />} {item.onaylandi ? "Gizle" : "Onayla"}</button>
                      <button onClick={() => { setReplyId(replyId === item._id ? null : item._id); setReplyText(item.answer || ""); }} className="flex items-center justify-center gap-2 p-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-colors"><MessageSquare size={16} /> Cevapla</button>
                      <button onClick={() => setSilinecekYorumID(item._id)} className="flex items-center justify-center gap-2 p-3 bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-900/50 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-colors"><Trash2 size={16} /> Sil</button>
                    </div>
                  </div>
                  {replyId === item._id && (
                    <div className="mt-5 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Cevabınızı yazın..." className="flex-1 bg-[#0b1120] border border-slate-700 rounded-lg p-4 text-sm text-slate-300 focus:outline-none min-h-[80px] resize-none" />
                      <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32">
                        <button onClick={() => yorumCevapGonder(item._id)} className="flex-1 bg-slate-700 text-white rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-600 transition-colors">Gönder</button>
                        <button onClick={() => setReplyId(null)} className="flex-1 bg-[#0b1120] border border-slate-700 text-slate-500 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-800 transition-colors">İptal</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🚀 YENİ ÜRÜN MODALI VE SİLME MODALLARI AYNEN KORUNDU */}
      {yeniUrunModu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={urunKaydet} className="bg-[#111827] border border-slate-800 rounded-2xl p-8 w-full max-w-xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-widest">{duzenlenenUrun ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
              <button type="button" onClick={formuKapat} className="text-slate-500 hover:text-slate-300 transition-colors"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ürün Adı</label><input type="text" value={formIsim} onChange={(e) => setFormIsim(e.target.value)} required className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Normal Fiyat (TL)</label><input type="number" value={formFiyat} onChange={(e) => setFormFiyat(e.target.value)} required className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">İndirimli Fiyat (TL)</label><input type="number" value={formIndirimliFiyat} onChange={(e) => setFormIndirimliFiyat(e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Stok Adedi</label><input type="number" value={formStokAdedi} onChange={(e) => setFormStokAdedi(e.target.value)} placeholder="Boş = Sınırsız" className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Havale İndirimi (%)</label><input type="number" value={formHavaleIndirimi} onChange={(e) => setFormHavaleIndirimi(e.target.value)} min="0" max="100" className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Stok Durumu</label><select value={formStok} onChange={(e) => setFormStok(e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500"><option value="Stokta Var">Stokta Var</option><option value="Tükendi">Tükendi</option></select></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label><input type="text" value={formKategori} onChange={(e) => setFormKategori(e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              </div>
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resim URL Yolu</label><input type="text" value={formResim} onChange={(e) => setFormResim(e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              <div className="flex gap-3 mt-4 pt-5 border-t border-slate-800">
                <button type="button" onClick={formuKapat} className="flex-1 bg-[#0b1120] border border-slate-700 text-slate-400 hover:text-slate-200 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">İptal</button>
                <button type="submit" className="flex-1 bg-slate-200 hover:bg-white text-slate-900 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2"><Save className="w-4 h-4" /> Kaydet</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ORTAK SİLME ONAY MODALI */}
      {(silinecekSiparisID || silinecekYorumID || silinecekTalepID) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-5 bg-red-500/10"><Trash2 className="w-7 h-7 text-red-400" /></div>
            <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider mb-2">Kalıcı Silme İşlemi</h3>
            <p className="text-slate-400 text-sm mb-6">Bu işlemi geri alamazsınız. Onaylıyor musunuz?</p>
            <div className="flex w-full gap-3">
              <button onClick={() => { setSilinecekSiparisID(null); setSilinecekYorumID(null); setSilinecekTalepID(null); }} className="flex-1 bg-[#0b1120] border border-slate-700 hover:bg-slate-800 text-slate-400 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">İptal</button>
              <button onClick={silinecekSiparisID ? siparisSilmeIslemi : silinecekYorumID ? yorumSilmeIslemi : talepSilmeIslemi} className="flex-1 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}