import { useState } from 'react';
import { ColourId, GalleryAngleId, ProductSizeId } from '../types/store';
import { FINISHES, getFinishPhoto } from '../data/catalog';

interface ProductVisualProps {
  finishId: ColourId;
  sizeId?: ProductSizeId;
  angle?: GalleryAngleId;
  customPhotoUrl?: string;
  className?: string;
  alt?: string;
  objectFit?: 'cover' | 'contain';
}

function getLeatherettePalette(finishId: ColourId) {
  switch (finishId) {
    case 'tan':
      return {
        top: '#BA5C2B',
        mid: '#9E481D',
        dark: '#783412',
        seam: '#6A2C0E',
        stitch: '#D78455',
      };
    case 'grey':
      return {
        top: '#8B9097',
        mid: '#6E737B',
        dark: '#51565D',
        seam: '#42464D',
        stitch: '#AEB3BA',
      };
    case 'light-blue':
      return {
        top: '#AED3EB',
        mid: '#8CB9D7',
        dark: '#6C98B7',
        seam: '#5982A0',
        stitch: '#D2E8F6',
      };
    case 'light-pink':
      return {
        top: '#F3CCD6',
        mid: '#E2B0BE',
        dark: '#C48D9D',
        seam: '#AD7686',
        stitch: '#FAE2E9',
      };
    case 'black':
    default:
      return {
        top: '#2D2F35',
        mid: '#1A1C20',
        dark: '#0E0F12',
        seam: '#08090B',
        stitch: '#474B54',
      };
  }
}

