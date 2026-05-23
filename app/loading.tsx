export default function Loading() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#0f172a" // Senin temanın koyu lacivert/siyah arka planı
    }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .neon-loader {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .neon-loader::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 4px solid #00e5ff;
          animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .neon-core {
          position: absolute;
          inset: 20px;
          background: #00e5ff;
          border-radius: 50%;
          box-shadow: 0 0 20px #00e5ff, 0 0 40px #00e5ff;
          animation: pulse-ring 1.5s alternate infinite;
        }
      `}</style>

      <div className="neon-loader">
        <div className="neon-core"></div>
      </div>
      <h2 style={{
        marginTop: "30px",
        color: "#00e5ff",
        fontWeight: "900",
        letterSpacing: "4px",
        fontSize: "1.2rem",
        textTransform: "uppercase"
      }}>
        Dükkan Açılıyor...
      </h2>
    </div>
  );
}