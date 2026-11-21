import {
  ColourId,
  CurrencyCode,
  CustomerReview,
  GalleryAngleId,
  Order,
  Product,
  ProductFinish,
  PromoCode,
  ShippingMethod,
} from '../types/store';

export const FINISHES: Record<ColourId, ProductFinish> = {
  black: {
    id: 'black',
    name: 'Black',
    hex: '#17181B',
    accentHex: '#E0B052',
    surfaceHex: '#27292E',
    hasStudioPhotos: true,
    gallery: [
      {
        id: 'heroAction',
        label: 'Heat. Eat. Enjoy.',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.48_PM__1__61e83d9a.jpeg',
      },
      {
        id: 'front',
        label: 'Front View',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.50_PM_4c0aa4e1.jpeg',
      },
      {
        id: 'kitDesk',
        label: 'Complete Set',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.48_PM_f62cdf4b.jpeg',
      },
      {
        id: 'lifestyle',
        label: 'Carry Look',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.49_PM__2__3f937be5.jpeg',
      },
      {
        id: 'interior',
        label: 'Spacious Interior',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.49_PM_91f3b7a0.jpeg',
      },
      {
        id: 'back',
        label: 'Back Pocket',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.49_PM__1__6b988bc4.jpeg',
      },
    ],
  },
  tan: {
    id: 'tan',
    name: 'Tan',
    hex: '#A54D22',
    accentHex: '#E0B052',
    surfaceHex: '#BF6030',
    hasStudioPhotos: true,
    gallery: [
      {
        id: 'heroAction',
        label: 'Heat. Eat. Enjoy.',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.05_PM__1__33ca26ce.jpeg',
      },
      {
        id: 'front',
        label: 'Front View',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.06_PM__1__e2fb0f81.jpeg',
      },
      {
        id: 'kitDesk',
        label: 'Complete Set',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.05_PM_50f9bc62.jpeg',
      },
      {
        id: 'lifestyle',
        label: 'Carry Look',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.07_PM_a13e52e7.jpeg',
      },
      {
        id: 'interior',
        label: 'Spacious Interior',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.06_PM_6bd2a469.jpeg',
      },
      {
        id: 'back',
        label: 'Back Pocket',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.38.06_PM__2__8568c44c.jpeg',
      },
    ],
  },
  grey: {
    id: 'grey',
    name: 'Grey',
    hex: '#767B82',
    accentHex: '#E0B052',
    surfaceHex: '#8E949C',
    hasStudioPhotos: true,
    gallery: [
      {
        id: 'heroAction',
        label: 'Heat. Eat. Enjoy.',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.44.56_PM_f8325fc4.jpeg',
      },
      {
        id: 'front',
        label: 'Front View',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.44.54_PM_eb62cca4.jpeg',
      },
      {
        id: 'kitDesk',
        label: 'Complete Set',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.44.56_PM__1__87a89d9f.jpeg',
      },
      {
        id: 'lifestyle',
        label: 'Carry Look',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.44.55_PM__1__b18cf021.jpeg',
      },
      {
        id: 'interior',
        label: 'Spacious Interior',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.44.55_PM_e8010973.jpeg',
      },
      {
        id: 'back',
        label: 'Back Pocket',
        src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_6.44.55_PM__2__94ebcc08.jpeg',
      },
    ],
  },
  'light-blue': {
    id: 'light-blue',
    name: 'Light Blue',
    hex: '#93BEDB',
    accentHex: '#E0B052',
    surfaceHex: '#B2D3E9',
    hasStudioPhotos: false,
  },
  'light-pink': {
    id: 'light-pink',
    name: 'Light Pink',
    hex: '#E6B9C5',
    accentHex: '#E0B052',
    surfaceHex: '#F2CED8',
    hasStudioPhotos: false,
  },
};

export const ALL_FINISHES: ProductFinish[] = [
  FINISHES.black,
  FINISHES.tan,
  FINISHES.grey,
  FINISHES['light-blue'],
  FINISHES['light-pink'],
];

export function getFinishPhoto(
  finishId: ColourId,
  angle: GalleryAngleId = 'front'
): string | undefined {
  const finish = FINISHES[finishId];
  if (!finish?.gallery) return undefined;
  return finish.gallery.find((g) => g.id === angle)?.src ?? finish.gallery[0]?.src;
}

