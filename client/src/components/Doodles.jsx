import React from 'react';

/**
 * CrayonTexture Filter Component
 * Provides a rough, hand-drawn texture effect for SVGs.
 */
const CrayonFilter = ({ id }) => (
  <defs>
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
    </filter>
  </defs>
);

export const FlowerDoodle = ({ className = "w-24 h-24", color = "#ef5d47" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <CrayonFilter id="crayonPencil" />
    <g style={{ filter: 'url(#crayonPencil)' }}>
      {/* Central Circle */}
      <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="4" strokeLinecap="round" className="opacity-90" />
      {/* Petals - Simple, bold loops like the reference */}
      <path
        d="M50 38C50 38 40 15 60 15C80 15 75 35 65 38M62 50C62 50 85 40 85 60C85 80 65 75 62 65M50 62C50 62 60 85 40 85C20 85 25 65 35 62M38 50C38 50 15 60 15 40C15 20 35 25 38 35M50 38C50 38 60 15 40 15C20 15 25 35 35 38"
        stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-90"
      />
    </g>
  </svg>
);

export const ScribbleDoodle = ({ className = "w-full h-8", color = "#ef5d47" }) => (
  <svg viewBox="0 0 400 40" className={className} preserveAspectRatio="none">
    <CrayonFilter id="crayonLine" />
    <path
      d="M5 25C70 28 135 22 200 26C265 30 330 18 395 24"
      stroke={color} strokeWidth="4" strokeLinecap="round"
      style={{ filter: 'url(#crayonLine)' }}
      className="opacity-90"
    />
  </svg>
);

export const CircleDoodle = ({ className = "w-12 h-12", color = "#ef5d47" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <CrayonFilter id="crayonCircle" />
    <path
      d="M50 15C70 15 85 30 85 50C85 70 70 85 50 85C30 85 15 70 15 50C15 30 30 15 50 15Z"
      stroke={color} strokeWidth="4" strokeLinecap="round"
      style={{ filter: 'url(#crayonCircle)' }}
      className="opacity-90"
    />
  </svg>
);
