import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  Upload,
} from 'lucide-react';
import { ColourId, CurrencyCode, GalleryAngleId, Product } from '../types/store';
import { ALL_FINISHES, CUSTOMER_REVIEWS, FINISHES, formatPrice, PRODUCTS } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface ProductDetailViewProps {
  product: Product;
  initialFinishId?: ColourId;
  currency: CurrencyCode;
  customPhotos: Record<string, string>;
  onBack: () => void;
  onSelectProduct: (productId: string, initialFinishId?: ColourId) => void;
  onAddToCart: (payload: {
    product: Product;
    finishId: ColourId;
    quantity: number;
    goToCheckout?: boolean;
  }) => void;
  onUploadColourPhoto: (finishId: ColourId, file: File) => void;
  onClearColourPhoto: (finishId: ColourId) => void;
}

export function ProductDetailView({
  product,
  initialFinishId,
  currency,
  customPhotos,
  onBack,
  onSelectProduct,
  onAddToCart,
  onUploadColourPhoto,
  onClearColourPhoto,
}: ProductDetailViewProps) {
  const [selectedFinishId, setSelectedFinishId] = useState<ColourId>(initialFinishId ?? 'black');
  const [quantity, setQuantity] = useState(1);
  const [activeAngle, setActiveAngle] = useState<GalleryAngleId>('heroAction');
  const [justAdded, setJustAdded] = useState(false);

  const activeFinish = FINISHES[selectedFinishId] ?? FINISHES.black;
  const customPhotoUrl = customPhotos[selectedFinishId];
  const lineTotalInr = product.priceInr * quantity;
  const otherSizeProduct = PRODUCTS.find((p) => p.id !== product.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadColourPhoto(selectedFinishId, file);
    }
  };

  const handleAdd = (goToCheckout = false) => {
    onAddToCart({
      product,
      finishId: selectedFinishId,
      quantity,
      goToCheckout,
    });
    if (!goToCheckout) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1400);
    }
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#A1A1AA] hover:text-[#F5F3EE] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Gallery + Technical Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-[#26262C] bg-[#111114]">
              <ProductVisual
                finishId={selectedFinishId}
                sizeId={product.sizeId}
                angle={activeAngle}
                customPhotoUrl={customPhotoUrl}
                alt={`${product.name} in ${activeFinish.name}`}
              />

              {/* Photo uploader especially handy for Light Blue / Light Pink */}
              {(!activeFinish.hasStudioPhotos || Boolean(customPhotoUrl)) && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {customPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => onClearColourPhoto(selectedFinishId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0C0C0F]/95 hover:bg-[#18181E] border border-[#2A2A32] rounded-lg text-[#F5F3EE] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  )}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0C0C0F]/95 hover:bg-[#18181E] border border-[#2A2A32] rounded-lg text-[#F5F3EE] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#E0B052]" aria-hidden="true" />
                    <span>
                      {customPhotoUrl
                        ? `Replace ${activeFinish.name} Photo`
                        : `Upload ${activeFinish.name} Photo`}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 6-Photo Real Thumbnail Strip for Black, Tan & Grey */}
            {activeFinish.gallery && !customPhotoUrl && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {activeFinish.gallery.map((img) => {
                  const selected = activeAngle === img.id;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveAngle(img.id)}
                      className={`group rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                        selected
                          ? 'border-[#E0B052] bg-[#16161B]'
                          : 'border-[#26262C] bg-[#111114] opacity-75 hover:opacity-100 hover:border-[#3A3A44]'
                      }`}
                    >
                      <div className="aspect-4/3 w-full overflow-hidden">
                        <img
                          src={img.src}
                          alt={`${activeFinish.name} — ${img.label}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="px-1.5 py-1.5 text-[11px] font-medium text-[#F5F3EE] truncate text-center border-t border-[#222228]">
                        {img.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Overview & Highlights */}
            <div className="pt-8 border-t border-[#222228]">
              <h2 className="text-xl font-bold text-[#F5F3EE]">
                Compact outside, spacious inside
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A1A1AA]">
                {product.longDescription}
              </p>

              <ul className="mt-6 space-y-2.5">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#F5F3EE]">
                    <Check className="w-4 h-4 text-[#E0B052] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications */}
            <div className="pt-8 border-t border-[#222228]">
              <h3 className="text-lg font-bold text-[#F5F3EE] mb-4">Product Specifications</h3>
              <dl className="divide-y divide-[#222228] border-y border-[#222228]">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm"
                  >
                    <dt className="sm:col-span-5 text-[#A1A1AA] font-medium">{spec.label}</dt>
                    <dd className="sm:col-span-7 text-[#F5F3EE] font-medium font-mono tabular-nums text-[13px]">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* What's in the Box */}
            <div className="pt-8 border-t border-[#222228]">
              <h3 className="text-lg font-bold text-[#F5F3EE] mb-4">What’s included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#A1A1AA]">
                {product.inTheBox.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E0B052] shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sticky Contiguous Purchase Module */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
              <span className="text-[#E0B052]">{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{product.capacityLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[#F5F3EE] font-medium">
                <Star className="w-3.5 h-3.5 fill-[#E0B052] text-[#E0B052]" aria-hidden="true" />
                <span className="font-mono tabular-nums">{product.rating.toFixed(1)}</span>
                <span className="text-[#A1A1AA]">({product.reviewCount})</span>
              </span>
            </div>

            <h1 className="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F3EE]">
              {product.name}
            </h1>
            <p className="mt-1.5 text-sm text-[#A1A1AA]">{product.tagline}</p>

            {/* Price */}
            <div className="mt-5 pb-6 border-b border-[#222228] flex items-baseline gap-3">
              <span className="font-mono tabular-nums text-3xl font-bold text-[#F5F3EE]">
                {formatPrice(product.priceInr, currency)}
              </span>
              {product.compareAtInr && (
                <span className="font-mono tabular-nums text-base text-[#71717A] line-through">
                  {formatPrice(product.compareAtInr, currency)}
                </span>
              )}
              <span className="text-xs font-medium text-[#A1A1AA]">
                Incl. all taxes · {product.availabilityText}
              </span>
            </div>

            {/* Size Switcher (Large vs Small) */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-[#F5F3EE] mb-2.5">Select Box Size</p>
              <div className="grid grid-cols-2 gap-2.5">
                {PRODUCTS.map((p) => {
                  const selected = p.id === product.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectProduct(p.id, selectedFinishId)}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#E0B052] bg-[#18181D]'
                          : 'border-[#26262C] bg-[#0D0D10] hover:border-[#3A3A44]'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-[#F5F3EE]">
                          {p.sizeId === 'large' ? 'Large Box' : 'Small Box'}
                        </span>
                        <span className="font-mono tabular-nums text-xs font-semibold text-[#E0B052]">
                          {formatPrice(p.priceInr, currency)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#A1A1AA]">
                        {p.containerCount} Steel Containers · {p.capacityLabel.split(' ')[0]} ml
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5-Colour Swatch Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-[#F5F3EE]">Select Colour (5 Shades)</span>
                <span className="text-[#E0B052] font-medium">{activeFinish.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {ALL_FINISHES.map((finish) => {
                  const selected = finish.id === selectedFinishId;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setSelectedFinishId(finish.id)}
                      aria-label={finish.name}
                      aria-pressed={selected}
                      title={finish.name}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                        selected
                          ? 'ring-2 ring-[#E0B052] ring-offset-2 ring-offset-[#111114] scale-105'
                          : 'border border-[#383842] hover:scale-105'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full block border border-white/15"
                        style={{ backgroundColor: finish.hex }}
                      />
                    </button>
                  );
                })}
              </div>
              {!activeFinish.hasStudioPhotos && !customPhotoUrl && (
                <p className="mt-2.5 text-xs text-[#A1A1AA]">
                  Showing colour studio preview for {activeFinish.name}. Full product photography
                  coming soon—in stock and ready to ship.
                </p>
              )}
            </div>

            {/* Quantity & Primary Purchase CTAs */}
            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-[#26262C] rounded-lg bg-[#0B0B0D]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#F5F3EE] hover:bg-[#1C1C22] rounded-l-lg cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono tabular-nums text-sm font-semibold text-[#F5F3EE]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#F5F3EE] hover:bg-[#1C1C22] rounded-r-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(false)}
                  className={`flex-1 h-11 px-5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    justAdded
                      ? 'bg-[#1D3B2B] text-[#34D399]'
                      : 'bg-[#E0B052] hover:bg-[#ECC46E] text-[#080809]'
                  }`}
                >
                  {justAdded
                    ? 'Added to Bag'
                    : `Add to Bag · ${formatPrice(lineTotalInr, currency)}`}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAdd(true)}
                className="w-full h-11 px-5 text-sm font-semibold text-[#F5F3EE] bg-[#1C1C22] hover:bg-[#27272F] border border-[#2F2F38] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Buy Now — Express Checkout
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-[#222228] space-y-2.5 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#E0B052] shrink-0" aria-hidden="true" />
                <span>
                  Free tracked shipping over {formatPrice(1500, currency)} · Dispatches within 24 hours
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#E0B052] shrink-0" aria-hidden="true" />
                <span>Includes {product.containerSummary}, power cord & 1-year warranty</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Other Size Recommendation */}
        {otherSizeProduct && (
          <div className="mt-16 pt-12 border-t border-[#222228] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium text-[#E0B052]">Need a different capacity?</p>
              <h2 className="mt-1 text-xl font-bold text-[#F5F3EE]">{otherSizeProduct.name}</h2>
              <p className="mt-1 text-sm text-[#A1A1AA] max-w-xl">
                {otherSizeProduct.tagline} Available in all 5 colours at{' '}
                <span className="font-mono text-[#F5F3EE] font-semibold">
                  {formatPrice(otherSizeProduct.priceInr, currency)}
                </span>
                .
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectProduct(otherSizeProduct.id, selectedFinishId)}
              className="px-5 py-3 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Switch to {otherSizeProduct.shortName}
            </button>
          </div>
        )}

        {/* Verified Reviews */}
        <div className="mt-14 pt-12 border-t border-[#222228]">
          <h2 className="text-xl font-bold text-[#F5F3EE] mb-6">Verified owner feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-[#111114] border border-[#26262C] rounded-xl p-5">
                <p className="text-sm font-semibold text-[#F5F3EE]">{rev.headline}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">{rev.body}</p>
                <p className="mt-4 text-xs font-medium text-[#F5F3EE]">
                  {rev.author} ·{' '}
                  <span className="text-[#A1A1AA] font-normal">
                    {rev.productName} ({rev.colourName})
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
