export function oturumHafizasiniTemizle(email?: string | null) {
  if (typeof window === "undefined") return;

  [
    "bilgin_hesabim_data",
    "bilgin_cuzdan",
    "bilgin_siparisler",
    "bilgin-adresler",
    "bilgin-favoriler",
    "bilgin_destek_ozet",
    "bilgin_adresler_cache",
  ].forEach((key) => sessionStorage.removeItem(key));

  localStorage.removeItem("bilgin_kayitli_sistemler");
  localStorage.removeItem("bilgin_destek_talepleri");

  if (email) {
    localStorage.removeItem(`bilgin_destek_ozet_${email.toLowerCase()}`);
  }
}
