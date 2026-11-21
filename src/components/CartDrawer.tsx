import { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { CartItem, CurrencyCode, PromoCode } from '../types/store';
import { formatPrice, PROMO_CODES } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  customPhotos: Record<string, string>;
  appliedPromo: PromoCode | null;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onApplyPromo: (promo: PromoCode | null) => void;
  onProceedToCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD_INR = 1500;

export function CartDrawer({
  open,
  items,
  currency,
  customPhotos,
  appliedPromo,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onApplyPromo,
  onProceedToCheckout,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!open) return null;

  const subtotalInr = items.reduce((sum, item) => sum + item.unitPriceInr * item.quantity, 0);
  const discountInr = appliedPromo
    ? appliedPromo.type === 'percent'
      ? Math.round((subtotalInr * appliedPromo.value) / 100)
      : Math.min(appliedPromo.value, subtotalInr)
    : 0;
  const afterDiscountInr = Math.max(0, subtotalInr - discountInr);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotalInr);
  const freeShippingPct = Math.min(
    100,
    Math.round((subtotalInr / FREE_SHIPPING_THRESHOLD_INR) * 100)
  );
  const estimatedShippingInr =
    subtotalInr >= FREE_SHIPPING_THRESHOLD_INR || items.length === 0 ? 0 : 149;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) return;
    const found = PROMO_CODES.find((p) => p.code === cleaned);
    if (!found) {
      setPromoError('Invalid code. Try CARRYO10 or WARMLUNCH.');
      return;
    }
    if (subtotalInr < found.minSubtotalInr) {
      setPromoError(
        `Requires a minimum order of ${formatPrice(found.minSubtotalInr, currency)}.`
      );
      return;
    }
    setPromoError('');
    onApplyPromo(found);
    setPromoInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#0E0E11] h-full flex flex-col shadow-2xl border-l border-[#26262C]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#121216] border-b border-[#26262C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E0B052]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#F5F3EE]">
              Your Bag{' '}
              <span className="font-mono tabular-nums text-sm font-medium text-[#A1A1AA]">
                ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F3EE] hover:bg-[#1C1C22] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-6 py-3.5 bg-[#15151A] border-b border-[#24242A]">
            <p className="text-xs font-medium text-[#F5F3EE]">
              {freeShippingRemaining === 0
                ? 'You unlocked Free Tracked Shipping on this order.'
                : `Add ${formatPrice(freeShippingRemaining, currency)} more for Free Tracked Shipping.`}
            </p>
            <div className="mt-2 h-1.5 w-full bg-[#26262E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E0B052] rounded-full transition-all duration-300"
                style={{ width: `${freeShippingPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#18181D] border border-[#26262C] flex items-center justify-center text-[#E0B052] mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-[#F5F3EE]">Your bag is empty</p>
              <p className="mt-1.5 text-sm text-[#A1A1AA] max-w-xs">
                Explore Carryo cordless and plug-in electric lunchboxes for hot meals anywhere.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors cursor-pointer"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#222228]">
              {items.map((item) => (
                <li key={item.key} className="py-5 first:pt-0 flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#26262C] bg-[#141418] shrink-0">
                    <ProductVisual
                      finishId={item.finishId}
                      sizeId={item.sizeId}
                      angle="front"
                      customPhotoUrl={customPhotos[item.finishId]}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#F5F3EE] truncate">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#71717A] hover:text-[#F87171] transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-[#A1A1AA]">
                      Colour: {item.finishName} · {item.sizeId === 'large' ? '3 Containers' : '2 Containers'}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-[#26262C] rounded-lg bg-[#141418]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, -1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#F5F3EE] hover:bg-[#22222A] rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono tabular-nums text-xs font-semibold text-[#F5F3EE]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#F5F3EE] hover:bg-[#22222A] rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-semibold text-[#F5F3EE]">
                        {formatPrice(item.unitPriceInr * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Totals & Checkout CTA */}
        {items.length > 0 && (
          <div className="px-6 py-5 bg-[#121216] border-t border-[#26262C] space-y-4">
            {/* Promo Code Field */}
            {appliedPromo ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#18181D] border border-[#2A2A32] rounded-lg text-xs">
                <div className="flex items-center gap-2 text-[#F5F3EE]">
                  <Tag className="w-3.5 h-3.5 text-[#E0B052]" aria-hidden="true" />
                  <span className="font-mono font-semibold text-[#E0B052]">
                    {appliedPromo.code}
                  </span>
                  <span className="text-[#A1A1AA]">applied</span>
                </div>
                <button
                  type="button"
                  onClick={() => onApplyPromo(null)}
                  className="text-[#A1A1AA] hover:text-[#F5F3EE] font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handlePromoSubmit} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      if (promoError) setPromoError('');
                    }}
                    placeholder="Promo code (try CARRYO10)"
                    className="flex-1 px-3 py-2 text-xs bg-[#0B0B0D] border border-[#26262C] rounded-lg text-[#F5F3EE] placeholder:text-[#71717A] focus:border-[#E0B052] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold text-[#F5F3EE] bg-[#1C1C22] hover:bg-[#26262E] border border-[#2E2E36] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-[#F87171]">{promoError}</p>}
              </form>
            )}

            {/* Price Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#F5F3EE]">
                  {formatPrice(subtotalInr, currency)}
                </span>
              </div>
              {discountInr > 0 && (
                <div className="flex justify-between text-[#34D399]">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(discountInr, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Estimated Shipping</span>
                <span className="font-mono tabular-nums text-[#F5F3EE]">
                  {estimatedShippingInr === 0 ? 'Free' : formatPrice(estimatedShippingInr, currency)}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#222228] flex justify-between text-base font-bold text-[#F5F3EE]">
                <span>Total</span>
                <span className="font-mono tabular-nums text-[#E0B052]">
                  {formatPrice(afterDiscountInr + estimatedShippingInr, currency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
