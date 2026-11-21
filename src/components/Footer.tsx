import { ColourId, CurrencyCode } from '../types/store';
import { CarryoLogo } from './CarryoLogo';

interface FooterProps {
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onNavigateHome: (sectionId?: string) => void;
  onOpenTracking: () => void;
  onSelectProduct: (productId: string, initialFinishId?: ColourId) => void;
}

export function Footer({
  currency,
  onChangeCurrency,
  onNavigateHome,
  onOpenTracking,
  onSelectProduct,
}: FooterProps) {
  return (
    <footer className="border-t border-[#222228] bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#202026]">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigateHome('top')}
              className="cursor-pointer"
              aria-label="Carryo Home"
            >
              <CarryoLogo heightClass="h-10" />
            </button>
            <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA] max-w-sm">
              Carryo by Warmland crafts premium leatherette electric heating lunchboxes
              with stainless steel containers—so hot, home-cooked meals travel effortlessly
              wherever you work.
            </p>
            <p className="mt-4 text-xs text-[#71717A]">
              Support: care@carryo.store · Mon–Sat, 9 AM – 7 PM IST
            </p>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-[#F5F3EE] mb-4">Products</h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProduct('carryo-large', 'black')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  Carryo Large (3 Bowls)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProduct('carryo-small', 'tan')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  Carryo Small (2 Bowls)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProduct('carryo-large', 'grey')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  Shop Grey Edition
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProduct('carryo-large', 'light-blue')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  Light Blue & Light Pink
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-[#F5F3EE] mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('how-it-works')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('compare')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  Large vs. Small
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('shop')}
                  className="hover:text-[#E0B052] transition-colors cursor-pointer"
                >
                  1-Year Warranty
                </button>
              </li>
            </ul>
          </div>

          {/* Currency & Checkout Methods */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-[#F5F3EE] mb-4">Store Region</h3>
            <div className="inline-flex items-center gap-1 p-1 bg-[#141418] border border-[#26262C] rounded-lg">
              <button
                type="button"
                onClick={() => onChangeCurrency('INR')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-[#E0B052] text-[#080809]'
                    : 'text-[#A1A1AA] hover:text-[#F5F3EE]'
                }`}
              >
                India (INR ₹)
              </button>
              <button
                type="button"
                onClick={() => onChangeCurrency('USD')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-[#E0B052] text-[#080809]'
                    : 'text-[#A1A1AA] hover:text-[#F5F3EE]'
                }`}
              >
                Global (USD $)
              </button>
            </div>
            <p className="mt-4 text-xs text-[#A1A1AA] leading-relaxed">
              Accepted at checkout: Visa, Mastercard, RuPay, UPI, Apple Pay, Google Pay &
              Cash on Delivery.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} Carryo by Warmland. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>2 Sizes · 5 Colours</span>
            <span>Food-Grade Stainless Steel</span>
            <span>1-Year Replacement Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
