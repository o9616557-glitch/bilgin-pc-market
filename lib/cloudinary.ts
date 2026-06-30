/**
 * Katalog ikonları için Cloudinary URL optimizasyonu.
 * Retina ekranlar için displayPx * 2 boyutunda, WebP + otomatik kalite.
 */
export function cloudinaryKatalogResim(url: string, displayPx: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const uploadMarker = "/image/upload/";
  const markerIndex = url.indexOf(uploadMarker);
  if (markerIndex === -1) return url;

  const afterUpload = url.slice(markerIndex + uploadMarker.length);
  // Zaten transform varsa dokunma
  if (!afterUpload.startsWith("v")) return url;

  const pixelSize = Math.round(displayPx * 2);
  const transforms = `q_auto:good,f_auto,w_${pixelSize},h_${pixelSize},c_pad,b_transparent`;

  return url.replace(uploadMarker, `${uploadMarker}${transforms}/`);
}

/** Ürün detay görselleri — tam boy yerine sayfa boyutuna uygun, hızlı yüklenir. */
export function cloudinaryUrunResim(url: string, maxWidth = 900): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const uploadMarker = "/image/upload/";
  const markerIndex = url.indexOf(uploadMarker);
  if (markerIndex === -1) return url;

  const afterUpload = url.slice(markerIndex + uploadMarker.length);
  if (!afterUpload.startsWith("v")) return url;

  const transforms = `q_auto:good,f_auto,w_${maxWidth},c_limit`;
  return url.replace(uploadMarker, `${uploadMarker}${transforms}/`);
}
