import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { CarryoLogo } from './CarryoLogo';

interface HeaderProps {
  cartCount: number;
  onNavigateHome: (sectionId?: string) => void;
  onOpenTracking: () => void;
  onOpenCart: () => void;
}

export function Header({
  cartCount,
  onNavigateHome,
  onOpenTracking,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionLink = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateHome(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080809]/95 backdrop-blur-md border-b border-[#222228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand mark */}
        <button
          type="button"
          onClick={() => handleSectionLink('top')}
          className="flex items-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 rounded"
          aria-label="Carryo Home"
        >
          <CarryoLogo heightClass="h-10" />
        </button>

        {/* Zone 2: 4 clean single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]"
        >
          <button
            type="button"
            onClick={() => handleSectionLink('shop')}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-4 decoration-[#E0B052] decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('how-it-works')}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-4 decoration-[#E0B052] decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('compare')}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-4 decoration-[#E0B052] decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracking();
            }}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-4 decoration-[#E0B052] decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Bag) + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label={`Open shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Bag</span>
            <span className="font-mono tabular-nums font-bold">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#F5F3EE] hover:bg-[#18181C] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#222228] bg-[#0C0C0F] px-4 py-4 space-y-1">
          <button
            type="button"
            onClick={() => handleSectionLink('shop')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#F5F3EE] hover:bg-[#18181C] rounded-lg"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('how-it-works')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#F5F3EE] hover:bg-[#18181C] rounded-lg"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('compare')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#F5F3EE] hover:bg-[#18181C] rounded-lg"
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracking();
            }}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#F5F3EE] hover:bg-[#18181C] rounded-lg"
          >
            Track Order
          </button>
        </div>
      )}
    </header>
  );
}
