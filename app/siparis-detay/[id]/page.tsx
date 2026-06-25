import SiparisDetayClient from "./SiparisDetayClient";

export default async function SiparisDetaySayfasi({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Sadece ID'yi alıp direkt vitrine yolluyoruz. Veritabanına gitmek, bekletmek YASAK!
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  return <SiparisDetayClient id={orderId} />;
}