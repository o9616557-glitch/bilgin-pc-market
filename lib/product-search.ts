const SEARCH_FIELDS = ["isim", "name", "marka", "kategori", "slug"] as const;
const SEPARATOR_PATTERN = "[\\s._\\-\\/,+:;|()\\[\\]{}]*";

function harfRakamAyir(metin: string) {
  return metin
    .replace(/([a-zA-ZğüşıöçĞÜŞİÖÇ])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-ZğüşıöçĞÜŞİÖÇ])/g, "$1 $2");
}

function regexOzelKarakterleriKoru(metin: string) {
  return metin.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function turkceHarfleriEsitle(pattern: string) {
  return pattern
    .replace(/[iİıI]/g, "[iİıI]")
    .replace(/[gĞğG]/g, "[gĞğG]")
    .replace(/[cÇçC]/g, "[cÇçC]")
    .replace(/[sŞşS]/g, "[sŞşS]")
    .replace(/[oÖöO]/g, "[oÖöO]")
    .replace(/[uÜüU]/g, "[uÜüU]");
}

function esnekRegexParcasi(kelime: string) {
  return kelime
    .split("")
    .map((harf) => turkceHarfleriEsitle(regexOzelKarakterleriKoru(harf)))
    .join(SEPARATOR_PATTERN);
}

export function urunAramaQueryOlustur(metin: string) {
  const akilliMetin = harfRakamAyir(metin.trim())
    .replace(/[._\-\/,+:;|()[\]{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!akilliMetin) return {};

  const kelimeler = akilliMetin.split(" ").filter(Boolean).slice(0, 6);

  return {
    $and: kelimeler.map((kelime) => {
      const regex = esnekRegexParcasi(kelime);
      return {
        $or: SEARCH_FIELDS.map((field) => ({
          [field]: { $regex: regex, $options: "i" },
        })),
      };
    }),
  };
}
