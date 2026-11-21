import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { ColourId, CurrencyCode, Product } from '../types/store';
import { CUSTOMER_REVIEWS, FAQ_ITEMS, formatPrice } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface StoryAndCompareSectionProps {
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (productId: string, initialFinishId?: ColourId) => void;
}

type DetailTabId = 'interior' | 'back' | 'kitDesk';

const DETAIL_TABS: {
  id: DetailTabId;
  label: string;
  title: string;
  caption: string;
}[] = [
  {
    id: 'interior',
    label: 'Spacious Interior',
    title: 'Compact outside, spacious thermal chamber inside.',
    caption:
      'Reinforced wipe-clean insulated lining traps radiant warmth evenly around every stainless steel container while guarding against transit spills.',
  },
  {
    id: 'back',
    label: 'Smart Pockets',
    title: 'Front cord zip pocket & convenient back slip pocket.',
    caption:
      'Keep your detachable inline-switch heating cord tucked neatly in the front zipper pocket, with quick-grab space in the rear slip pocket for napkins and cutlery.',
  },
  {
    id: 'kitDesk',
    label: 'Plug & Switch',
    title: 'Simple inline switch heating right at your desk.',
    caption:
      'Connect the detachable power cord to the side port, plug into a standard AC outlet, and switch it on—no water needed and zero microwave lines.',
  },
];

