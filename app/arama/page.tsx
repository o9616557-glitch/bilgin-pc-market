import AramaSayfasiClient from "@/components/AramaSayfasiClient";

export const dynamic = "force-dynamic";

export default async function AramaSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const arananKelime = params?.q || "";
  return <AramaSayfasiClient initialQ={arananKelime} />;
}
