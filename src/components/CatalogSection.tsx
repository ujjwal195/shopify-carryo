import { useState } from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { ColourId, CurrencyCode, Product } from '../types/store';
import { FINISHES, formatPrice } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface CatalogSectionProps {
  products: Product[];
  currency: CurrencyCode;
  customPhotos: Record<string, string>;
  onSelectProduct: (productId: string, initialFinishId?: ColourId) => void;
  onQuickAdd: (product: Product, finishId: ColourId) => void;
}

const LOOKBOOK_COLOURS: { id: ColourId; subtitle: string }[] = [
  { id: 'black', subtitle: 'Classic embossed obsidian leatherette with gold Carryo emblem' },
  { id: 'tan', subtitle: 'Warm saddle-tan textured finish paired with black zip trim' },
  { id: 'grey', subtitle: 'Modern architectural slate grey for everyday work commutes' },
];

export function CatalogSection({
  products,
  currency,
  customPhotos,
  onSelectProduct,
  onQuickAdd,
}: CatalogSectionProps) {
  const [selectedFinishes, setSelectedFinishes] = useState<Record<string, ColourId>>({
    'carryo-large': 'tan',
    'carryo-small': 'grey',
  });
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleQuickAddClick = (product: Product) => {
    const finishId = selectedFinishes[product.id] ?? product.finishes[0].id;
    onQuickAdd(product, finishId);
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1200);
  };

  return (
    <section id="shop" className="py-16 lg:py-24 border-t border-[#222228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium text-[#E0B052] mb-2">
              The Carryo Lineup · 2 Sizes · 5 Colours Each
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F3EE] text-balance">
              Choose your size. Pick your colour.
            </h2>
          </div>
          <p className="text-sm text-[#A1A1AA] max-w-md">
            Every Carryo electric lunchbox includes stainless steel containers, detachable
            inline-switch power cord, front zip pocket, and back slip pocket.
          </p>
        </div>

        {/* Balanced 2-Column Product Showcase (Large & Small) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product) => {
            const currentFinishId = selectedFinishes[product.id] ?? product.finishes[0].id;
            const currentFinish = FINISHES[currentFinishId] ?? product.finishes[0];
            const isAdded = recentlyAddedId === product.id;

            return (
              <article
                key={product.id}
                className="group flex flex-col bg-[#111114] border border-[#26262C] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3D372B]"
              >
                {/* 4:3 Real Product Photograph */}
                <button
                  type="button"
                  onClick={() => onSelectProduct(product.id, currentFinish.id)}
                  className="block relative aspect-4/3 w-full overflow-hidden bg-[#141418] text-left cursor-pointer"
                  aria-label={`View ${product.name} in ${currentFinish.name}`}
                >
                  <ProductVisual
                    finishId={currentFinish.id}
                    sizeId={product.sizeId}
                    angle={product.sizeId === 'large' ? 'kitDesk' : 'front'}
                    customPhotoUrl={customPhotos[currentFinish.id]}
                    alt={`${product.name} in ${currentFinish.name}`}
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </button>

                {/* Card Details */}
                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                    <span className="text-[#E0B052] font-medium">{product.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.capacityLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.availabilityText}</span>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product.id, currentFinish.id)}
                      className="text-left text-xl sm:text-2xl font-bold text-[#F5F3EE] hover:text-[#E0B052] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </button>
                    <div className="flex items-baseline gap-2 shrink-0">
                      {product.compareAtInr && (
                        <span className="font-mono tabular-nums text-xs text-[#71717A] line-through">
                          {formatPrice(product.compareAtInr, currency)}
                        </span>
                      )}
                      <span className="font-mono tabular-nums text-lg font-bold text-[#E0B052]">
                        {formatPrice(product.priceInr, currency)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#A1A1AA] flex-1">
                    {product.shortDescription}
                  </p>

                  {/* 5-Colour Selector Row */}
                  <div className="mt-6 pt-5 border-t border-[#222228]">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-[#A1A1AA]">
                        Selected Colour:{' '}
                        <strong className="text-[#F5F3EE] font-semibold">
                          {currentFinish.name}
                        </strong>
                      </span>
                      <span className="text-[#71717A]">5 colours available</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5" aria-label="Select colour">
                        {product.finishes.map((finish) => {
                          const selected = finish.id === currentFinish.id;
                          return (
                            <button
                              key={finish.id}
                              type="button"
                              onClick={() =>
                                setSelectedFinishes((prev) => ({
                                  ...prev,
                                  [product.id]: finish.id,
                                }))
                              }
                              aria-label={`${product.name} in ${finish.name}`}
                              aria-pressed={selected}
                              title={finish.name}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                                selected
                                  ? 'ring-2 ring-[#E0B052] ring-offset-2 ring-offset-[#111114] scale-105'
                                  : 'border border-[#383842] hover:scale-110'
                              }`}
                            >
                              <span
                                className="w-5 h-5 rounded-full block border border-white/15"
                                style={{ backgroundColor: finish.hex }}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product.id, currentFinish.id)}
                          className="px-4 py-2.5 text-xs font-semibold text-[#F5F3EE] bg-[#18181D] hover:bg-[#23232A] border border-[#2A2A32] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                        >
                          View Gallery
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddClick(product)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                            isAdded
                              ? 'bg-[#1D3B2B] text-[#34D399]'
                              : 'bg-[#E0B052] hover:bg-[#ECC46E] text-[#080809]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Signature Colour Lookbook (Real Lifestyle Commute Photography) */}
        <div className="mt-16 pt-14 border-t border-[#222228]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-medium text-[#E0B052] mb-1.5">
                Carried Every Day
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F3EE]">
                Designed to look like an everyday brief, not a lunchbox.
              </h3>
            </div>
            <p className="text-xs text-[#A1A1AA]">
              Also available in Light Blue & Light Pink
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOOKBOOK_COLOURS.map((item) => {
              const finish = FINISHES[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectProduct('carryo-large', item.id)}
                  className="group text-left bg-[#111114] border border-[#26262C] hover:border-[#3D372B] rounded-xl overflow-hidden transition-all cursor-pointer"
                >
                  <div className="aspect-4/3 overflow-hidden bg-[#141418]">
                    <ProductVisual
                      finishId={item.id}
                      angle="lifestyle"
                      alt={`Carryo ${finish.name} lifestyle commute look`}
                      className="transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#F5F3EE] group-hover:text-[#E0B052] transition-colors">
                        Carryo in {finish.name}
                      </p>
                      <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 text-[#E0B052] shrink-0 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
