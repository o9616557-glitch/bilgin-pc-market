export function oturumHafizasiniTemizle() {
  if (typeof window === "undefined") return;

  [
    "bilgin_hesabim_data",
    "bilgin_cuzdan",
    "bilgin_siparisler",
    "bilgin-adresler",
    "bilgin-favoriler",
    "bilgin_destek_ozet",
    "bilgin_uye_baslangic",
  ].forEach((key) => sessionStorage.removeItem(key));

  localStorage.removeItem("bilgin_kayitli_sistemler");
  localStorage.removeItem("bilgin_destek_talepleri");
}
