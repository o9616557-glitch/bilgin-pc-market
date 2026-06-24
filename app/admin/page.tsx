"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingCart, LogOut, Trash2, Edit, Plus, Truck, 
  CheckCircle2, XCircle, MessageSquare, Save, Crown, 
  Image as ImageIcon, Star, HelpCircle, ShieldAlert, Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPaneli() {
  // 👑 GÜVENLİK DUVARI
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

  // TEMEL STATE'LER
  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [aktifSekme, setAktifSekme] = useState<"siparisler" | "urunler" | "yorumlar">("siparisler");
  const [yukleniyor, setYukleniyor] = useState(true);

  // SİPARİŞ STATE'LERİ
  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [silinecekSiparisID, setSilinecekSiparisID] = useState<string | null>(null);
  const [kargoBekleyenID, setKargoBekleyenID] = useState<string | null>(null);

  // ÜRÜN STATE'LERİ
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

  // YORUM STATE'LERİ
  const [yorumlar, setYorumlar] = useState<any[]>([]);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [silinecekYorumID, setSilinecekYorumID] = useState<string | null>(null);

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
    await yorumlariGetir();
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

  const cikisYap = () => { 
    sessionStorage.removeItem("patronGiris"); 
    setGirisYapildi(false); 
  };

  // --- API İSTEKLERİ (SİPARİŞ) ---
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
        toast.success("Durum güncellendi.");
      }
    } catch (e) { toast.error("Güncellenemedi."); }
  };

  const mesajGuncelle = async (id: string, musteriMesaji: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, musteriMesaji }) });
      if ((await res.json()).success) toast.success("Mesaj kaydedildi.");
    } catch (e) { toast.error("Kaydedilemedi."); }
  };

  const kargoGuncelle = async (id: string, kargoFirmasi: string, takipNo: string, durumuGuncelle: boolean) => {
    try {
      const gonderilecekVeri: any = { id, kargoFirmasi, takipNo };
      if (durumuGuncelle) gonderilecekVeri.yeniDurum = "Kargoya Verildi";
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(gonderilecekVeri) });
      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, kargoFirmasi, takipNo, durum: durumuGuncelle ? "Kargoya Verildi" : s.durum } : s));
        setKargoBekleyenID(null); 
        toast.success("Kargo bilgileri işlendi.");
      }
    } catch (e) { toast.error("Kaydedilemedi."); }
  };

  const siparisSilmeIslemi = async () => {
    if (!silinecekSiparisID) return;
    try {
      const res = await fetch(`/api/admin/siparisler?id=${silinecekSiparisID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setSiparisler(siparisler.filter(s => s._id !== silinecekSiparisID));
        setSilinecekSiparisID(null);
        toast.success("Sipariş silindi.");
      }
    } catch (e) { toast.error("Silinemedi."); }
  };

  // --- API İSTEKLERİ (ÜRÜN) ---
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
      const gonderilecekVeri: any = { isim: formIsim, fiyat: formFiyat, indirimliFiyat: formIndirimliFiyat, havaleIndirimi: formHavaleIndirimi, stokDurumu: formStok, stokAdedi: formStokAdedi, resim: formResim, kategori: formKategori };
      if (duzenlenenUrun) gonderilecekVeri.id = duzenlenenUrun._id;
      const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(gonderilecekVeri) });
      if ((await res.json()).success) {
        toast.success(duzenlenenUrun ? "Ürün güncellendi." : "Yeni ürün eklendi.");
        formuKapat();
        urunleriGetir();
      }
    } catch (e) { toast.error("Hata oluştu."); }
  };

  const urunSilmeIslemi = async (id: string) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setUrunler(urunler.filter(u => u._id !== id));
        toast.success("Ürün silindi.");
      }
    } catch (e) { toast.error("Silinemedi."); }
  };

  // --- API İSTEKLERİ (YORUMLAR) ---
  const yorumlariGetir = async () => {
    try {
      const res = await fetch("/api/reviews", { headers: { "x-patron-anahtar": PATRON_SIFRESI } });
      const result = await res.json();
      if (result.success) setYorumlar(result.data);
    } catch (error) {}
  };

  const yorumDurumGuncelle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, onaylandi: !currentStatus }) });
      if (res.ok) {
        toast.success(currentStatus ? "Yorum gizlendi." : "Yorum yayında.");
        yorumlariGetir();
      }
    } catch (error) { toast.error("Güncellenemedi."); }
  };

  const yorumCevapGonder = async (id: string) => {
    if (!replyText.trim()) return toast.error("Cevap boş olamaz!");
    try {
      const res = await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, answer: replyText, onaylandi: true }) });
      if (res.ok) { 
        setReplyId(null); setReplyText(""); 
        toast.success("Cevap yayınlandı.");
        yorumlariGetir(); 
      }
    } catch (error) { toast.error("Gönderilemedi."); }
  };

  const yorumSilmeIslemi = async () => {
    if (!silinecekYorumID) return;
    try {
      const res = await fetch(`/api/reviews?id=${silinecekYorumID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if (res.ok) {
        setSilinecekYorumID(null);
        toast.success("Yorum silindi.");
        yorumlariGetir();
      }
    } catch (error) { toast.error("Silinemedi."); }
  };

  // ÜRÜN FORM YARDIMCILARI
  const urunDuzenleModunuAc = (urun: any) => {
    setDuzenlenenUrun(urun); setFormIsim(urun.isim || urun.name || ""); setFormFiyat((urun.regular_price || urun.fiyat || urun.price || 0).toString()); setFormIndirimliFiyat(urun.indirimliFiyat ? urun.indirimliFiyat.toString() : ""); setFormHavaleIndirimi(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi.toString() : "5"); setFormStok(urun.stokDurumu || "Stokta Var"); setFormStokAdedi((urun.stokAdedi !== null && urun.stokAdedi !== undefined && urun.stokAdedi !== "" && Number(urun.stokAdedi) !== 10) ? urun.stokAdedi.toString() : ""); setFormResim(urun.resim || ""); setFormKategori(urun.kategori || "Bilgisayar"); setYeniUrunModu(true);
  };
  const yeniUrunModunuAc = () => {
    setDuzenlenenUrun(null); setFormIsim(""); setFormFiyat(""); setFormIndirimliFiyat(""); setFormHavaleIndirimi("5"); setFormStok("Stokta Var"); setFormStokAdedi(""); setFormResim(""); setFormKategori("Bilgisayar"); setYeniUrunModu(true);
  };
  const formuKapat = () => { setYeniUrunModu(false); setDuzenlenenUrun(null); };

  const durumRengi = (durum: string) => {
    if (!durum) return "text-slate-400 bg-slate-800/50 border-slate-700";
    if (durum === "Ödendi / Hazırlanıyor" || durum.includes("Başarılı")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"; 
    if (durum === "Kargoya Verildi") return "text-blue-400 bg-blue-500/10 border-blue-500/20"; 
    if (durum === "İptal Edildi") return "text-red-400 bg-red-500/10 border-red-500/20"; 
    return "text-amber-400 bg-amber-500/10 border-amber-500/20"; 
  };

  // 🔒 YÜKLENİYOR / ŞİFRE EKRANI
  if (status === "loading" || (yukleniyor && !girisYapildi)) {
    return <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-slate-500 text-sm font-medium tracking-widest uppercase">Sistem Başlatılıyor...</div>;
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

  // 🚀 ANA KONTROL PANELİ
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* ⬅️ SOL MENÜ (Mat ve Tok) */}
      <div className="w-full md:w-64 bg-[#111827] border-r border-slate-800 flex flex-col shrink-0 h-auto md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
            <Crown className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <h1 className="font-bold text-slate-200 tracking-widest text-sm uppercase">Bilgin PC</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider">Yönetim Katı</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <button onClick={() => setAktifSekme("siparisler")} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${aktifSekme === "siparisler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <ShoppingCart className="w-4 h-4" /> Siparişler <span className="ml-auto bg-[#0b1120] px-2 py-0.5 rounded text-[10px] border border-slate-700/50">{siparisler.length}</span>
          </button>
          <button onClick={() => setAktifSekme("urunler")} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${aktifSekme === "urunler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <Package className="w-4 h-4" /> Ürünler <span className="ml-auto bg-[#0b1120] px-2 py-0.5 rounded text-[10px] border border-slate-700/50">{urunler.length}</span>
          </button>
          <button onClick={() => setAktifSekme("yorumlar")} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${aktifSekme === "yorumlar" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <MessageSquare className="w-4 h-4" /> Yorumlar <span className="ml-auto bg-[#0b1120] px-2 py-0.5 rounded text-[10px] border border-slate-700/50">{yorumlar.filter(y => !y.onaylandi).length > 0 ? <span className="text-amber-500">{yorumlar.filter(y => !y.onaylandi).length} Yeni</span> : yorumlar.length}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={cikisYap} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider text-[10px] transition-colors border border-slate-700/50">
            <LogOut className="w-3.5 h-3.5" /> Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* ➡️ SAĞ İÇERİK ALANI (Göz Yormayan Arka Plan) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0b1120]">
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest">
              {aktifSekme === "siparisler" ? "Sipariş Yönetimi" : aktifSekme === "urunler" ? "Envanter Yönetimi" : "Soru ve Yorumlar"}
            </h2>
            {aktifSekme === "urunler" && (
              <button onClick={yeniUrunModunuAc} className="flex items-center gap-2 bg-slate-200 hover:bg-white text-slate-900 px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors shrink-0">
                <Plus className="w-4 h-4" /> Yeni Ürün Ekle
              </button>
            )}
          </div>

          {yukleniyor ? (
            <div className="text-center py-20 text-slate-500 text-sm tracking-widest uppercase">Veriler Yükleniyor...</div>
          ) : aktifSekme === "siparisler" ? (
            
            /* 📦 SİPARİŞLER (Mat ve Tok Tasarım) */
            <div className="flex flex-col gap-4">
              {siparisler.map((siparis) => (
                <div key={siparis._id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col gap-5">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="text-lg font-bold text-slate-200 tracking-wider mb-1">{siparis.siparisKodu}</div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(siparis.tarih).toLocaleString("tr-TR")}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-bold uppercase tracking-wider text-[10px] ${durumRengi(siparis.durum)}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <select onChange={(e) => { if (e.target.value === "Kargoya Verildi") { setKargoBekleyenID(siparis._id); } else { durumGuncelle(siparis._id, e.target.value); if (kargoBekleyenID === siparis._id) setKargoBekleyenID(null); } }} value={kargoBekleyenID === siparis._id ? "kargo_bekleniyor" : siparis.durum} className="bg-transparent border-none outline-none cursor-pointer appearance-none">
                          <option value="Ödeme Bekliyor (Havale)" className="bg-[#111827] text-slate-300">Bekliyor (Havale)</option>
                          <option value="Ödendi / Hazırlanıyor" className="bg-[#111827] text-slate-300">Hazırlanıyor</option>
                          {kargoBekleyenID === siparis._id && <option value="kargo_bekleniyor" className="bg-[#111827] text-slate-300">Bilgiler Giriliyor...</option>}
                          <option value="Kargoya Verildi" className="bg-[#111827] text-slate-300">Kargoya Verildi</option>
                          <option value="Tamamlandı" className="bg-[#111827] text-slate-300">Tamamlandı</option>
                          <option value="İptal Edildi" className="bg-[#111827] text-slate-300">İptal Edildi</option>
                        </select>
                      </div>
                      <button onClick={() => setSilinecekSiparisID(siparis._id)} className="w-8 h-8 flex items-center justify-center bg-[#0b1120] border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0b1120] p-4 rounded-lg border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Müşteri Bilgileri</div>
                      <div className="text-sm font-medium text-slate-300 mb-1">{siparis.musteri?.ad} {siparis.musteri?.soyad}</div>
                      <div className="text-xs text-slate-500 mb-1">{siparis.musteri?.telefon} • {siparis.musteri?.eposta}</div>
                      <div className="text-xs text-slate-500">{siparis.musteri?.adres ? `${siparis.musteri.adres}, ` : ""}{siparis.musteri?.ilce} / {siparis.musteri?.sehir}</div>
                    </div>
                    <div className="bg-[#0b1120] p-4 rounded-lg border border-slate-800/50 flex flex-col justify-center items-center text-center">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Ödeme Özeti</div>
                      <div className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded mb-1 uppercase tracking-wider">{siparis.odemeYontemi === "kart" ? "Kredi Kartı" : "Havale / EFT"}</div>
                      <div className="text-lg font-bold text-slate-200">{Number((siparis.toplamTutar) || (siparis.Tutar) || 0).toLocaleString("tr-TR")} <span className="text-xs text-slate-500">TL</span></div>
                    </div>
                    <div className="bg-[#0b1120] p-4 rounded-lg border border-slate-800/50 max-h-[120px] overflow-y-auto custom-scrollbar">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 sticky top-0 bg-[#0b1120] pb-1">Sipariş İçeriği</div>
                      <div className="flex flex-col gap-2">
                        {siparis.sepet?.map((urun: any, i: number) => (
                          <div key={i} className="flex flex-col border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0">
                            <div className="text-xs text-slate-300 line-clamp-1"><span className="text-slate-500 mr-1">{urun.adet}x</span>{urun.isim || urun.name}</div>
                            <div className="text-[9px] text-slate-600 font-mono mt-0.5">ID: {urun.id || urun._id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-4 border-t border-slate-800 pt-4">
                    <div className="flex-1 flex flex-col gap-2">
                      {siparis.siparisNotu && siparis.siparisNotu !== "Not eklenmemiş" && (
                        <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-lg">
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Müşterinin Notu</div>
                          <div className="text-xs text-slate-300 italic">"{siparis.siparisNotu}"</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 ml-0.5">Takip Ekranına Mesaj Bırak</div>
                        <input type="text" defaultValue={siparis.musteriMesaji || ""} onBlur={(e) => mesajGuncelle(siparis._id, e.target.value)} placeholder="Müşteriye not yaz..." className="w-full bg-[#0b1120] border border-slate-700 focus:border-slate-500 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none transition-colors" />
                      </div>
                    </div>
                    {(siparis.durum === "Kargoya Verildi" || kargoBekleyenID === siparis._id) && (
                      <div className="flex-1 bg-slate-800/30 border border-slate-800 rounded-lg p-4 flex flex-col justify-center">
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Kargo Bilgileri</div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input id={`firma-${siparis._id}`} defaultValue={siparis.kargoFirmasi || ""} placeholder="Firma (Örn: Yurtiçi)" className="flex-1 bg-[#0b1120] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none" />
                          <input id={`takip-${siparis._id}`} defaultValue={siparis.takipNo || ""} placeholder="Takip Numarası" className="flex-[2] bg-[#0b1120] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none tracking-widest" />
                        </div>
                        <button onClick={() => { const f = (document.getElementById(`firma-${siparis._id}`) as HTMLInputElement).value; const t = (document.getElementById(`takip-${siparis._id}`) as HTMLInputElement).value; if(!f || !t) return toast.error("Bilgiler eksik!"); kargoGuncelle(siparis._id, f, t, kargoBekleyenID === siparis._id); }} className="mt-2 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-lg transition-colors">
                          {kargoBekleyenID === siparis._id ? "Kaydet ve Bildir" : "Güncelle"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          ) : aktifSekme === "urunler" ? (
            
            /* 💻 ÜRÜNLER (Mat ve Tok Tasarım) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {urunler.map((urun) => {
                const gosterilenFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : Number(urun.regular_price || urun.fiyat || urun.price || 0);
                const gosterilecekDurum = (urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0") ? "Tükendi" : "Stokta Var";
                return (
                  <div key={urun._id} className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-[#0b1120] border border-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded w-fit">{urun.kategori || "Genel"}</span>
                        <div className="flex flex-col items-end gap-1">
                          <div className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${gosterilecekDurum === "Tükendi" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                            {gosterilecekDurum}
                          </div>
                          {(urun.stokAdedi && Number(urun.stokAdedi) !== 10) ? <span className="text-[9px] text-slate-500">{urun.stokAdedi} Adet</span> : null}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-slate-300 leading-snug mb-3 line-clamp-2 min-h-[40px]">{urun.isim || urun.name}</div>
                      <div className="bg-[#0b1120] rounded-lg p-3 mb-4">
                        <div className="text-lg font-bold text-slate-200">{gosterilenFiyat.toLocaleString("tr-TR")} <span className="text-xs text-slate-500">TL</span></div>
                        <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Havale İndirimi: %{(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => urunDuzenleModunuAc(urun)} className="flex-1 bg-[#0b1120] border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">Düzenle</button>
                      <button onClick={() => urunSilmeIslemi(urun._id)} className="flex-1 bg-[#0b1120] border border-slate-800 text-slate-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">Sil</button>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (

            /* 💬 YORUMLAR (Mat ve Tok Tasarım, Eski Sayfadan Taşındı) */
            <div className="flex flex-col gap-4">
              {yorumlar.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-sm tracking-widest uppercase">Hiç Yorum Yok.</div>
              ) : yorumlar.map((item) => (
                <div key={item._id} className={`bg-[#111827] border rounded-xl p-5 ${item.onaylandi ? 'border-slate-800' : 'border-amber-500/30 bg-amber-500/5'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "question" ? (
                          <span className="bg-blue-500/10 text-blue-400 text-[9px] border border-blue-500/20 font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><HelpCircle size={10} /> Soru</span>
                        ) : (
                          <span className="bg-purple-500/10 text-purple-400 text-[9px] border border-purple-500/20 font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><Star size={10} /> Yorum</span>
                        )}
                        {!item.onaylandi && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><ShieldAlert size={10} /> Onay Bekliyor</span>}
                      </div>
                      <h3 className="text-slate-200 font-bold text-sm mb-1">{item.name}</h3>
                      <p className="text-slate-400 text-xs italic mb-3">"{item.text}"</p>
                      {item.answer && (
                        <div className="bg-[#0b1120] p-3 rounded-lg border-l-2 border-slate-600 text-xs text-slate-400 mt-auto">
                          <span className="font-bold text-[9px] uppercase tracking-wider block mb-0.5">Mağaza Cevabı:</span>
                          {item.answer}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                      <button onClick={() => yorumDurumGuncelle(item._id, item.onaylandi)} className={`flex items-center justify-center gap-1.5 p-2 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-colors ${item.onaylandi ? 'bg-[#0b1120] border border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'}`}>
                        {item.onaylandi ? <XCircle size={14} /> : <CheckCircle2 size={14} />} {item.onaylandi ? "Gizle" : "Onayla"}
                      </button>
                      <button onClick={() => { setReplyId(replyId === item._id ? null : item._id); setReplyText(item.answer || ""); }} className="flex items-center justify-center gap-1.5 p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-colors">
                        <MessageSquare size={14} /> Cevapla
                      </button>
                      <button onClick={() => setSilinecekYorumID(item._id)} className="flex items-center justify-center gap-1.5 p-2 bg-[#0b1120] border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-colors">
                        <Trash2 size={14} /> Sil
                      </button>
                    </div>
                  </div>

                  {replyId === item._id && (
                    <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Cevabınızı yazın..." className="flex-1 bg-[#0b1120] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none min-h-[40px] resize-none" />
                      <div className="flex flex-col gap-1 shrink-0 w-24">
                        <button onClick={() => yorumCevapGonder(item._id)} className="flex-1 bg-slate-700 text-white rounded-md font-bold uppercase text-[9px] tracking-wider hover:bg-slate-600 transition-colors">Gönder</button>
                        <button onClick={() => setReplyId(null)} className="flex-1 bg-[#0b1120] border border-slate-800 text-slate-500 rounded-md font-bold uppercase text-[9px] tracking-wider hover:bg-slate-800 transition-colors">İptal</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 🚀 YENİ ÜRÜN / DÜZENLEME MODALI */}
      {yeniUrunModu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={urunKaydet} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{duzenlenenUrun ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
              <button type="button" onClick={formuKapat} className="text-slate-500 hover:text-slate-300 transition-colors"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ürün Adı</label><input type="text" value={formIsim} onChange={(e) => setFormIsim(e.target.value)} required className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Normal Fiyat (TL)</label><input type="number" value={formFiyat} onChange={(e) => setFormFiyat(e.target.value)} required className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
                <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">İndirimli Fiyat (TL)</label><input type="number" value={formIndirimliFiyat} onChange={(e) => setFormIndirimliFiyat(e.target.value)} className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stok Adedi</label><input type="number" value={formStokAdedi} onChange={(e) => setFormStokAdedi(e.target.value)} placeholder="Boş = Sınırsız" className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
                <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Havale İndirimi (%)</label><input type="number" value={formHavaleIndirimi} onChange={(e) => setFormHavaleIndirimi(e.target.value)} min="0" max="100" className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stok Durumu</label><select value={formStok} onChange={(e) => setFormStok(e.target.value)} className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500"><option value="Stokta Var">Stokta Var</option><option value="Tükendi">Tükendi</option></select></div>
                <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori</label><input type="text" value={formKategori} onChange={(e) => setFormKategori(e.target.value)} className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              </div>
              <div><label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resim URL Yolu</label><input type="text" value={formResim} onChange={(e) => setFormResim(e.target.value)} className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-500" /></div>
              <div className="flex gap-2 mt-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={formuKapat} className="flex-1 bg-[#0b1120] border border-slate-800 text-slate-400 hover:text-slate-200 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">İptal</button>
                <button type="submit" className="flex-1 bg-slate-200 hover:bg-white text-slate-900 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Kaydet</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ORTAK SİLME ONAY MODALI */}
      {(silinecekSiparisID || silinecekYorumID) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-xs w-full flex flex-col items-center text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center mb-4 bg-red-500/10"><Trash2 className="w-5 h-5 text-red-400" /></div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">Kalıcı Silme İşlemi</h3>
            <p className="text-slate-400 text-xs mb-5">Bu işlemi geri alamazsınız. Onaylıyor musunuz?</p>
            <div className="flex w-full gap-2">
              <button onClick={() => { setSilinecekSiparisID(null); setSilinecekYorumID(null); }} className="flex-1 bg-[#0b1120] border border-slate-800 hover:bg-slate-800 text-slate-400 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">İptal</button>
              <button onClick={silinecekSiparisID ? siparisSilmeIslemi : yorumSilmeIslemi} className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}