export const PRODUCTS: Product[] = [
  {
    id: 'carryo-large',
    sizeId: 'large',
    slug: 'carryo-large-electric-lunchbox',
    name: 'Carryo Large Electric Lunchbox',
    shortName: 'Carryo Large',
    tagline: 'Full-meal 3-container electric heating lunchbox in premium textured leatherette.',
    categoryLabel: 'Large Box · 3 Containers',
    priceInr: 2499,
    compareAtInr: 2999,
    containerCount: 3,
    containerSummary: '3 × 304 Stainless Steel Containers',
    capacityLabel: '1,350 ml (3 × 450 ml)',
    heatingTimeLabel: '25–30 min to piping hot',
    powerModeLabel: '220–240V AC Plug-In with Inline Switch',
    dimensionsLabel: '260 × 175 × 125 mm',
    idealFor: 'Full Indian & multi-course meals (dal, sabzi, rice & rotis)',
    availabilityText: 'In Stock',
    rating: 4.9,
    reviewCount: 386,
    shortDescription:
      'Spacious leatherette electric heating bag engineered for 3 stainless steel containers, with front zip pocket, back slip pocket, and detachable inline-switch cord.',
    longDescription:
      'Carryo Large by Warmland replaces bulky plastic tiffins with a tailored, structured leatherette electric lunch bag that looks right at home beside your laptop. Pack three full portions in the food-grade stainless steel containers, tuck the inline-switch heating cord into the front zipper pocket, and plug into any office socket 25 minutes before lunch for freshly steamed, home-cooked warmth.',
    highlights: [
      'Fits 3 round food-grade stainless steel containers (1,350 ml total capacity)',
      'Detachable plug-in heating cord with built-in inline power switch & LED indicator',
      'Premium textured leatherette exterior with metallic Carryo by Warmland emblem',
      'Front zippered cable & cutlery pocket plus convenient rear slip pocket',
      'Wipe-clean waterproof thermal lining keeps heat locked in and spills contained',
    ],
    finishes: ALL_FINISHES,
    specs: [
      { label: 'Box Size', value: 'Large (3-Container Capacity)' },
      { label: 'Included Containers', value: '3 × 450 ml Food-Grade Stainless Steel' },
      { label: 'Total Capacity', value: '1,350 ml' },
      { label: 'Exterior Material', value: 'Premium Textured Waterproof Leatherette' },
      { label: 'Interior Lining', value: 'Sealed Wipe-Clean Thermal Insulation' },
      { label: 'Heating Mechanism', value: 'Built-in Constant-Temp Electric Base' },
      { label: 'Power Control', value: 'Detachable AC Cord with Inline Switch & LED' },
      { label: 'Heating Time', value: '25–30 minutes (Auto-regulated warmth)' },
      { label: 'Storage Pockets', value: '1 Front Zip Pocket + 1 Back Slip Pocket' },
      { label: 'Dimensions', value: '260 × 175 × 125 mm' },
      { label: 'Available Colours', value: 'Black, Tan, Grey, Light Blue, Light Pink' },
    ],
    inTheBox: [
      'Carryo Large Electric Heating Bag (Selected Colour)',
      '3 × Food-Grade Stainless Steel Containers with Lids',
      'Detachable Inline-Switch Power Cord (Indian 2-Pin / AC)',
      'Care Guide & 1-Year Carryo Replacement Warranty Card',
    ],
  },
  {
    id: 'carryo-small',
    sizeId: 'small',
    slug: 'carryo-small-electric-lunchbox',
    name: 'Carryo Small Electric Lunchbox',
    shortName: 'Carryo Small',
    tagline: 'Compact 2-container electric heating lunchbox built for light daily commutes.',
    categoryLabel: 'Small Box · 2 Containers',
    priceInr: 1899,
    compareAtInr: 2299,
    containerCount: 2,
    containerSummary: '2 × 304 Stainless Steel Containers',
    capacityLabel: '900 ml (2 × 450 ml)',
    heatingTimeLabel: '20–25 min to piping hot',
    powerModeLabel: '220–240V AC Plug-In with Inline Switch',
    dimensionsLabel: '215 × 155 × 115 mm',
    idealFor: 'Light lunches, rice bowls, pasta, or quick desk meals',
    availabilityText: 'In Stock',
    rating: 4.8,
    reviewCount: 241,
    shortDescription:
      'Every signature detail of Carryo—textured leatherette finish, gold emblem, front zip & back pockets, and plug-in heating—in a sleeker 2-container silhouette.',
    longDescription:
      'Designed for commuters and students who pack lighter lunches without compromising on freshly heated homemade food. Carryo Small holds two generous stainless steel containers inside a slimmer, featherweight leatherette thermal bag with the same detachable inline-switch heating cord, front cable zip pocket, and back slip pocket.',
    highlights: [
      'Compact everyday footprint built for 2 stainless steel containers (900 ml total)',
      'Faster 20–25 minute plug-in heating with inline switch & LED power indicator',
      'Same durable textured leatherette body and gold Carryo emblem in all 5 colours',
      'Front zippered pocket stores your heating cord & cutlery neatly on the move',
      'Reinforced twin top handles & wipe-clean insulated interior chamber',
    ],
    finishes: ALL_FINISHES,
    specs: [
      { label: 'Box Size', value: 'Small / Compact (2-Container Capacity)' },
      { label: 'Included Containers', value: '2 × 450 ml Food-Grade Stainless Steel' },
      { label: 'Total Capacity', value: '900 ml' },
      { label: 'Exterior Material', value: 'Premium Textured Waterproof Leatherette' },
      { label: 'Interior Lining', value: 'Sealed Wipe-Clean Thermal Insulation' },
      { label: 'Heating Mechanism', value: 'Built-in Constant-Temp Electric Base' },
      { label: 'Power Control', value: 'Detachable AC Cord with Inline Switch & LED' },
      { label: 'Heating Time', value: '20–25 minutes (Auto-regulated warmth)' },
      { label: 'Storage Pockets', value: '1 Front Zip Pocket + 1 Back Slip Pocket' },
      { label: 'Dimensions', value: '215 × 155 × 115 mm' },
      { label: 'Available Colours', value: 'Black, Tan, Grey, Light Blue, Light Pink' },
    ],
    inTheBox: [
      'Carryo Small Electric Heating Bag (Selected Colour)',
      '2 × Food-Grade Stainless Steel Containers with Lids',
      'Detachable Inline-Switch Power Cord (Indian 2-Pin / AC)',
      'Care Guide & 1-Year Carryo Replacement Warranty Card',
    ],
  },
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'CARRYO10',
    type: 'percent',
    value: 10,
    minSubtotalInr: 1500,
    description: '10% off your Carryo order',
  },
  {
    code: 'WARMLUNCH',
    type: 'fixed',
    value: 300,
    minSubtotalInr: 1800,
    description: 'Instant launch discount on Carryo electric lunchboxes',
  },
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Tracked Delivery',
    eta: '3–5 business days',
    description: 'Tracked pan-India & global courier delivery. Free on orders above ₹1,500 ($19).',
    costInr: 99,
    freeOverInr: 1500,
  },
  {
    id: 'express',
    name: 'Express Air Dispatch',
    eta: '1–2 business days',
    description: 'Priority warehouse handling with next-day metro air dispatch.',
    costInr: 199,
  },
  {
    id: 'office-slot',
    name: 'Scheduled Morning Slot (9 AM – 12 PM)',
    eta: '2–3 business days',
    description: 'Guaranteed morning delivery window directly to your home or office desk.',
    costInr: 149,
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Rohan Deshmukh',
    role: 'Senior Product Manager',
    organization: 'Razorpay, Bengaluru',
    productName: 'Carryo Large (3 Containers)',
    colourName: 'Tan',
    rating: 5,
    date: 'October 2026',
    headline: 'Looks like a leather brief, heats like a kitchen stove',
    body: 'Most colleagues didn’t even realize it was an electric tiffin until I plugged the white cord into my desk socket. Twenty-five minutes later my dal, sabzi, and rice are genuinely steaming hot—and the cord tucks right back into the front zip pocket.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Dr. Meera Krishnan',
    role: 'Emergency Medicine Resident',
    organization: 'Apollo Hospitals, Chennai',
    productName: 'Carryo Large (3 Containers)',
    colourName: 'Black',
    rating: 5,
    date: 'October 2026',
    headline: 'Zero spills in transit and easy wipe-clean inside',
    body: 'I carry the Black Carryo Large on 12-hour hospital duties. The textured leatherette looks sharp, the back pocket holds my napkins and cutlery, and the stainless steel containers keep rasam and rice hot without needing a microwave.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Ananya Verma',
    role: 'Principal Architect',
    organization: 'Studio Kora, Mumbai',
    productName: 'Carryo Small (2 Containers)',
    colourName: 'Grey',
    rating: 5,
    date: 'November 2026',
    headline: 'Compact outside, surprisingly spacious inside',
    body: 'I picked the Small box in Grey for lighter office days. It easily holds two full steel bowls, heats evenly with the simple inline switch, and feels worlds apart from clunky plastic electric lunchboxes.',
    verified: true,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What is the difference between Carryo Large and Carryo Small?',
    answer:
      'Carryo Large is our full-meal electric lunchbox that includes 3 stainless steel containers (1,350 ml total capacity)—ideal for dal, sabzi, rice, and rotis. Carryo Small is a sleeker, lighter 2-container version (900 ml total) designed for lighter lunches and compact commutes. Both come in all 5 colours with the same plug-in inline-switch heating.',
  },
  {
    question: 'How does Carryo heat my food?',
    answer:
      'Simply keep your packed stainless steel containers inside the zipped Carryo bag, connect the detachable power cord to the side port, plug it into a standard wall socket, and flip the inline switch on. The LED light turns on and your meal heats gently to piping-hot perfection in 20–30 minutes—no water required.',
  },
  {
    question: 'Which colours are available?',
    answer:
      'Both Carryo Large and Carryo Small are available in 5 colours: Black, Tan, Grey, Light Blue, and Light Pink. All finishes feature our textured premium leatherette exterior, matching handles, front zip pocket, back pocket, and metallic gold Carryo emblem.',
  },
  {
    question: 'How do I clean the containers and the electric bag?',
    answer:
      'Remove the stainless steel containers and wash them normally by hand or in a dishwasher. For the heated bag interior, unplug the power cord completely and wipe the waterproof thermal lining with a soft damp cloth—never submerge the bag in water.',
  },
  {
    question: 'Where do I store the power cord when commuting?',
    answer:
      'The detachable power cord with its inline switch folds neatly into the dedicated front zippered pocket, while the back slip pocket holds napkins, cutlery, or your office ID.',
  },
];

