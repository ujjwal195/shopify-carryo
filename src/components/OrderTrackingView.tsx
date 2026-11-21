import { useState } from 'react';
import { ArrowLeft, Check, Package, Search, Truck } from 'lucide-react';
import { Order } from '../types/store';
import { DEMO_TRACKING_ORDER, formatPrice } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface OrderTrackingViewProps {
  orders: Order[];
  initialOrderId?: string;
  customPhotos: Record<string, string>;
  onBackToShop: () => void;
}

export function OrderTrackingView({
  orders,
  initialOrderId,
  customPhotos,
  onBackToShop,
}: OrderTrackingViewProps) {
  const allOrders = [
    ...orders,
    ...(orders.some((o) => o.id === DEMO_TRACKING_ORDER.id) ? [] : [DEMO_TRACKING_ORDER]),
  ];

  const defaultId = initialOrderId ?? allOrders[0]?.id ?? DEMO_TRACKING_ORDER.id;
  const [searchInput, setSearchInput] = useState(defaultId);
  const [selectedOrderId, setSelectedOrderId] = useState(defaultId);
  const [lookupError, setLookupError] = useState('');

  const activeOrder = allOrders.find(
    (o) => o.id.toLowerCase() === selectedOrderId.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchInput.trim().toLowerCase();
    const match = allOrders.find((o) => o.id.toLowerCase() === cleaned);
    if (!match) {
      setLookupError('Order ID not found. Try selecting one of your orders below.');
      return;
    }
    setLookupError('');
    setSelectedOrderId(match.id);
  };

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#A1A1AA] hover:text-[#F5F3EE] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Store</span>
        </button>

        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#E0B052] mb-2">Order Fulfillment Tracker</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F3EE]">
            Track your Carryo shipment.
          </h1>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Enter your Carryo order ID from your confirmation receipt to check thermal QA and live
            courier dispatch status.
          </p>
        </div>

        {/* Lookup Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (lookupError) setLookupError('');
              }}
              placeholder="e.g. CYO-2026-8412"
              className="w-full pl-10 pr-4 py-3 text-sm font-mono bg-[#111114] border border-[#2A2A32] rounded-lg text-[#F5F3EE] placeholder:text-[#71717A] focus:border-[#E0B052] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Track Order
          </button>
        </form>

        {lookupError && <p className="mt-2 text-xs font-medium text-[#F87171]">{lookupError}</p>}

        {/* Quick Order Switcher */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
          <span>Available orders:</span>
          {allOrders.map((ord) => (
            <button
              key={ord.id}
              type="button"
              onClick={() => {
                setSearchInput(ord.id);
                setSelectedOrderId(ord.id);
                setLookupError('');
              }}
              className={`px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                ord.id === activeOrder?.id
                  ? 'bg-[#E0B052] text-[#080809] font-semibold'
                  : 'bg-[#18181D] border border-[#26262C] text-[#F5F3EE] hover:border-[#3E3E48]'
              }`}
            >
              {ord.id}
              {ord.id === DEMO_TRACKING_ORDER.id ? ' (Sample)' : ''}
            </button>
          ))}
        </div>

        {/* Active Order Result */}
        {activeOrder && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Timeline Column */}
            <div className="lg:col-span-7 bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#222228]">
                <div>
                  <p className="font-mono text-xs text-[#A1A1AA]">ORDER #{activeOrder.id}</p>
                  <h2 className="mt-1 text-xl font-bold text-[#F5F3EE]">
                    Status: {activeOrder.status}
                  </h2>
                </div>
                <div className="text-left sm:text-right text-xs">
                  <p className="text-[#A1A1AA]">Estimated Arrival</p>
                  <p className="mt-0.5 font-semibold text-[#E0B052] text-sm">
                    {activeOrder.estimatedDelivery}
                  </p>
                </div>
              </div>

              <ol className="mt-7 space-y-6">
                {activeOrder.timeline.map((step, idx) => {
                  const isLast = idx === activeOrder.timeline.length - 1;
                  return (
                    <li key={step.title} className="relative flex gap-4">
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-[13px] top-7 bottom-[-24px] w-[2px] ${
                            step.completed ? 'bg-[#E0B052]' : 'bg-[#26262C]'
                          }`}
                        />
                      )}
                      <span
                        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono ${
                          step.current
                            ? 'bg-[#E0B052] text-[#080809] font-bold'
                            : step.completed
                            ? 'bg-[#2E271A] text-[#E0B052] border border-[#E0B052]/50'
                            : 'bg-[#18181D] text-[#71717A] border border-[#26262C]'
                        }`}
                      >
                        {step.completed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </span>
                      <div className="flex-1 pb-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              step.completed || step.current ? 'text-[#F5F3EE]' : 'text-[#71717A]'
                            }`}
                          >
                            {step.title}
                          </p>
                          <span className="font-mono text-xs text-[#71717A]">{step.timestamp}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                          {step.subtitle}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Shipment Metadata & Package Contents */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#111114] border border-[#26262C] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#F5F3EE]">
                  <Truck className="w-4 h-4 text-[#E0B052]" aria-hidden="true" />
                  <span>Courier Details</span>
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Carrier</dt>
                    <dd className="font-semibold text-[#F5F3EE]">{activeOrder.courierName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Tracking ID</dt>
                    <dd className="font-mono font-semibold text-[#E0B052]">
                      {activeOrder.trackingNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Destination</dt>
                    <dd className="font-medium text-[#F5F3EE] text-right">
                      {activeOrder.address.city}, {activeOrder.address.state}{' '}
                      {activeOrder.address.postalCode}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Payment</dt>
                    <dd className="font-medium text-[#F5F3EE] text-right">
                      {activeOrder.paymentSummary}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-[#111114] border border-[#26262C] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#F5F3EE]">
                  <Package className="w-4 h-4 text-[#E0B052]" aria-hidden="true" />
                  <span>Package Contents</span>
                </div>
                <ul className="divide-y divide-[#222228]">
                  {activeOrder.items.map((item) => (
                    <li key={item.key} className="py-3 first:pt-0 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#26262C] bg-[#141418] shrink-0">
                        <ProductVisual
                          finishId={item.finishId}
                          sizeId={item.sizeId}
                          angle="front"
                          customPhotoUrl={customPhotos[item.finishId]}
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#F5F3EE] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#A1A1AA]">
                          {item.finishName} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums text-xs font-semibold text-[#F5F3EE]">
                        {formatPrice(item.unitPriceInr * item.quantity, activeOrder.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-[#222228] flex justify-between text-sm font-bold text-[#F5F3EE]">
                  <span>Order Total</span>
                  <span className="font-mono tabular-nums text-[#E0B052]">
                    {formatPrice(activeOrder.totalInr, activeOrder.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
