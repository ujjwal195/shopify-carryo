import { useEffect, useState } from 'react';
import {
  ActiveView,
  CartItem,
  ColourId,
  CurrencyCode,
  Order,
  Product,
  PromoCode,
} from './types/store';
import { FINISHES, PRODUCTS } from './data/catalog';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { StoryAndCompareSection } from './components/StoryAndCompareSection';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  cart: 'carryo_cart_v2',
  orders: 'carryo_orders_v2',
  currency: 'carryo_currency_v2',
  photos: 'carryo_custom_photos_v2',
};

function safeLoadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [view, setView] = useState<ActiveView>({ type: 'home' });
  const [currency, setCurrency] = useState<CurrencyCode>(() =>
    safeLoadJson<CurrencyCode>(STORAGE_KEYS.currency, 'INR')
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    safeLoadJson<CartItem[]>(STORAGE_KEYS.cart, [])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeLoadJson<Order[]>(STORAGE_KEYS.orders, [])
  );
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>(() =>
    safeLoadJson<Record<string, string>>(STORAGE_KEYS.photos, {})
  );
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // ignore quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // ignore quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.currency, JSON.stringify(currency));
    } catch {
      // ignore quota errors
    }
  }, [currency]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.photos, JSON.stringify(customPhotos));
    } catch {
      // ignore quota errors
    }
  }, [customPhotos]);

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (sectionId?: string) => {
    if (!sectionId || sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleNavigateHome = (sectionId?: string) => {
    setView({ type: 'home' });
    scrollToSection(sectionId);
  };

  const handleSelectProduct = (productId: string, initialFinishId?: ColourId) => {
    setView({ type: 'product', productId, initialFinishId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addItemToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === item.key);
      if (existing) {
        return prev.map((c) =>
          c.key === item.key ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      }
      return [...prev, item];
    });
  };

  const handleQuickAdd = (product: Product, finishId: ColourId, openDrawer = true) => {
    const finish = FINISHES[finishId] ?? FINISHES.black;
    const key = `${product.id}__${finish.id}`;
    addItemToCart({
      key,
      productId: product.id,
      sizeId: product.sizeId,
      name: product.name,
      finishId: finish.id,
      finishName: finish.name,
      finishHex: finish.hex,
      unitPriceInr: product.priceInr,
      quantity: 1,
    });
    if (openDrawer) {
      setCartDrawerOpen(true);
    }
  };

  const handleDetailAddToCart = ({
    product,
    finishId,
    quantity,
    goToCheckout,
  }: {
    product: Product;
    finishId: ColourId;
    quantity: number;
    goToCheckout?: boolean;
  }) => {
    const finish = FINISHES[finishId] ?? FINISHES.black;
    const key = `${product.id}__${finish.id}`;

    addItemToCart({
      key,
      productId: product.id,
      sizeId: product.sizeId,
      name: product.name,
      finishId: finish.id,
      finishName: finish.name,
      finishHex: finish.hex,
      unitPriceInr: product.priceInr,
      quantity,
    });

    if (goToCheckout) {
      setCartDrawerOpen(false);
      setView({ type: 'checkout' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCartDrawerOpen(true);
    }
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleOrderComplete = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setAppliedPromo(null);
    setView({ type: 'confirmation', orderId: order.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadColourPhoto = (finishId: ColourId, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotos((prev) => ({ ...prev, [finishId]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearColourPhoto = (finishId: ColourId) => {
    setCustomPhotos((prev) => {
      const next = { ...prev };
      delete next[finishId];
      return next;
    });
  };

  const activeProduct =
    view.type === 'product'
      ? PRODUCTS.find((p) => p.id === view.productId) ?? PRODUCTS[0]
      : null;

  const activeConfirmedOrder =
    view.type === 'confirmation'
      ? orders.find((o) => o.id === view.orderId) ?? orders[0]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#080809] text-[#F5F3EE]">
      <Header
        cartCount={totalBagCount}
        onNavigateHome={handleNavigateHome}
        onOpenTracking={() => {
          setView({ type: 'tracking' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      <main className="flex-1">
        {view.type === 'home' && (
          <>
            <Hero
              products={PRODUCTS}
              currency={currency}
              customPhotos={customPhotos}
              onSelectProduct={handleSelectProduct}
              onQuickAdd={(product, finishId) => handleQuickAdd(product, finishId, true)}
              onScrollToSection={scrollToSection}
            />
            <CatalogSection
              products={PRODUCTS}
              currency={currency}
              customPhotos={customPhotos}
              onSelectProduct={handleSelectProduct}
              onQuickAdd={(product, finishId) => handleQuickAdd(product, finishId, true)}
            />
            <StoryAndCompareSection
              products={PRODUCTS}
              currency={currency}
              onSelectProduct={handleSelectProduct}
            />
          </>
        )}

        {view.type === 'product' && activeProduct && (
          <ProductDetailView
            key={`${activeProduct.id}-${view.initialFinishId ?? 'default'}`}
            product={activeProduct}
            initialFinishId={view.initialFinishId}
            currency={currency}
            customPhotos={customPhotos}
            onBack={() => handleNavigateHome('shop')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleDetailAddToCart}
            onUploadColourPhoto={handleUploadColourPhoto}
            onClearColourPhoto={handleClearColourPhoto}
          />
        )}

        {view.type === 'checkout' && (
          <CheckoutView
            items={cart}
            currency={currency}
            customPhotos={customPhotos}
            appliedPromo={appliedPromo}
            onApplyPromo={setAppliedPromo}
            onBackToShop={() => handleNavigateHome('shop')}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {view.type === 'confirmation' && activeConfirmedOrder && (
          <OrderConfirmationView
            order={activeConfirmedOrder}
            customPhotos={customPhotos}
            onTrackOrder={(orderId) => {
              setView({ type: 'tracking', initialOrderId: orderId });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => handleNavigateHome('shop')}
          />
        )}

        {view.type === 'tracking' && (
          <OrderTrackingView
            orders={orders}
            initialOrderId={view.initialOrderId}
            customPhotos={customPhotos}
            onBackToShop={() => handleNavigateHome('shop')}
          />
        )}
      </main>

      <Footer
        currency={currency}
        onChangeCurrency={setCurrency}
        onNavigateHome={handleNavigateHome}
        onOpenTracking={() => {
          setView({ type: 'tracking' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectProduct={handleSelectProduct}
      />

      <CartDrawer
        open={cartDrawerOpen}
        items={cart}
        currency={currency}
        customPhotos={customPhotos}
        appliedPromo={appliedPromo}
        onClose={() => setCartDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onApplyPromo={setAppliedPromo}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setView({ type: 'checkout' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
