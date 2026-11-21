import { useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Tag,
  Truck,
  Wallet,
} from 'lucide-react';
import {
  CartItem,
  CurrencyCode,
  Order,
  PaymentMethodType,
  PromoCode,
  ShippingAddress,
  ShippingMethod,
} from '../types/store';
import { formatPrice, PROMO_CODES, SHIPPING_METHODS } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

interface CheckoutViewProps {
  items: CartItem[];
  currency: CurrencyCode;
  customPhotos: Record<string, string>;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
  onBackToShop: () => void;
  onOrderComplete: (order: Order) => void;
}

type CheckoutStep = 1 | 2 | 3;

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function detectCardBrand(number: string): string {
  const clean = number.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'Amex';
  if (/^(60|65|81|82)/.test(clean)) return 'RuPay';
  return 'Card';
}

const INPUT_CLASS =
  'w-full px-3.5 py-2.5 text-sm bg-[#0B0B0D] border border-[#2A2A32] rounded-lg text-[#F5F3EE] placeholder:text-[#71717A] focus:border-[#E0B052] focus:outline-none';

export function CheckoutView({
  items,
  currency,
  customPhotos,
  appliedPromo,
  onApplyPromo,
  onBackToShop,
  onOrderComplete,
}: CheckoutViewProps) {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: currency === 'USD' ? 'United States' : 'India',
    notes: '',
  });
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});

  const [shippingMethodId, setShippingMethodId] = useState<string>(SHIPPING_METHODS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [upiVerified, setUpiVerified] = useState(false);

  const [expressProvider, setExpressProvider] = useState<'Apple Pay' | 'Google Pay'>('Google Pay');
  const [codConfirmed, setCodConfirmed] = useState(true);

  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const selectedShipping: ShippingMethod =
    SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? SHIPPING_METHODS[0];

  const subtotalInr = items.reduce((sum, item) => sum + item.unitPriceInr * item.quantity, 0);
  const discountInr = appliedPromo
    ? appliedPromo.type === 'percent'
      ? Math.round((subtotalInr * appliedPromo.value) / 100)
      : Math.min(appliedPromo.value, subtotalInr)
    : 0;
  const discountedSubtotalInr = Math.max(0, subtotalInr - discountInr);

  const shippingCostInr =
    selectedShipping.freeOverInr && subtotalInr >= selectedShipping.freeOverInr
      ? 0
      : selectedShipping.costInr;

  const codFeeInr = paymentMethod === 'cod' && discountedSubtotalInr < 3000 ? 79 : 0;
  const taxIncludedInr = Math.round(discountedSubtotalInr * 0.18);
  const finalTotalInr = discountedSubtotalInr + shippingCostInr + codFeeInr;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#F5F3EE]">Your checkout bag is empty</h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Add a Carryo electric lunchbox or accessory to begin checkout.
        </p>
        <button
          type="button"
          onClick={onBackToShop}
          className="mt-6 px-6 py-3 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors cursor-pointer"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!address.fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (address.phone.replace(/\D/g, '').length < 8) {
      errors.phone = 'Please enter a valid phone number for courier updates.';
    }
    if (!address.street.trim()) errors.street = 'Street address is required.';
    if (!address.city.trim()) errors.city = 'City is required.';
    if (!address.state.trim()) errors.state = 'State / Region is required.';
    if (address.postalCode.trim().length < 4) {
      errors.postalCode = 'Valid postal / PIN code is required.';
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      if (!cardName) setCardName(address.fullName);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) return;
    const found = PROMO_CODES.find((p) => p.code === cleaned);
    if (!found) {
      setPromoError('Invalid code. Try CARRYO10 or WARMLUNCH.');
      return;
    }
    if (subtotalInr < found.minSubtotalInr) {
      setPromoError(`Minimum order ${formatPrice(found.minSubtotalInr, currency)} required.`);
      return;
    }
    setPromoError('');
    onApplyPromo(found);
    setPromoInput('');
  };

  const handleVerifyUpi = () => {
    if (!upiId.includes('@') || upiId.trim().length < 5) {
      setPaymentError('Enter a valid UPI ID such as yourname@okaxis or yourname@ybl.');
      setUpiVerified(false);
      return;
    }
    setPaymentError('');
    setUpiVerified(true);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    let paymentSummary = '';

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\D/g, '');
      if (cleanCard.length < 15) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setPaymentError('Please enter card expiry in MM/YY format.');
        return;
      }
      if (cardCvv.replace(/\D/g, '').length < 3) {
        setPaymentError('Please enter a valid 3 or 4 digit security code.');
        return;
      }
      if (!cardName.trim()) {
        setPaymentError('Please enter the name on your card.');
        return;
      }
      const brand = detectCardBrand(cleanCard);
      paymentSummary = `${brand} ending in ${cleanCard.slice(-4)}`;
    } else if (paymentMethod === 'upi') {
      if (upiId.trim() && !upiId.includes('@')) {
        setPaymentError('Please enter a valid UPI ID (e.g. name@okhdfcbank) or leave blank for QR.');
        return;
      }
      paymentSummary = upiId.trim()
        ? `UPI Verified (${upiId.trim()})`
        : `${upiApp} Instant QR Verified`;
    } else if (paymentMethod === 'express') {
      paymentSummary = `${expressProvider} Express Authorized`;
    } else if (paymentMethod === 'cod') {
      if (!codConfirmed) {
        setPaymentError('Please confirm your phone number for Cash on Delivery verification.');
        return;
      }
      paymentSummary = `Cash on Delivery (${formatPrice(finalTotalInr, currency)} payable at door)`;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      const now = new Date();
      const randomNum = Math.floor(1000 + Math.random() * 8999);
      const orderId = `CYO-${now.getFullYear()}-${randomNum}`;
      const txRef = `PAY-${Math.floor(1000000 + Math.random() * 8999999)}-CYO`;
      const estDate = new Date(
        now.getTime() + (selectedShipping.id === 'express' ? 2 : 4) * 86400000
      );
      const formattedCreated = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      const formattedEst = estDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const order: Order = {
        id: orderId,
        transactionRef: txRef,
        createdAt: formattedCreated,
        estimatedDelivery: formattedEst,
        status: 'Confirmed',
        currency,
        items: [...items],
        address: { ...address },
        shippingMethod: selectedShipping,
        paymentMethod,
        paymentSummary,
        promoCode: appliedPromo?.code,
        subtotalInr,
        discountInr,
        shippingInr: shippingCostInr,
        codFeeInr,
        taxInr: taxIncludedInr,
        totalInr: finalTotalInr,
        courierName:
          selectedShipping.id === 'express' ? 'BlueDart Priority Air' : 'Delhivery Surface Express',
        trackingNumber: `CYO${Math.floor(100000000 + Math.random() * 899999999)}`,
        timeline: [
          {
            title: 'Order Confirmed',
            subtitle:
              paymentMethod === 'cod'
                ? 'COD order confirmed and queued for dispatch'
                : `Payment authorized (${txRef})`,
            timestamp: formattedCreated,
            completed: true,
            current: true,
          },
          {
            title: 'Heating Base & Cord QA',
            subtitle: 'Thermal safety check, inline switch test & steel container pack',
            timestamp: 'Scheduled within 12 hrs',
            completed: false,
          },
          {
            title: 'Dispatched from Hub',
            subtitle: `Pickup scheduled with ${
              selectedShipping.id === 'express' ? 'BlueDart Priority Air' : 'Delhivery Express'
            }`,
            timestamp: 'Pending',
            completed: false,
          },
          {
            title: 'Out for Delivery',
            subtitle: `Destination: ${address.city}, ${address.postalCode}`,
            timestamp: `Est. ${formattedEst}`,
            completed: false,
          },
          {
            title: 'Delivered',
            subtitle: 'Doorstep handover to recipient',
            timestamp: 'Pending',
            completed: false,
          },
        ],
      };

      setIsProcessing(false);
      onOrderComplete(order);
    }, 1100);
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#A1A1AA] hover:text-[#F5F3EE] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Store</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A1A1AA]">
            <Lock className="w-3.5 h-3.5 text-[#E0B052]" aria-hidden="true" />
            <span>256-bit TLS Encrypted Checkout</span>
          </div>
        </div>

        {/* Clean 3-Step Indicator */}
        <nav aria-label="Checkout progress" className="mb-10">
          <ol className="grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { num: 1 as CheckoutStep, title: 'Delivery Details' },
              { num: 2 as CheckoutStep, title: 'Shipping Method' },
              { num: 3 as CheckoutStep, title: 'Payment' },
            ].map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    disabled={!isCompleted}
                    onClick={() => {
                      if (isCompleted) setStep(s.num);
                    }}
                    className={`w-full text-left pb-3 border-b-2 transition-colors ${
                      isCurrent
                        ? 'border-[#E0B052] text-[#F5F3EE]'
                        : isCompleted
                        ? 'border-[#7E683B] text-[#F5F3EE] cursor-pointer'
                        : 'border-[#26262C] text-[#71717A] cursor-default'
                    }`}
                  >
                    <span className="font-mono tabular-nums text-xs font-semibold block text-[#E0B052]">
                      0{s.num}
                    </span>
                    <span className="text-sm font-semibold">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Checkout Form Steps */}
          <div className="lg:col-span-7">
            {/* STEP 1: CONTACT & DELIVERY ADDRESS */}
            {step === 1 && (
              <form
                onSubmit={handleContinueToShipping}
                className="bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8 space-y-6"
                noValidate
              >
                <div>
                  <h1 className="text-2xl font-bold text-[#F5F3EE]">Contact & Delivery Address</h1>
                  <p className="mt-1 text-sm text-[#A1A1AA]">
                    We’ll send your tracking link and digital warranty certificate here.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Rohan Deshmukh"
                      className={INPUT_CLASS}
                    />
                    {addressErrors.fullName && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      placeholder="you@company.com"
                      className={INPUT_CLASS}
                    />
                    {addressErrors.email && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder={currency === 'USD' ? '+1 (415) 555-0192' : '+91 98204 11290'}
                      className={INPUT_CLASS}
                    />
                    {addressErrors.phone && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="street" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Street Address
                    </label>
                    <input
                      id="street"
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="House / Building name, Street"
                      className={INPUT_CLASS}
                    />
                    {addressErrors.street && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.street}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="apartment" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Apartment, Suite, or Office Floor (Optional)
                    </label>
                    <input
                      id="apartment"
                      type="text"
                      value={address.apartment}
                      onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                      placeholder="Apt 4B, Wing C"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder={currency === 'USD' ? 'San Francisco' : 'Bengaluru'}
                      className={INPUT_CLASS}
                    />
                    {addressErrors.city && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      State / Province
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder={currency === 'USD' ? 'California' : 'Karnataka'}
                      className={INPUT_CLASS}
                    />
                    {addressErrors.state && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Postal / PIN Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder={currency === 'USD' ? '94107' : '560038'}
                      className={`${INPUT_CLASS} font-mono`}
                    />
                    {addressErrors.postalCode && (
                      <p className="mt-1 text-xs text-[#F87171]">{addressErrors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Country
                    </label>
                    <select
                      id="country"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className={INPUT_CLASS}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Singapore">Singapore</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-xs font-semibold text-[#F5F3EE] mb-1.5">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      id="notes"
                      type="text"
                      value={address.notes}
                      onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                      placeholder="Gate code or reception drop-off note"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3.5 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors cursor-pointer"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: SHIPPING METHOD */}
            {step === 2 && (
              <div className="bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#26262C] flex items-start justify-between gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-[#F5F3EE]">Delivering to {address.fullName}</p>
                    <p className="mt-1 text-[#A1A1AA]">
                      {address.street}
                      {address.apartment ? `, ${address.apartment}` : ''}, {address.city},{' '}
                      {address.state} {address.postalCode}
                    </p>
                    <p className="mt-0.5 text-[#A1A1AA]">
                      {address.email} · {address.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="font-semibold text-[#E0B052] hover:underline shrink-0 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#F5F3EE]">Select Shipping Method</h1>
                  <p className="mt-1 text-sm text-[#A1A1AA]">
                    All Carryo units undergo thermal calibration before dispatch.
                  </p>
                </div>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const selected = method.id === shippingMethodId;
                    const isFree =
                      Boolean(method.freeOverInr) && subtotalInr >= (method.freeOverInr ?? 0);
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setShippingMethodId(method.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#E0B052] bg-[#18181D]'
                            : 'border-[#26262C] bg-[#0B0B0D] hover:border-[#3A3A44]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                selected ? 'border-[#E0B052]' : 'border-[#52525B]'
                              }`}
                            >
                              {selected && <span className="w-2 h-2 rounded-full bg-[#E0B052]" />}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-[#F5F3EE]">
                                {method.name}{' '}
                                <span className="font-normal text-[#A1A1AA]">· {method.eta}</span>
                              </p>
                              <p className="mt-1 text-xs text-[#A1A1AA]">{method.description}</p>
                            </div>
                          </div>
                          <span className="font-mono tabular-nums text-sm font-semibold text-[#E0B052] shrink-0">
                            {isFree ? 'Free' : formatPrice(method.costInr, currency)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 text-sm font-semibold text-[#A1A1AA] hover:text-[#F5F3EE] cursor-pointer"
                  >
                    Back to Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <form
                onSubmit={handleCompletePayment}
                className="bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#26262C] divide-y divide-[#222228] text-xs">
                  <div className="pb-2.5 flex items-center justify-between gap-4">
                    <span className="text-[#A1A1AA]">
                      Ship to:{' '}
                      <strong className="text-[#F5F3EE] font-medium">
                        {address.street}, {address.city} {address.postalCode}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="font-semibold text-[#E0B052] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <div className="pt-2.5 flex items-center justify-between gap-4">
                    <span className="text-[#A1A1AA]">
                      Method:{' '}
                      <strong className="text-[#F5F3EE] font-medium">
                        {selectedShipping.name} ({selectedShipping.eta})
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="font-semibold text-[#E0B052] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#F5F3EE]">Payment Method</h1>
                  <p className="mt-1 text-sm text-[#A1A1AA]">
                    Choose your preferred payment method to complete your Carryo order.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: 'card', label: 'Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                      { id: 'express', label: 'Express Pay', icon: Wallet },
                      { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                    ] as const
                  ).map((pm) => {
                    const Icon = pm.icon;
                    const active = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(pm.id);
                          setPaymentError('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex flex-col gap-2 ${
                          active
                            ? 'border-[#E0B052] bg-[#E0B052] text-[#080809]'
                            : 'border-[#26262C] bg-[#0B0B0D] text-[#F5F3EE] hover:border-[#3A3A44]'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span className="text-xs font-semibold whitespace-nowrap">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CARD FORM */}
                {paymentMethod === 'card' && (
                  <div className="p-5 rounded-xl bg-[#0B0B0D] border border-[#26262C] space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                      <span className="font-semibold text-[#F5F3EE]">Credit or Debit Card</span>
                      <span className="font-mono font-semibold text-[#E0B052]">
                        {cardNumber ? detectCardBrand(cardNumber) : 'Visa · Mastercard · RuPay'}
                      </span>
                    </div>

                    <div>
                      <label htmlFor="cardNumber" className="block text-xs font-medium text-[#A1A1AA] mb-1">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4532 8810 4429 1024"
                        className={`${INPUT_CLASS} font-mono bg-[#141418]`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Expiry Date
                        </label>
                        <input
                          id="cardExpiry"
                          type="text"
                          inputMode="numeric"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="09/29"
                          className={`${INPUT_CLASS} font-mono bg-[#141418]`}
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvv" className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          CVV / CVC
                        </label>
                        <input
                          id="cardCvv"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          className={`${INPUT_CLASS} font-mono bg-[#141418]`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cardName" className="block text-xs font-medium text-[#A1A1AA] mb-1">
                        Name on Card
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Full name as printed on card"
                        className={`${INPUT_CLASS} bg-[#141418]`}
                      />
                    </div>
                  </div>
                )}

                {/* UPI / QR FORM */}
                {paymentMethod === 'upi' && (
                  <div className="p-5 rounded-xl bg-[#0B0B0D] border border-[#26262C] space-y-5">
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="p-3 bg-white rounded-xl shrink-0">
                        <svg
                          viewBox="0 0 100 100"
                          className="w-24 h-24 text-[#080809]"
                          fill="currentColor"
                          aria-label="Carryo UPI Payment QR Code"
                        >
                          <rect x="6" y="6" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                          <rect x="13" y="13" width="12" height="12" rx="1.5" />
                          <rect x="68" y="6" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                          <rect x="75" y="13" width="12" height="12" rx="1.5" />
                          <rect x="6" y="68" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                          <rect x="13" y="75" width="12" height="12" rx="1.5" />
                          <rect x="42" y="10" width="8" height="8" />
                          <rect x="54" y="18" width="8" height="14" />
                          <rect x="40" y="38" width="20" height="20" rx="3" fill="#C99535" />
                          <rect x="10" y="42" width="14" height="8" />
                          <rect x="28" y="46" width="8" height="14" />
                          <rect x="68" y="42" width="12" height="10" />
                          <rect x="84" y="48" width="10" height="14" />
                          <rect x="42" y="68" width="10" height="24" />
                          <rect x="58" y="68" width="14" height="10" />
                          <rect x="76" y="74" width="18" height="18" rx="2" />
                        </svg>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <p className="text-sm font-semibold text-[#F5F3EE]">
                          Instant UPI App or QR Payment
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(['GPay', 'PhonePe', 'Paytm', 'BHIM'] as const).map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setUpiApp(app)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                upiApp === app
                                  ? 'border-[#E0B052] bg-[#18181D] text-[#E0B052]'
                                  : 'border-[#26262C] bg-transparent text-[#A1A1AA]'
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            placeholder="yourname@okaxis (optional if scanning QR)"
                            className="flex-1 px-3 py-2 text-xs bg-[#141418] border border-[#2A2A32] rounded-lg text-[#F5F3EE] placeholder:text-[#71717A] focus:border-[#E0B052] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyUpi}
                            className="px-3 py-2 text-xs font-semibold bg-[#E0B052] text-[#080809] rounded-lg hover:bg-[#ECC46E] whitespace-nowrap cursor-pointer"
                          >
                            Verify ID
                          </button>
                        </div>

                        {upiVerified && (
                          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>UPI handle verified for {address.fullName || 'Account Holder'}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* EXPRESS WALLET */}
                {paymentMethod === 'express' && (
                  <div className="p-5 rounded-xl bg-[#0B0B0D] border border-[#26262C] space-y-4">
                    <p className="text-sm font-semibold text-[#F5F3EE]">
                      One-Tap Express Wallet Checkout
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {(['Google Pay', 'Apple Pay'] as const).map((provider) => (
                        <button
                          key={provider}
                          type="button"
                          onClick={() => setExpressProvider(provider)}
                          className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                            expressProvider === provider
                              ? 'border-[#E0B052] bg-[#18181D] text-[#E0B052]'
                              : 'border-[#26262C] text-[#A1A1AA] hover:text-[#F5F3EE]'
                          }`}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[#A1A1AA]">
                      Clicking “Pay” authorizes {formatPrice(finalTotalInr, currency)} directly with{' '}
                      {expressProvider} using your device biometrics.
                    </p>
                  </div>
                )}

                {/* CASH ON DELIVERY */}
                {paymentMethod === 'cod' && (
                  <div className="p-5 rounded-xl bg-[#0B0B0D] border border-[#26262C] space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#F5F3EE]">
                        Pay Cash or UPI at Your Doorstep
                      </p>
                      <span className="font-mono tabular-nums text-xs font-semibold text-[#E0B052]">
                        {codFeeInr === 0 ? 'No COD fee' : `+${formatPrice(codFeeInr, currency)} fee`}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#A1A1AA]">
                      Total payable on delivery:{' '}
                      <strong className="font-mono text-[#F5F3EE]">
                        {formatPrice(finalTotalInr, currency)}
                      </strong>
                      . COD handling fee is waived on orders above {formatPrice(3000, currency)}.
                    </p>
                    <label className="flex items-start gap-2.5 text-xs text-[#F5F3EE] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={codConfirmed}
                        onChange={(e) => setCodConfirmed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#E0B052] rounded cursor-pointer"
                      />
                      <span>
                        I confirm my phone number (
                        <span className="font-mono font-semibold text-[#E0B052]">
                          {address.phone}
                        </span>
                        ) is reachable for courier delivery confirmation.
                      </span>
                    </label>
                  </div>
                )}

                {paymentError && (
                  <p className="text-xs font-medium text-[#F87171]">{paymentError}</p>
                )}

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setStep(2)}
                    className="px-4 py-3 text-sm font-semibold text-[#A1A1AA] hover:text-[#F5F3EE] cursor-pointer disabled:opacity-50"
                  >
                    Back to Shipping
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-7 py-3.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] disabled:bg-[#52525B] disabled:text-[#A1A1AA] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {isProcessing
                        ? 'Authorizing Payment...'
                        : paymentMethod === 'cod'
                        ? `Place COD Order · ${formatPrice(finalTotalInr, currency)}`
                        : `Pay ${formatPrice(finalTotalInr, currency)}`}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Sticky Order Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-7 space-y-5">
            <h2 className="text-lg font-bold text-[#F5F3EE]">Order Summary</h2>

            <ul className="divide-y divide-[#222228] max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.key} className="py-3.5 first:pt-0 flex items-center gap-3.5">
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
                    <p className="text-sm font-semibold text-[#F5F3EE] truncate">{item.name}</p>
                    <p className="text-xs text-[#A1A1AA] truncate">
                      {item.finishName} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-semibold text-[#F5F3EE] shrink-0">
                    {formatPrice(item.unitPriceInr * item.quantity, currency)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#222228]">
              {appliedPromo ? (
                <div className="flex items-center justify-between px-3 py-2 bg-[#18181D] border border-[#2A2A32] rounded-lg text-xs">
                  <span className="inline-flex items-center gap-1.5 text-[#F5F3EE]">
                    <Tag className="w-3.5 h-3.5 text-[#E0B052]" aria-hidden="true" />
                    <strong className="font-mono text-[#E0B052]">{appliedPromo.code}</strong> applied
                  </span>
                  <button
                    type="button"
                    onClick={() => onApplyPromo(null)}
                    className="text-[#A1A1AA] hover:text-[#F5F3EE] font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        if (promoError) setPromoError('');
                      }}
                      placeholder="Promo code (CARRYO10)"
                      className="flex-1 px-3 py-2 text-xs bg-[#0B0B0D] border border-[#2A2A32] rounded-lg text-[#F5F3EE] placeholder:text-[#71717A] focus:border-[#E0B052] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 text-xs font-semibold text-[#F5F3EE] bg-[#1C1C22] hover:bg-[#26262E] border border-[#2E2E36] rounded-lg cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-[#F87171]">{promoError}</p>}
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-[#222228] space-y-2 text-sm">
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
                <span>Shipping ({selectedShipping.name.split(' ')[0]})</span>
                <span className="font-mono tabular-nums text-[#F5F3EE]">
                  {shippingCostInr === 0 ? 'Free' : formatPrice(shippingCostInr, currency)}
                </span>
              </div>
              {codFeeInr > 0 && (
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>COD Handling Fee</span>
                  <span className="font-mono tabular-nums text-[#F5F3EE]">
                    {formatPrice(codFeeInr, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#71717A]">
                <span>Included GST / Tax (18%)</span>
                <span className="font-mono tabular-nums">
                  {formatPrice(taxIncludedInr, currency)}
                </span>
              </div>
              <div className="pt-3 border-t border-[#222228] flex justify-between text-lg font-bold text-[#F5F3EE]">
                <span>Total Due</span>
                <span className="font-mono tabular-nums text-[#E0B052]">
                  {formatPrice(finalTotalInr, currency)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#222228] space-y-2 text-xs text-[#A1A1AA]">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E0B052] shrink-0" aria-hidden="true" />
                <span>2-Year Carryo Care Replacement Warranty</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E0B052] shrink-0" aria-hidden="true" />
                <span>30-day risk-free home trial & easy returns</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