export function StoryAndCompareSection({
  products,
  currency,
  onSelectProduct,
}: StoryAndCompareSectionProps) {
  const [detailTab, setDetailTab] = useState<DetailTabId>('interior');
  const [showcaseColour, setShowcaseColour] = useState<ColourId>('tan');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const activeDetail = DETAIL_TABS.find((t) => t.id === detailTab) ?? DETAIL_TABS[0];

  return (
    <>
      {/* SECTION 1: HOW CARRYO WORKS & REAL CRAFTSMANSHIP DETAILS */}
      <section id="how-it-works" className="py-16 lg:py-24 border-t border-[#222228] bg-[#0D0D10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Editorial Steps */}
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-[#E0B052] mb-2">
                How Carryo Works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F3EE] text-balance">
                Three effortless steps to hot home-cooked food.
              </h2>

              <div className="mt-10 divide-y divide-[#222228]">
                <div className="py-6 first:pt-0">
                  <h3 className="text-lg font-semibold text-[#F5F3EE]">
                    01. Pack your stainless steel containers
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
                    Fill the 3 containers (Carryo Large) or 2 containers (Carryo Small)
                    with dal, sabzi, rice, or rotis. Place them inside the insulated bag
                    and zip shut—your cord stays stowed in the front zip pocket.
                  </p>
                </div>

                <div className="py-6">
                  <h3 className="text-lg font-semibold text-[#F5F3EE]">
                    02. Plug into any wall socket & flip the switch
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
                    20 to 30 minutes before lunch, plug the detachable power cord into the
                    side inlet and turn on the inline switch. The LED indicator lights up
                    as Carryo gently heats your meal with zero added water.
                  </p>
                </div>

                <div className="py-6 last:pb-0">
                  <h3 className="text-lg font-semibold text-[#F5F3EE]">
                    03. Unzip, eat hot, and wipe clean
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
                    Open to freshly heated home food right at your desk. Wash the stainless
                    steel bowls normally and simply wipe the waterproof interior lining
                    clean with a damp cloth.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Real Photography Craftsmanship Viewer */}
            <div className="lg:col-span-7 bg-[#131317] border border-[#26262C] rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#24242A]">
                <div className="inline-flex items-center gap-1 p-1 bg-[#0A0A0D] border border-[#24242A] rounded-lg">
                  {DETAIL_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDetailTab(tab.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        detailTab === tab.id
                          ? 'bg-[#E0B052] text-[#080809]'
                          : 'text-[#A1A1AA] hover:text-[#F5F3EE]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Switch between Black, Tan, Grey real studio detail photos */}
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <span>Preview:</span>
                  {(['black', 'tan', 'grey'] as ColourId[]).map((cid) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setShowcaseColour(cid)}
                      className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                        showcaseColour === cid
                          ? 'bg-[#24242B] text-[#E0B052] font-semibold'
                          : 'text-[#A1A1AA] hover:text-[#F5F3EE]'
                      }`}
                    >
                      {cid}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 aspect-4/3 w-full rounded-xl overflow-hidden border border-[#26262C] bg-[#0B0B0E]">
                <ProductVisual
                  finishId={showcaseColour}
                  angle={detailTab}
                  alt={`Carryo ${showcaseColour} — ${activeDetail.label}`}
                />
              </div>

              <div className="mt-5">
                <h3 className="text-base font-semibold text-[#F5F3EE]">{activeDetail.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#A1A1AA]">
                  {activeDetail.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LARGE VS SMALL COMPARISON TABLE */}
      <section id="compare" className="py-16 lg:py-24 border-t border-[#222228]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium text-[#E0B052] mb-2">
              Compare Sizes
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F3EE] text-balance">
              Large Box vs. Small Box — side by side.
            </h2>
          </div>

          <div className="overflow-x-auto bg-[#111114] border border-[#26262C] rounded-xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#26262C]">
                  <th className="py-5 px-6 text-xs font-semibold text-[#A1A1AA] w-1/3">
                    Specification
                  </th>
                  {products.map((model) => (
                    <th key={model.id} className="py-5 px-6 align-top w-1/3">
                      <p className="text-base font-bold text-[#F5F3EE]">{model.name}</p>
                      <p className="mt-1 font-mono tabular-nums text-sm font-semibold text-[#E0B052]">
                        {formatPrice(model.priceInr, currency)}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202026] text-sm">
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Stainless Containers</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 font-semibold text-[#F5F3EE]">
                      {m.containerSummary}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Total Meal Capacity</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 font-mono tabular-nums text-[#F5F3EE]">
                      {m.capacityLabel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Ideal For</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 text-[#F5F3EE]">
                      {m.idealFor}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Heating Time</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 font-mono tabular-nums text-[#F5F3EE]">
                      {m.heatingTimeLabel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Bag Dimensions</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 font-mono tabular-nums text-[#F5F3EE]">
                      {m.dimensionsLabel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Power Cord</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 text-[#F5F3EE]">
                      {m.powerModeLabel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Exterior & Pockets</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 text-[#F5F3EE]">
                      Textured leatherette · Front zip + Back slip pocket
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#A1A1AA]">Available Colours</td>
                  {products.map((m) => (
                    <td key={m.id} className="py-4 px-6 text-[#F5F3EE]">
                      Black, Tan, Grey, Light Blue, Light Pink
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6" />
                  {products.map((model) => (
                    <td key={model.id} className="py-5 px-6">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(model.id)}
                        className="px-4 py-2.5 text-xs font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Choose {model.shortName}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verified Customer Reviews */}
          <div className="mt-16 lg:mt-20">
            <div className="mb-8">
              <p className="text-xs font-medium text-[#E0B052] mb-1.5">
                Verified Owners · 4.9 / 5 Average across 627 reviews
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F3EE]">
                Loved across offices, hospitals, and studios.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CUSTOMER_REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="flex flex-col justify-between bg-[#111114] border border-[#26262C] rounded-xl p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#A1A1AA]">
                      <div
                        className="flex items-center gap-0.5 text-[#E0B052]"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <span>{review.date}</span>
                    </div>

                    <h4 className="mt-4 text-base font-semibold text-[#F5F3EE] leading-snug">
                      {review.headline}
                    </h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#A1A1AA]">
                      {review.body}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#222228] text-xs">
                    <p className="font-semibold text-[#F5F3EE]">{review.author}</p>
                    <p className="text-[#A1A1AA] mt-0.5">
                      {review.role}, {review.organization}
                    </p>
                    <p className="text-[#71717A] mt-1">
                      Verified purchase · {review.productName} · {review.colourName}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Concise Accordion FAQ */}
          <div className="mt-16 lg:mt-20 pt-14 border-t border-[#222228] grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <p className="text-xs font-medium text-[#E0B052] mb-2">Questions</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F3EE] text-balance">
                Everything you should know before ordering.
              </h3>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#222228] border-y border-[#222228]">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="text-base font-semibold text-[#F5F3EE] group-hover:text-[#E0B052] transition-colors">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#A1A1AA] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#E0B052]' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-5 text-sm leading-relaxed text-[#A1A1AA] max-w-2xl">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
