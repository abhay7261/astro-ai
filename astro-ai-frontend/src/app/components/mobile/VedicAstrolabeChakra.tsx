"use client";

import React from "react";

export default function VedicAstrolabeChakra() {
  const zodiacSymbols = [
    { symbol: "♈", name: "Mesha" },
    { symbol: "♉", name: "Vrishabha" },
    { symbol: "♊", name: "Mithuna" },
    { symbol: "♋", name: "Karka" },
    { symbol: "♌", name: "Simha" },
    { symbol: "♍", name: "Kanya" },
    { symbol: "♎", name: "Tula" },
    { symbol: "♏", name: "Vrishchika" },
    { symbol: "♐", name: "Dhanu" },
    { symbol: "♑", name: "Makara" },
    { symbol: "♒", name: "Kumbha" },
    { symbol: "♓", name: "Meena" },
  ];

  return (
    <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center pointer-events-none select-none">
      {/* 1. Ambient Golden-Saffron Celestial Aura Glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-400/20 to-yellow-300/30 blur-2xl animate-pulse" />

      {/* SVG Container for the Multi-Layer Astrolabe */}
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full filter drop-shadow-[0_4px_16px_rgba(217,119,6,0.35)]"
      >
        <defs>
          {/* Royal Gold Gradient */}
          <linearGradient id="chakraGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Saffron Fire Gradient */}
          <linearGradient id="chakraSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          {/* Lotus Petal Gradient */}
          <radialGradient id="petalGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.1" />
          </radialGradient>

          {/* Central Sun Disc Glow */}
          <radialGradient id="sunCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FDE047" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
        </defs>

        {/* ==========================================================
            LAYER 1: OUTER ZODIAC & NAKSHATRA WHEEL (Rotates Clockwise)
            24s Smooth Infinite Celestial Rotation
           ========================================================== */}
        <g
          className="astrolabe-outer-spin"
          style={{
            transformOrigin: "120px 120px",
          }}
        >
          {/* Outermost Celestial Border Rings */}
          <circle
            cx="120"
            cy="120"
            r="114"
            fill="none"
            stroke="url(#chakraGold)"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          <circle
            cx="120"
            cy="120"
            r="108"
            fill="none"
            stroke="url(#chakraSaffron)"
            strokeWidth="1.8"
            opacity="0.9"
          />
          <circle
            cx="120"
            cy="120"
            r="86"
            fill="none"
            stroke="url(#chakraGold)"
            strokeWidth="2"
            opacity="0.85"
          />

          {/* 12 Zodiac Houses Dividers & Glyphs */}
          {zodiacSymbols.map((item, idx) => {
            const angle = idx * 30;
            return (
              <g key={idx} transform={`rotate(${angle} 120 120)`}>
                {/* Spoke Divider Line */}
                <line
                  x1="120"
                  y1="86"
                  x2="120"
                  y2="108"
                  stroke="url(#chakraGold)"
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* Outer Celestial Star Bead */}
                <circle
                  cx="120"
                  cy="114"
                  r="2.5"
                  fill="url(#chakraGold)"
                />

                {/* Zodiac Medallion Background */}
                <circle
                  cx="120"
                  cy="97"
                  r="7.5"
                  fill="#FFF7ED"
                  stroke="url(#chakraGold)"
                  strokeWidth="1"
                  opacity="0.9"
                />

                {/* Zodiac Sign Symbol */}
                <text
                  x="120"
                  y="100.5"
                  textAnchor="middle"
                  fill="#9A3412"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  {item.symbol}
                </text>
              </g>
            );
          })}
        </g>

        {/* ==========================================================
            LAYER 2: SACRED 12-PETAL LOTUS & YANTRA (Rotates Reverse)
            16s Smooth Counter-Clockwise Rotation for Hypnotic Depth
           ========================================================== */}
        <g
          className="astrolabe-inner-reverse"
          style={{
            transformOrigin: "120px 120px",
          }}
        >
          {/* Intermediate Decorative Ring */}
          <circle
            cx="120"
            cy="120"
            r="76"
            fill="none"
            stroke="url(#chakraSaffron)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.75"
          />
          <circle
            cx="120"
            cy="120"
            r="50"
            fill="none"
            stroke="url(#chakraGold)"
            strokeWidth="2"
          />

          {/* 12 Sacred Lotus Petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (deg, idx) => (
              <g key={idx} transform={`rotate(${deg} 120 120)`}>
                {/* Petal Geometry */}
                <path
                  d="M 120 50 C 114 62, 112 72, 120 84 C 128 72, 126 62, 120 50 Z"
                  fill="url(#petalGlow)"
                  stroke="url(#chakraGold)"
                  strokeWidth="1.2"
                />
                {/* Center Petal Ray */}
                <line
                  x1="120"
                  y1="50"
                  x2="120"
                  y2="82"
                  stroke="url(#chakraSaffron)"
                  strokeWidth="1"
                  opacity="0.6"
                />
                {/* Tip Golden Dewdrop */}
                <circle
                  cx="120"
                  cy="84"
                  r="2"
                  fill="#F59E0B"
                />
              </g>
            )
          )}

          {/* Sacred Geometric Triangles (Shree Yantra vibes) */}
          <polygon
            points="120,68 138,98 102,98"
            fill="none"
            stroke="url(#chakraGold)"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <polygon
            points="120,98 138,68 102,68"
            fill="none"
            stroke="url(#chakraSaffron)"
            strokeWidth="1.2"
            opacity="0.7"
          />
        </g>

        {/* ==========================================================
            LAYER 3: DIVINE CENTER SURYA MANDALA & OM / BINDU
            Glows and Pulses Radiantly at the Center
           ========================================================== */}
        <g
          className="astrolabe-center-pulse"
          style={{
            transformOrigin: "120px 120px",
          }}
        >
          {/* Sun Ray Flares */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => (
            <line
              key={idx}
              x1="120"
              y1="94"
              x2="120"
              y2="102"
              transform={`rotate(${deg} 120 120)`}
              stroke="url(#chakraGold)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}

          {/* Center Sun Disc */}
          <circle
            cx="120"
            cy="120"
            r="18"
            fill="url(#sunCenterGlow)"
            stroke="#FFFBEB"
            strokeWidth="2"
          />

          {/* Center Inner Ring */}
          <circle
            cx="120"
            cy="120"
            r="14"
            fill="#7C2D12"
            stroke="#FDE047"
            strokeWidth="1"
          />

          {/* Sacred OM / Vedic Kalachakra Wheel Symbol */}
          <text
            x="120"
            y="125"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="14"
            fontWeight="bold"
            className="select-none filter drop-shadow-[0_0_6px_rgba(254,240,138,0.9)]"
          >
            ॐ
          </text>
        </g>
      </svg>

      {/* Embedded CSS Animations: Dual Counter-Rotation + Core Breathing Pulse */}
      <style jsx>{`
        .astrolabe-outer-spin {
          animation: spinOuter 22s linear infinite;
        }
        .astrolabe-inner-reverse {
          animation: spinInner 15s linear infinite;
        }
        .astrolabe-center-pulse {
          animation: pulseCenter 3s ease-in-out infinite;
        }

        @keyframes spinOuter {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spinInner {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes pulseCenter {
          0%,
          100% {
            transform: scale(0.96);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
