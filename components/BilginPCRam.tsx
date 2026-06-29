"use client";

import React from "react";

type BilginPCRamProps = {
  compact?: boolean;
};

export default function BilginPCRam({ compact = false }: BilginPCRamProps) {
  return (
    <div className={`ram-wrapper${compact ? " ram-wrapper--compact" : ""}`}>
      <div className="ram-container">
        <div className="blue-bar" />
        <div className="heatsink">
          <div className="heatsink-texture" />
          <div className="logo">BİLGİN PC</div>
          <div className="specs">DDR5 - 32GB</div>
        </div>
        <div className="pcb">
          <div className="pins-container">
            <div className="pins-left" />
            <div className="notch" />
            <div className="pins-right" />
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ram-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 350px;
          width: 100%;
          overflow: hidden;
        }
        .ram-wrapper--compact {
          height: 100%;
          width: 100%;
          min-height: 0;
        }
        .ram-container {
          position: relative;
          width: 600px;
          height: 140px;
          transform: rotate(-20deg) scale(0.9);
          filter: drop-shadow(15px 25px 20px rgba(0, 0, 0, 0.6));
          transition: transform 0.3s ease;
        }
        .ram-wrapper:not(.ram-wrapper--compact) .ram-container:hover {
          transform: rotate(-15deg) scale(0.95);
        }

        /* Katalog ikonu — küçük ölçek yok, net piksel boyutları */
        .ram-wrapper--compact .ram-container {
          width: 168px;
          height: 40px;
          transform: rotate(-14deg);
          filter: drop-shadow(3px 5px 6px rgba(0, 0, 0, 0.55));
          transition: none;
        }
        .ram-wrapper--compact .blue-bar {
          height: 6px;
          border-radius: 4px 4px 0 0;
          box-shadow: 0 -2px 8px rgba(0, 210, 255, 0.45);
        }
        .ram-wrapper--compact .heatsink {
          top: 5px;
          height: 26px;
          border-radius: 3px;
          border-width: 1px;
          padding: 0 10px;
        }
        .ram-wrapper--compact .heatsink-texture {
          background: repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0.03) 12px);
        }
        .ram-wrapper--compact .logo {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-shadow: 0 0 6px rgba(0, 210, 255, 0.7);
        }
        .ram-wrapper--compact .specs {
          font-size: 7px;
        }
        .ram-wrapper--compact .pcb {
          top: 28px;
          height: 12px;
          border-radius: 0 0 3px 3px;
        }
        .ram-wrapper--compact .pins-container {
          height: 5px;
          padding: 0 4px;
        }
        .ram-wrapper--compact .pins-left,
        .ram-wrapper--compact .pins-right {
          background: repeating-linear-gradient(90deg, #d4af37, #d4af37 2px, #050a0f 2px, #050a0f 3px);
        }
        .ram-wrapper--compact .notch {
          margin: 0 2px;
        }

        .blue-bar {
          position: absolute;
          top: 0; left: 2%; width: 96%; height: 20px;
          border-radius: 8px 8px 0 0;
          background: linear-gradient(90deg, #001f3f, #007bff, #00d2ff, #007bff, #001f3f);
          background-size: 200% 200%;
          animation: blue-glow 3s linear infinite;
          box-shadow: 0 -5px 20px rgba(0, 210, 255, 0.5);
          z-index: 2;
        }
        @keyframes blue-glow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .heatsink {
          position: absolute;
          top: 15px; left: 0; width: 100%; height: 90px;
          background: linear-gradient(to bottom, #101820, #0a0f14);
          border-radius: 5px;
          border: 2px solid #1c2833;
          border-top: 1px solid #2c3e50;
          box-sizing: border-box;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          box-shadow: inset 0 5px 15px rgba(0, 123, 255, 0.05);
        }
        .heatsink-texture {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 40px);
          pointer-events: none;
        }
        .logo {
          color: #00d2ff;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: 4px;
          font-style: italic;
          text-shadow: 0 0 15px rgba(0, 210, 255, 0.6);
          z-index: 4;
        }
        .specs {
          color: #557;
          font-size: 16px;
          font-family: monospace;
          font-weight: bold;
          z-index: 4;
        }
        .pcb {
          position: absolute;
          top: 100px; left: 4%; width: 92%; height: 40px;
          background-color: #050a0f;
          border-radius: 0 0 5px 5px;
          z-index: 1;
          display: flex;
          align-items: flex-end;
        }
        .pins-container {
          width: 100%; height: 12px;
          display: flex; padding: 0 10px; box-sizing: border-box;
        }
        .pins-left {
          flex: 5.5; height: 100%;
          background: repeating-linear-gradient(90deg, #d4af37, #d4af37 3px, #050a0f 3px, #050a0f 5px);
          border-top: 1px solid #8b6508; border-radius: 0 0 0 3px;
        }
        .notch {
          flex: 0.15; height: 100%;
          margin: 0 4px; border-top: 1px solid transparent;
        }
        .pins-right {
          flex: 4.35; height: 100%;
          background: repeating-linear-gradient(90deg, #d4af37, #d4af37 3px, #050a0f 3px, #050a0f 5px);
          border-top: 1px solid #8b6508; border-radius: 0 0 3px 0;
        }
      `,
        }}
      />
    </div>
  );
}