export function ProductVisual({
  finishId,
  sizeId = 'large',
  angle = 'front',
  customPhotoUrl,
  className = '',
  alt,
  objectFit = 'cover',
}: ProductVisualProps) {
  const [imgError, setImgError] = useState(false);

  const finish = FINISHES[finishId] ?? FINISHES.black;
  const resolvedSrc = customPhotoUrl || getFinishPhoto(finishId, angle);
  const label = alt ?? `Carryo ${sizeId === 'large' ? 'Large' : 'Small'} in ${finish.name}`;

  // Render real photography when available (Black, Tan, Grey or custom uploaded)
  if (resolvedSrc && !imgError) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden bg-[#141418] flex items-center justify-center ${className}`}
      >
        <img
          src={resolvedSrc}
          alt={label}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`w-full h-full ${
            objectFit === 'contain' ? 'object-contain' : 'object-cover'
          }`}
        />
      </div>
    );
  }

  // Tailored soft-leatherette Carryo bag studio preview for Light Blue & Light Pink (or fallback)
  const p = getLeatherettePalette(finishId);
  const isSmall = sizeId === 'small';
  const uid = `${finishId}-${sizeId}-${angle}`;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{
        background:
          'radial-gradient(circle at 50% 34%, #25242B 0%, #15151A 56%, #0B0B0E 100%)',
      }}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox="0 0 640 480"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bag-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.top} />
            <stop offset="55%" stopColor={p.mid} />
            <stop offset="100%" stopColor={p.dark} />
          </linearGradient>
          <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCE197" />
            <stop offset="50%" stopColor="#E0B052" />
            <stop offset="100%" stopColor="#B68023" />
          </linearGradient>
          <linearGradient id={`steel-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CFD6DD" />
            <stop offset="32%" stopColor="#F5F7F9" />
            <stop offset="68%" stopColor="#B0B9C3" />
            <stop offset="100%" stopColor="#DCE2E8" />
          </linearGradient>
          <radialGradient id={`shadow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Studio stone plinth */}
        <rect x="0" y="346" width="640" height="134" fill="#141418" />
        <line x1="0" y1="346" x2="640" y2="346" stroke="#282830" strokeWidth="1" />
        <ellipse cx="320" cy="368" rx={isSmall ? 170 : 210} ry="24" fill={`url(#shadow-${uid})`} />

        {/* Leatherette Carryo Bag Silhouette */}
        <g
          transform={isSmall ? 'translate(38, 22) scale(0.88)' : 'translate(0, 0)'}
        >
          {/* Twin Leatherette Handles */}
          <path
            d="M196 164 C196 106, 246 106, 246 164"
            stroke={`url(#bag-${uid})`}
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M196 164 C196 106, 246 106, 246 164"
            stroke={p.stitch}
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <path
            d="M394 164 C394 106, 444 106, 444 164"
            stroke={`url(#bag-${uid})`}
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M394 164 C394 106, 444 106, 444 164"
            stroke={p.stitch}
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />

          {/* Main Structured Leatherette Body */}
          <rect
            x="130"
            y="148"
            width="380"
            height="208"
            rx="28"
            fill={`url(#bag-${uid})`}
            stroke={p.seam}
            strokeWidth="2"
          />
          {/* Subtle top leatherette sheen */}
          <path
            d="M164 156 H476"
            stroke="#FFFFFF"
            strokeOpacity="0.28"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Front Black Zipper Pocket */}
          <rect x="134" y="218" width="372" height="12" rx="4" fill="#18191D" />
          <line
            x1="142"
            y1="224"
            x2="498"
            y2="224"
            stroke="#3C3F47"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Zipper pull */}
          <rect x="466" y="220" width="12" height="24" rx="5" fill="#2A2C33" stroke="#525661" />

          {/* Metallic Gold Carryo by Warmland Patch */}
          <rect
            x="376"
            y="164"
            width="102"
            height="44"
            rx="7"
            fill="#141518"
            stroke={`url(#gold-${uid})`}
            strokeWidth="1.8"
          />
          <path
            d="M407 177 C412 169, 440 169, 445 177"
            stroke={`url(#gold-${uid})`}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <text
            x="426"
            y="192"
            textAnchor="middle"
            fill={`url(#gold-${uid})`}
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="700"
            fontSize="18"
          >
            carryo
          </text>
          <text
            x="427"
            y="202"
            textAnchor="middle"
            fill="#C9A55A"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="5.5"
            letterSpacing="0.8"
          >
            by Warmland
          </text>

          {/* Bottom seam piping */}
          <line
            x1="154"
            y1="342"
            x2="486"
            y2="342"
            stroke={p.seam}
            strokeWidth="2"
            opacity="0.6"
          />
        </g>

        {/* Stainless Steel Round Containers in Foreground */}
        {isSmall ? (
          <g>
            {/* 2 Containers for Small Box */}
            <rect
              x="212"
              y="324"
              width="98"
              height="52"
              rx="10"
              fill={`url(#steel-${uid})`}
              stroke="#97A1AC"
              strokeWidth="1.2"
            />
            <ellipse cx="261" cy="326" rx="49" ry="9" fill="#E8EDF1" stroke="#AEB7C0" />
            <rect
              x="330"
              y="324"
              width="98"
              height="52"
              rx="10"
              fill={`url(#steel-${uid})`}
              stroke="#97A1AC"
              strokeWidth="1.2"
            />
            <ellipse cx="379" cy="326" rx="49" ry="9" fill="#E8EDF1" stroke="#AEB7C0" />
          </g>
        ) : (
          <g>
            {/* 3 Containers for Large Box */}
            <rect
              x="156"
              y="326"
              width="94"
              height="50"
              rx="10"
              fill={`url(#steel-${uid})`}
              stroke="#97A1AC"
              strokeWidth="1.2"
            />
            <ellipse cx="203" cy="328" rx="47" ry="8.5" fill="#E8EDF1" stroke="#AEB7C0" />
            <rect
              x="273"
              y="326"
              width="94"
              height="50"
              rx="10"
              fill={`url(#steel-${uid})`}
              stroke="#97A1AC"
              strokeWidth="1.2"
            />
            <ellipse cx="320" cy="328" rx="47" ry="8.5" fill="#E8EDF1" stroke="#AEB7C0" />
            <rect
              x="390"
              y="326"
              width="94"
              height="50"
              rx="10"
              fill={`url(#steel-${uid})`}
              stroke="#97A1AC"
              strokeWidth="1.2"
            />
            <ellipse cx="437" cy="328" rx="47" ry="8.5" fill="#E8EDF1" stroke="#AEB7C0" />
          </g>
        )}

        {/* Quiet Finish Caption */}
        <text
          x="320"
          y="428"
          textAnchor="middle"
          fill="#A1A1AA"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="12"
          fontWeight="500"
        >
          {finish.name} · {isSmall ? 'Small (2 Containers)' : 'Large (3 Containers)'} · Colour Preview
        </text>
      </svg>
    </div>
  );
}
