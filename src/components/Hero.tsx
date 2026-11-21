import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ColourId, CurrencyCode, GalleryAngleId, Product } from '../types/store';
import { ALL_FINISHES, FINISHES, formatPrice } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface HeroProps {
  products: Product[];
  currency: CurrencyCode;
  customPhotos: Record<string, string>;
  onSelectProduct: (productId: string, initialFinishId?: ColourId) => void;
  onQuickAdd: (product: Product, finishId: ColourId) => void;
  onScrollToSection: (sectionId: string) => void;
}

const HERO_ANGLES: { id: GalleryAngleId; label: string }[] = [
  { id: 'heroAction', label: 'In Action' },
  { id: 'front', label: 'Front' },
  { id: 'kitDesk', label: 'Full Set' },
  { id: 'lifestyle', label: 'Carry Look' },
  { id: 'interior', label: 'Interior' },
];

export function Hero({
  products,
  currency,
  customPhotos,
  onSelectProduct,
  onQuickAdd,
  onScrollToSection,
}: HeroProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [selectedFinishId, setSelectedFinishId] = useState<ColourId>('black');
  const [activeAngle, setActiveAngle] = useState<GalleryAngleId>('heroAction');

  const activeProduct = products.find((p) => p.id === selectedProductId) ?? products[0];
  const activeFinish = FINISHES[selectedFinishId] ?? FINISHES.black;

  return (
    <section id="top" className="pt-8 pb-14 lg:pt-12 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric 2-column split with stretched height balance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Narrative & Quick Configurator Column */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:py-3">
            <div>
              <p className="text-xs font-medium text-[#E0B052] tracking-wide mb-4">
                Carryo by Warmland · Electric Heating Lunchbox · 5 Colours
              </p>

              <h1 className="text-[clamp(2.35rem,4vw,3.6rem)] font-bold leading-[1.07] tracking-[-0.02em] text-[#F5F3EE] text-balance">
                Heat. Eat. Enjoy. Hot home-cooked meals anywhere.
              </h1>

              <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-[#A1A1AA] max-w-lg">
                Premium textured leatherette electric lunchboxes with removable stainless steel
                containers and a detachable inline-switch power cord. Plug in at your desk and
                enjoy steaming homemade food in minutes.
              </p>

              {/* Size Selector (Large vs Small) */}
              <div className="mt-7 pt-6 border-t border-[#222228]">
                <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-2.5">
                  <span className="font-semibold text-[#F5F3EE]">Select Size</span>
                  <span className="font-mono tabular-nums text-[#E0B052] font-semibold text-sm">
                    {formatPrice(activeProduct.priceInr, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {products.map((prod) => {
                    const selected = prod.id === activeProduct.id;
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setSelectedProductId(prod.id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#E0B052] bg-[#16161B]'
                            : 'border-[#26262C] bg-[#0F0F12] hover:border-[#3A3A44]'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#F5F3EE]">{prod.shortName}</p>
                        <p className="text-xs text-[#A1A1AA] mt-0.5">
                          {prod.containerCount} Steel Containers · {prod.capacityLabel.split(' ')[0]} ml
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5-Colour Interactive Swatch Picker */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-3">
                  <span>
                    Colour:{' '}
                    <strong className="text-[#F5F3EE] font-semibold">{activeFinish.name}</strong>
                  </span>
                  {!activeFinish.hasStudioPhotos && !customPhotos[activeFinish.id] && (
                    <span className="text-[#A1A1AA]">Studio preview · Available to order</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {ALL_FINISHES.map((finish) => {
                    const selected = finish.id === selectedFinishId;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinishId(finish.id)}
                        aria-label={`Select ${finish.name}`}
                        aria-pressed={selected}
                        title={finish.name}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                          selected
                            ? 'ring-2 ring-[#E0B052] ring-offset-2 ring-offset-[#080809] scale-105'
                            : 'hover:scale-105 border border-[#383842]'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full block border border-white/15"
                          style={{ backgroundColor: finish.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary CTA + Secondary Link */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onQuickAdd(activeProduct, selectedFinishId)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    Add {activeProduct.shortName} ({activeFinish.name})
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProduct(activeProduct.id, selectedFinishId)}
                  className="inline-flex items-center justify-center px-3 py-3.5 text-sm font-semibold text-[#F5F3EE] hover:text-[#E0B052] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Full Gallery & Specs
                </button>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#222228] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Free delivery over {formatPrice(1500, currency)} · COD available</span>
              <button
                type="button"
                onClick={() => onScrollToSection('shop')}
                className="font-medium text-[#F5F3EE] hover:text-[#E0B052] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                Compare Large & Small
              </button>
            </div>
          </div>

          {/* Right Real Product Photography Stage */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative flex-1 min-h-[340px] sm:min-h-[450px] rounded-2xl overflow-hidden border border-[#26262C] bg-[#111114]">
              <ProductVisual
                finishId={selectedFinishId}
                sizeId={activeProduct.sizeId}
                angle={activeAngle}
                customPhotoUrl={customPhotos[selectedFinishId]}
                alt={`${activeProduct.name} in ${activeFinish.name}`}
              />
            </div>

            {/* Interactive Real Photo Angle Selector (shown when finish has real 6-photo gallery) */}
            {activeFinish.hasStudioPhotos && !customPhotos[selectedFinishId] && (
              <div className="grid grid-cols-5 gap-2.5">
                {HERO_ANGLES.map((item) => {
                  const selected = activeAngle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveAngle(item.id)}
                      className={`group rounded-xl overflow-hidden border transition-all text-left cursor-pointer ${
                        selected
                          ? 'border-[#E0B052] bg-[#16161B]'
                          : 'border-[#26262C] bg-[#111114] opacity-75 hover:opacity-100 hover:border-[#3A3A44]'
                      }`}
                    >
                      <div className="aspect-4/3 w-full overflow-hidden">
                        <ProductVisual
                          finishId={selectedFinishId}
                          sizeId={activeProduct.sizeId}
                          angle={item.id}
                          alt={`${activeFinish.name} — ${item.label}`}
                        />
                      </div>
                      <p className="px-2 py-1.5 text-[11px] font-medium text-[#F5F3EE] truncate text-center">
                        {item.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Full-Width 4-Column Feature Strip Below Hero Split */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-[#222228]">
          <div>
            <p className="font-mono tabular-nums text-xl sm:text-2xl font-semibold text-[#E0B052]">
              2 Sizes
            </p>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              Large (3 containers) & Small (2 containers)
            </p>
          </div>
          <div>
            <p className="font-mono tabular-nums text-xl sm:text-2xl font-semibold text-[#F5F3EE]">
              5 Colours
            </p>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              Black, Tan, Grey, Light Blue & Light Pink
            </p>
          </div>
          <div>
            <p className="font-mono tabular-nums text-xl sm:text-2xl font-semibold text-[#F5F3EE]">
              Plug & Switch
            </p>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              Detachable inline-switch cord with LED light
            </p>
          </div>
          <div>
            <p className="font-mono tabular-nums text-xl sm:text-2xl font-semibold text-[#F5F3EE]">
              Smart Pockets
            </p>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              Front zip cord pocket & rear quick-slip pocket
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
