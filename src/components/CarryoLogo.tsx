import { useState } from 'react';

interface CarryoLogoProps {
  className?: string;
  heightClass?: string;
}

const LOGO_SRC = '/assets/aistudio/WhatsApp_Image_2026-11-21_at_4.40.22_PM_c4120bd7.jpeg';

export function CarryoLogo({ className = '', heightClass = 'h-10' }: CarryoLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <span
        className={`inline-flex items-center select-none ${heightClass} ${className}`}
        aria-label="Carryo"
      >
        <svg
          viewBox="0 0 218 76"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Carryo"
        >
          <defs>
            <linearGradient id="carryo-gold-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCE39D" />
              <stop offset="48%" stopColor="#E0B052" />
              <stop offset="100%" stopColor="#B88428" />
            </linearGradient>
          </defs>
          <path
            d="M58 26 C67 7, 137 7, 146 26"
            stroke="url(#carryo-gold-grad)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          <path
            d="M196 12 L198.8 19.6 L206.5 22.5 L198.8 25.4 L196 33 L193.2 25.4 L185.5 22.5 L193.2 19.6 Z"
            fill="url(#carryo-gold-grad)"
          />
          <text
            x="8"
            y="60"
            fill="url(#carryo-gold-grad)"
            fontFamily="'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif"
            fontWeight="700"
            fontSize="50"
            letterSpacing="-1.5"
          >
            carryo
          </text>
        </svg>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center overflow-hidden ${className}`}>
      <img
        src={LOGO_SRC}
        alt="Carryo"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`${heightClass} w-auto object-contain mix-blend-lighten select-none scale-[1.18] origin-left`}
      />
    </span>
  );
}
