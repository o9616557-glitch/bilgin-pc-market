export default function Loading() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#0f172a", // Senin Bilgin PC temanın koyu arka planı
      padding: "20px" // Telefondaki sıkışmayı önleyen padding
    }}>
      <style>{`
        @keyframes spinner-dual-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .modern-loader {
          display: inline-block;
          width: 60px; // Responsive boyut
          height: 60px; // Responsive boyut
        }
        .modern-loader::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid #3b82f6; // Senin meşhur Neon Mavi Rengin
          border-color: #3b82f6 transparent #3b82f6 transparent;
          animation: spinner-dual-ring 1.2s linear infinite;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); // Sleek neon efekt
        }
      `}</style>

      {/* ŞEFİM: İşte requested minimalist ve sleek loader iconumuz */}
      <div className="modern-loader"></div>
    </div>
  );
}