export const DEMO_TRACKING_ORDER: Order = {
  id: 'CYO-2026-8412',
  transactionRef: 'PAY-9928410-CYO',
  createdAt: 'Nov 19, 2026 · 10:14 AM',
  estimatedDelivery: 'Nov 23, 2026',
  status: 'Dispatched',
  currency: 'INR',
  items: [
    {
      key: 'carryo-large__tan',
      productId: 'carryo-large',
      sizeId: 'large',
      name: 'Carryo Large Electric Lunchbox',
      finishId: 'tan',
      finishName: 'Tan',
      finishHex: '#A54D22',
      unitPriceInr: 2499,
      quantity: 1,
    },
    {
      key: 'carryo-small__black',
      productId: 'carryo-small',
      sizeId: 'small',
      name: 'Carryo Small Electric Lunchbox',
      finishId: 'black',
      finishName: 'Black',
      finishHex: '#17181B',
      unitPriceInr: 1899,
      quantity: 1,
    },
  ],
  address: {
    fullName: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98204 11290',
    street: '402 Indiranagar 100ft Road',
    apartment: 'Suite 4B, Horizon Residency',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    notes: 'Leave with reception desk if unavailable.',
  },
  shippingMethod: SHIPPING_METHODS[0],
  paymentMethod: 'upi',
  paymentSummary: 'UPI Verified (aarav@okhdfcbank)',
  promoCode: 'CARRYO10',
  subtotalInr: 4398,
  discountInr: 440,
  shippingInr: 0,
  codFeeInr: 0,
  taxInr: 712,
  totalInr: 3958,
  courierName: 'BlueDart Priority Air',
  trackingNumber: 'BD778291044IN',
  timeline: [
    {
      title: 'Order Confirmed',
      subtitle: 'Payment authorized and invoice generated',
      timestamp: 'Nov 19 · 10:14 AM',
      completed: true,
    },
    {
      title: 'Heating Base & Cord QA',
      subtitle: 'Unit passed thermal safety & inline-switch inspection',
      timestamp: 'Nov 19 · 04:30 PM',
      completed: true,
    },
    {
      title: 'Dispatched from Hub',
      subtitle: 'Handed to BlueDart Priority Air (Tracking #BD778291044IN)',
      timestamp: 'Nov 20 · 08:45 AM',
      completed: true,
      current: true,
    },
    {
      title: 'Out for Delivery',
      subtitle: 'Courier arriving at Bengaluru 560038',
      timestamp: 'Expected Nov 23',
      completed: false,
    },
    {
      title: 'Delivered',
      subtitle: 'Signed doorstep delivery',
      timestamp: 'Pending',
      completed: false,
    },
  ],
};

export const USD_RATE = 82;

export function formatPrice(amountInr: number, currency: CurrencyCode): string {
  if (currency === 'USD') {
    const usd = Math.round(amountInr / USD_RATE);
    return `$${usd.toLocaleString('en-US')}`;
  }
  return `₹${Math.round(amountInr).toLocaleString('en-IN')}`;
}
