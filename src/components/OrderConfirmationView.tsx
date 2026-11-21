import { ArrowRight, CheckCircle2, Printer, Truck } from 'lucide-react';
import { Order } from '../types/store';
import { formatPrice } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface OrderConfirmationViewProps {
  order: Order;
  customPhotos: Record<string, string>;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export function OrderConfirmationView({
  order,
  customPhotos,
  onTrackOrder,
  onContinueShopping,
}: OrderConfirmationViewProps) {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-10">
          {/* Status Header */}
          <div className="flex items-start gap-4 pb-8 border-b border-[#222228]">
            <div className="w-12 h-12 rounded-xl bg-[#34D399]/15 text-[#34D399] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#34D399]">
                Order #{order.id} Confirmed — Preparing Shipment
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#F5F3EE]">
                Thank you, {order.address.fullName.split(' ')[0]}. Your Carryo is queued for QA.
              </h1>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                A confirmation receipt and digital 2-year warranty card have been prepared for{' '}
                <strong className="text-[#F5F3EE] font-medium">{order.address.email}</strong>.
              </p>
            </div>
          </div>

          {/* Order Meta Grid */}
          <div className="py-6 border-b border-[#222228] grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs text-[#A1A1AA]">Order Number</p>
              <p className="mt-1 font-mono tabular-nums font-semibold text-[#E0B052]">
                {order.id}
              </p>
              <p className="mt-0.5 text-xs text-[#71717A] font-mono">{order.transactionRef}</p>
            </div>
            <div>
              <p className="text-xs text-[#A1A1AA]">Estimated Delivery</p>
              <p className="mt-1 font-semibold text-[#F5F3EE]">{order.estimatedDelivery}</p>
              <p className="mt-0.5 text-xs text-[#A1A1AA]">{order.shippingMethod.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#A1A1AA]">Payment</p>
              <p className="mt-1 font-semibold text-[#F5F3EE]">{order.paymentSummary}</p>
              <p className="mt-0.5 text-xs text-[#A1A1AA]">{order.createdAt}</p>
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="py-6 border-b border-[#222228] text-sm">
            <p className="text-xs font-semibold text-[#A1A1AA] mb-1.5">Shipping Address</p>
            <p className="font-semibold text-[#F5F3EE]">{order.address.fullName}</p>
            <p className="text-[#A1A1AA]">
              {order.address.street}
              {order.address.apartment ? `, ${order.address.apartment}` : ''}
            </p>
            <p className="text-[#A1A1AA]">
              {order.address.city}, {order.address.state} {order.address.postalCode},{' '}
              {order.address.country}
            </p>
            <p className="text-xs text-[#71717A] mt-1 font-mono">{order.address.phone}</p>
          </div>

          {/* Itemized Receipt */}
          <div className="py-6 border-b border-[#222228]">
            <p className="text-xs font-semibold text-[#A1A1AA] mb-4">Items Ordered</p>
            <ul className="divide-y divide-[#202026]">
              {order.items.map((item) => (
                <li key={item.key} className="py-3.5 first:pt-0 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#26262C] bg-[#141418] shrink-0">
                    <ProductVisual
                      finishId={item.finishId}
                      sizeId={item.sizeId}
                      angle="front"
                      customPhotoUrl={customPhotos[item.finishId]}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F5F3EE]">{item.name}</p>
                    <p className="text-xs text-[#A1A1AA]">
                      {item.finishName} · {item.sizeId === 'large' ? '3 Containers' : '2 Containers'} · Qty{' '}
                      {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-semibold text-[#F5F3EE]">
                    {formatPrice(item.unitPriceInr * item.quantity, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="py-6 space-y-2 text-sm">
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-[#F5F3EE]">
                {formatPrice(order.subtotalInr, order.currency)}
              </span>
            </div>
            {order.discountInr > 0 && (
              <div className="flex justify-between text-[#34D399]">
                <span>Promo Discount ({order.promoCode})</span>
                <span className="font-mono tabular-nums">
                  -{formatPrice(order.discountInr, order.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Shipping</span>
              <span className="font-mono tabular-nums text-[#F5F3EE]">
                {order.shippingInr === 0 ? 'Free' : formatPrice(order.shippingInr, order.currency)}
              </span>
            </div>
            {order.codFeeInr > 0 && (
              <div className="flex justify-between text-[#A1A1AA]">
                <span>COD Handling Fee</span>
                <span className="font-mono tabular-nums text-[#F5F3EE]">
                  {formatPrice(order.codFeeInr, order.currency)}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-[#222228] flex justify-between text-lg font-bold text-[#F5F3EE]">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums text-[#E0B052]">
                {formatPrice(order.totalInr, order.currency)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onTrackOrder(order.id)}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4" aria-hidden="true" />
                <span>Track Order Status</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#F5F3EE] bg-[#1C1C22] hover:bg-[#26262E] border border-[#2E2E36] rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print Receipt</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onContinueShopping}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E0B052] hover:text-[#ECC46E] cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
