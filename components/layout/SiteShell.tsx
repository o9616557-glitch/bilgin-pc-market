import React from "react";

type SiteShellProps = {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  container?: "default" | "narrow" | "wide" | "none";
};

const containerClass = {
  default: "site-container",
  narrow: "site-container-narrow",
  wide: "site-container-wide",
  none: "",
};

export default function SiteShell({
  children,
  className = "",
  glow = true,
  container = "none",
}: SiteShellProps) {
  const wrap = containerClass[container];

  return (
    <div className={`site-page ${className}`}>
      {glow && (
        <>
          <div className="site-glow-top top-[-12%] left-[-8%] w-[min(520px,90vw)] h-[min(520px,90vw)]" />
          <div className="site-glow-bottom bottom-[-15%] right-[-10%] w-[min(600px,95vw)] h-[min(600px,95vw)]" />
        </>
      )}
      <div className={`site-content-in relative z-10 ${wrap}`}>{children}</div>
    </div>
  );
}
