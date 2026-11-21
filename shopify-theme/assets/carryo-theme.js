/* ==========================================================================
   Carryo Obsidian — Shopify Online Store 2.0 Interactive Storefront JS
   ========================================================================== */

(function () {
  'use strict';

  var cfg = window.CarryoConfig || {};
  var assets = cfg.assets || {};

  function formatMoney(cents) {
    var symbol = cfg.currencySymbol || '₹';
    var amount = Math.round((Number(cents) || 0) / 100);
    return symbol + amount.toLocaleString();
  }

  function showToast(message) {
    var existing = document.querySelector('.carryo-toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'carryo-toast';
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(function () {
      el.remove();
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     Mobile Navigation
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    var toggle = document.querySelector('[data-mobile-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isHidden = nav.hasAttribute('hidden');
      if (isHidden) {
        nav.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        nav.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    nav.querySelectorAll('[data-mobile-nav-link]').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     Shopify Ajax Cart Drawer
     ------------------------------------------------------------------------ */
  var drawer = document.getElementById('CarryoCartDrawer');

  function openCartDrawer() {
    if (!drawer) return;
    drawer.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    refreshCart();
  }

  function closeCartDrawer() {
    if (!drawer) return;
    drawer.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function updateCartCountBadges(count) {
    document.querySelectorAll('[data-cart-count-paren]').forEach(function (el) {
      el.textContent = '(' + count + ')';
    });
  }

  function renderCartDrawer(cart) {
    updateCartCountBadges(cart.item_count);
    if (!drawer) return;

    var itemsBox = drawer.querySelector('[data-cart-items-container]');
    var footer = drawer.querySelector('[data-cart-footer]');
    var shipBar = drawer.querySelector('[data-cart-shipping-bar]');
    var shipText = drawer.querySelector('[data-cart-shipping-text]');
    var shipFill = drawer.querySelector('[data-cart-shipping-fill]');
    var subtotalEl = drawer.querySelector('[data-cart-subtotal]');

    var threshold = Number(cfg.freeShippingThreshold) || 150000;
    var remaining = Math.max(0, threshold - cart.total_price);
    var pct = Math.min(100, Math.round((cart.total_price / threshold) * 100));

    if (cart.item_count === 0) {
      if (shipBar) shipBar.setAttribute('hidden', '');
      if (footer) footer.setAttribute('hidden', '');
      if (itemsBox) {
        itemsBox.innerHTML =
          '<div class="cart-drawer__empty">' +
            '<div class="cart-drawer__empty-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
            '</div>' +
            '<p class="cart-drawer__empty-title">Your bag is empty</p>' +
            '<p class="cart-drawer__empty-sub">Explore Carryo electric lunchboxes for hot home-cooked meals anywhere.</p>' +
            '<button type="button" class="btn btn-gold" data-cart-close>Explore Products</button>' +
          '</div>';
      }
      return;
    }

    if (shipBar) shipBar.removeAttribute('hidden');
    if (footer) footer.removeAttribute('hidden');
    if (shipText) {
      shipText.textContent =
        remaining === 0
          ? 'You unlocked Free Tracked Shipping on this order.'
          : 'Add ' + formatMoney(remaining) + ' more for Free Tracked Shipping.';
    }
    if (shipFill) shipFill.style.width = pct + '%';
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

    if (itemsBox) {
      var listHtml = '<ul class="cart-drawer__list">';
      cart.items.forEach(function (item) {
        var imgSrc = item.image || (assets.black && assets.black.front) || '';
        var variantLine =
          item.variant_title && item.variant_title !== 'Default Title'
            ? '<p class="cart-item__variant">' + escapeHtml(item.variant_title) + '</p>'
            : '';
        listHtml +=
          '<li class="cart-item" data-cart-key="' + escapeHtml(item.key) + '">' +
            '<div class="cart-item__media"><img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(item.product_title) + '" width="80" height="80"></div>' +
            '<div class="cart-item__info">' +
              '<div class="cart-item__top">' +
                '<a href="' + escapeHtml(item.url) + '" class="cart-item__title">' + escapeHtml(item.product_title) + '</a>' +
                '<button type="button" class="cart-item__remove" data-cart-remove="' + escapeHtml(item.key) + '" aria-label="Remove item">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
                '</button>' +
              '</div>' +
              variantLine +
              '<div class="cart-item__bottom">' +
                '<div class="qty-control qty-control--sm">' +
                  '<button type="button" data-cart-qty="' + escapeHtml(item.key) + '" data-delta="-1" aria-label="Decrease">&minus;</button>' +
                  '<span class="mono">' + item.quantity + '</span>' +
                  '<button type="button" data-cart-qty="' + escapeHtml(item.key) + '" data-delta="1" aria-label="Increase">+</button>' +
                '</div>' +
                '<span class="cart-item__price mono">' + formatMoney(item.final_line_price) + '</span>' +
              '</div>' +
            '</div>' +
          '</li>';
      });
      listHtml += '</ul>';
      itemsBox.innerHTML = listHtml;
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function refreshCart() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(renderCartDrawer)
      .catch(function () {});
  }

  function addToCart(variantId, quantity, onDone) {
    if (!variantId) {
      showToast('Link your Shopify products in Theme Editor or import carryo-products-shopify.csv to enable live checkout.');
      return;
    }
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: Number(variantId), quantity: Number(quantity) || 1 }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('Unable to add item');
        return r.json();
      })
      .then(function () {
        if (onDone) onDone();
        if (cfg.enableCartDrawer && drawer) {
          openCartDrawer();
        } else {
          window.location.href = (cfg.routes && cfg.routes.cartUrl) || '/cart';
        }
      })
      .catch(function () {
        showToast('Could not add this variant to bag. Please check product availability.');
      });
  }

  function changeCartItem(key, newQty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: Math.max(0, newQty) }),
    })
      .then(function (r) { return r.json(); })
      .then(renderCartDrawer)
      .catch(function () {});
  }

  function initCartDrawerEvents() {
    document.addEventListener('click', function (e) {
      var openBtn = e.target.closest('[data-cart-open]');
      if (openBtn) {
        e.preventDefault();
        openCartDrawer();
        return;
      }

      if (e.target.closest('[data-cart-close]')) {
        e.preventDefault();
        closeCartDrawer();
        return;
      }

      var removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        e.preventDefault();
        changeCartItem(removeBtn.getAttribute('data-cart-remove'), 0);
        return;
      }

      var qtyBtn = e.target.closest('[data-cart-qty]');
      if (qtyBtn) {
        e.preventDefault();
        var key = qtyBtn.getAttribute('data-cart-qty');
        var delta = Number(qtyBtn.getAttribute('data-delta')) || 0;
        var row = qtyBtn.closest('[data-cart-key]');
        var cur = Number(row && row.querySelector('.qty-control span').textContent) || 1;
        changeCartItem(key, cur + delta);
        return;
      }

      var quickBtn = e.target.closest('[data-quick-add]');
      if (quickBtn) {
        e.preventDefault();
        addToCart(quickBtn.getAttribute('data-variant-id'), 1);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && !drawer.hasAttribute('hidden')) {
        closeCartDrawer();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Hero Interactive Configurator
     ------------------------------------------------------------------------ */
  function initHero() {
    var root = document.querySelector('[data-carryo-hero]');
    if (!root) return;

    var dataEl = root.querySelector('[data-hero-products]');
    var products = {};
    try {
      products = JSON.parse(dataEl.textContent);
    } catch (err) {
      products = {};
    }

    var state = { size: 'large', colour: 'black', colourName: 'Black', angle: 'heroAction' };

    var mainImg = root.querySelector('[data-hero-main-img]');
    var angleWrap = root.querySelector('[data-hero-angles]');
    var priceEl = root.querySelector('[data-hero-price]');
    var colourLabelEl = root.querySelector('[data-hero-colour-label]');
    var previewNote = root.querySelector('[data-hero-preview-note]');
    var addLabel = root.querySelector('[data-hero-add-label]');
    var detailsLink = root.querySelector('[data-hero-details-link]');
    var addBtn = root.querySelector('[data-hero-add]');

    function resolveVariantId(prod, colourKey) {
      if (!prod) return null;
      if (prod.variants && prod.variants[colourKey]) return prod.variants[colourKey];
      var keys = Object.keys(prod.variants || {});
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(colourKey) !== -1) return prod.variants[keys[i]];
      }
      return prod.defaultVariantId || null;
    }

    function updateHero() {
      var prod = products[state.size] || { shortName: state.size === 'large' ? 'Carryo Large' : 'Carryo Small', priceFormatted: state.size === 'large' ? '₹2,499' : '₹1,899', url: '#shop' };
      var hasPhotos = Boolean(assets[state.colour]);

      if (priceEl) priceEl.textContent = prod.priceFormatted;
      if (colourLabelEl) colourLabelEl.textContent = state.colourName;
      if (addLabel) addLabel.textContent = 'Add ' + prod.shortName + ' (' + state.colourName + ')';
      if (detailsLink) detailsLink.setAttribute('href', prod.url || '#shop');

      root.querySelectorAll('[data-hero-svg]').forEach(function (el) {
        el.setAttribute('hidden', '');
      });

      if (hasPhotos) {
        if (mainImg) {
          mainImg.removeAttribute('hidden');
          mainImg.src = assets[state.colour][state.angle] || assets[state.colour].heroAction;
          mainImg.alt = prod.title + ' in ' + state.colourName;
        }
        if (previewNote) previewNote.setAttribute('hidden', '');
        if (angleWrap) {
          angleWrap.removeAttribute('hidden');
          angleWrap.querySelectorAll('[data-angle-img]').forEach(function (img) {
            var a = img.getAttribute('data-angle-img');
            if (assets[state.colour][a]) img.src = assets[state.colour][a];
          });
        }
      } else {
        if (mainImg) mainImg.setAttribute('hidden', '');
        if (angleWrap) angleWrap.setAttribute('hidden', '');
        if (previewNote) previewNote.removeAttribute('hidden');
        var svgEl = root.querySelector('[data-hero-svg="' + state.colour + '-' + state.size + '"]');
        if (svgEl) svgEl.removeAttribute('hidden');
      }
    }

    root.querySelectorAll('[data-hero-size]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.size = btn.getAttribute('data-hero-size');
        root.querySelectorAll('[data-hero-size]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        updateHero();
      });
    });

    root.querySelectorAll('[data-hero-colour]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.colour = btn.getAttribute('data-hero-colour');
        state.colourName = btn.getAttribute('data-colour-name');
        root.querySelectorAll('[data-hero-colour]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        updateHero();
      });
    });

    root.querySelectorAll('[data-hero-angle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.angle = btn.getAttribute('data-hero-angle');
        root.querySelectorAll('[data-hero-angle]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        updateHero();
      });
    });

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var prod = products[state.size];
        var vid = resolveVariantId(prod, state.colour);
        addToCart(vid, 1);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Lineup Showcase Swatch Switcher & Quick Add
     ------------------------------------------------------------------------ */
  function initLineupCards() {
    document.querySelectorAll('[data-lineup-card]').forEach(function (card) {
      var dataEl = card.querySelector('[data-lineup-variants]');
      var meta = {};
      try {
        meta = JSON.parse(dataEl.textContent);
      } catch (e) {
        meta = {};
      }
      var angle = card.getAttribute('data-angle') || 'front';
      var activeSwatch = card.querySelector('[data-lineup-swatch].is-active');
      var selectedColour = activeSwatch ? activeSwatch.getAttribute('data-lineup-swatch') : 'black';

      var img = card.querySelector('[data-lineup-img]');
      var label = card.querySelector('[data-lineup-colour-label]');
      var addBtn = card.querySelector('[data-lineup-add]');

      card.querySelectorAll('[data-lineup-swatch]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedColour = btn.getAttribute('data-lineup-swatch');
          var colourName = btn.getAttribute('data-colour-name');
          card.querySelectorAll('[data-lineup-swatch]').forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          if (label) label.textContent = colourName;

          card.querySelectorAll('[data-lineup-svg]').forEach(function (s) { s.setAttribute('hidden', ''); });
          if (assets[selectedColour]) {
            if (img) {
              img.removeAttribute('hidden');
              img.src = assets[selectedColour][angle] || assets[selectedColour].front;
            }
          } else {
            if (img) img.setAttribute('hidden', '');
            var svg = card.querySelector('[data-lineup-svg="' + selectedColour + '"]');
            if (svg) svg.removeAttribute('hidden');
          }
        });
      });

      if (addBtn) {
        addBtn.addEventListener('click', function () {
          var variants = meta.variants || {};
          var vid = variants[selectedColour] || null;
          if (!vid) {
            var keys = Object.keys(variants);
            for (var i = 0; i < keys.length; i++) {
              if (keys[i].indexOf(selectedColour) !== -1) {
                vid = variants[keys[i]];
                break;
              }
            }
          }
          vid = vid || meta.defaultVariantId;
          addToCart(vid, 1, function () {
            addBtn.classList.add('is-added');
            addBtn.textContent = '✓ Added';
            window.setTimeout(function () {
              addBtn.classList.remove('is-added');
              addBtn.textContent = '+ Add to Bag';
            }, 1400);
          });
        });
      }
    });

    // Generic collection product card swatch image swap
    document.querySelectorAll('[data-product-card]').forEach(function (card) {
      var img = card.querySelector('[data-card-image]');
      var quickBtn = card.querySelector('[data-quick-add]');
      card.querySelectorAll('[data-card-swatch]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          card.querySelectorAll('[data-card-swatch]').forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var vImg = btn.getAttribute('data-variant-image');
          var vId = btn.getAttribute('data-variant-id');
          if (vImg && img) img.src = vImg;
          if (vId && quickBtn) quickBtn.setAttribute('data-variant-id', vId);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     How It Works Craftsmanship Photo Viewer
     ------------------------------------------------------------------------ */
  function initCraftsmanship() {
    var root = document.querySelector('[data-craftsmanship]');
    if (!root) return;

    var state = { tab: 'interior', colour: 'tan' };
    var img = root.querySelector('[data-craft-img]');
    var heading = root.querySelector('[data-craft-heading]');
    var text = root.querySelector('[data-craft-text]');

    function update() {
      if (img && assets[state.colour] && assets[state.colour][state.tab]) {
        img.src = assets[state.colour][state.tab];
        img.alt = 'Carryo ' + state.colour + ' detail';
      }
    }

    root.querySelectorAll('[data-craft-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.tab = btn.getAttribute('data-craft-tab');
        root.querySelectorAll('[data-craft-tab]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        if (heading) heading.textContent = btn.getAttribute('data-craft-title') || '';
        if (text) text.textContent = btn.getAttribute('data-craft-caption') || '';
        update();
      });
    });

    root.querySelectorAll('[data-craft-colour]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.colour = btn.getAttribute('data-craft-colour');
        root.querySelectorAll('[data-craft-colour]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        update();
      });
    });
  }

  /* ------------------------------------------------------------------------
     FAQ Accordion
     ------------------------------------------------------------------------ */
  function initFaq() {
    document.querySelectorAll('[data-faq-accordion]').forEach(function (acc) {
      acc.querySelectorAll('[data-faq-trigger]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('[data-faq-item]');
          var panel = item.querySelector('[data-faq-panel]');
          var isOpen = item.classList.contains('is-open');

          acc.querySelectorAll('[data-faq-item]').forEach(function (other) {
            other.classList.remove('is-open');
            var p = other.querySelector('[data-faq-panel]');
            var t = other.querySelector('[data-faq-trigger]');
            if (p) p.setAttribute('hidden', '');
            if (t) t.setAttribute('aria-expanded', 'false');
          });

          if (!isOpen) {
            item.classList.add('is-open');
            if (panel) panel.removeAttribute('hidden');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Product Detail Page (PDP) Variant & Gallery Controller
     ------------------------------------------------------------------------ */
  function initPdp() {
    var root = document.querySelector('[data-carryo-pdp]');
    if (!root) return;

    var variants = [];
    var variantsEl = root.querySelector('[data-pdp-variants]');
    try {
      variants = JSON.parse(variantsEl.textContent);
    } catch (e) {
      variants = [];
    }

    var mainImg = root.querySelector('[data-pdp-main-img]');
    var variantInput = root.querySelector('[data-pdp-variant-id]');
    var priceEl = root.querySelector('[data-pdp-price]');
    var submitBtn = root.querySelector('[data-pdp-submit]');
    var form = root.querySelector('[data-pdp-form]');
    var qtyInput = root.querySelector('[data-pdp-qty-input]');
    var builtinThumbs = root.querySelector('[data-pdp-builtin-thumbs]');

    var selectedOptions = [];
    root.querySelectorAll('[data-option-index]').forEach(function (grp) {
      var idx = Number(grp.getAttribute('data-option-index'));
      var activeBtn = grp.querySelector('[data-pdp-option-btn].is-active');
      if (activeBtn) selectedOptions[idx] = activeBtn.getAttribute('data-option-value');
    });

    root.querySelectorAll('[data-pdp-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-src');
        if (src && mainImg) mainImg.src = src;
        root.querySelectorAll('[data-pdp-thumb]').forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });

    root.querySelectorAll('[data-pdp-option-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-option-index'));
        var val = btn.getAttribute('data-option-value');
        selectedOptions[idx] = val;

        var grp = btn.closest('.pdp-option-group');
        if (grp) {
          grp.querySelectorAll('[data-pdp-option-btn]').forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var lbl = grp.querySelector('[data-option-selected-label]');
          if (lbl) lbl.textContent = val;
        }

        // Match Shopify variant
        var match = variants.find(function (v) {
          var opts = [v.option1, v.option2, v.option3].filter(Boolean);
          return selectedOptions.every(function (sel, i) { return !sel || opts[i] === sel; });
        });

        if (match) {
          if (variantInput) variantInput.value = match.id;
          if (priceEl) priceEl.textContent = match.priceFormatted;
          if (submitBtn) {
            submitBtn.disabled = !match.available;
            submitBtn.textContent = match.available ? 'Add to Bag' : 'Sold Out';
          }
          if (match.image && mainImg) {
            mainImg.src = match.image;
          } else if (builtinThumbs) {
            var valKey = String(val || '').toLowerCase();
            var colourKey = valKey.indexOf('tan') !== -1 ? 'tan' : valKey.indexOf('grey') !== -1 || valKey.indexOf('gray') !== -1 ? 'grey' : 'black';
            if (assets[colourKey]) {
              if (mainImg) mainImg.src = assets[colourKey].heroAction;
              builtinThumbs.querySelectorAll('[data-pdp-thumb]').forEach(function (t) {
                var aKey = t.getAttribute('data-angle-key');
                if (assets[colourKey][aKey]) {
                  t.setAttribute('data-src', assets[colourKey][aKey]);
                  var tImg = t.querySelector('img');
                  if (tImg) tImg.src = assets[colourKey][aKey];
                }
              });
            }
          }
        }
      });
    });

    var decBtn = root.querySelector('[data-pdp-qty-dec]');
    var incBtn = root.querySelector('[data-pdp-qty-inc]');
    if (decBtn && qtyInput) {
      decBtn.addEventListener('click', function () {
        qtyInput.value = Math.max(1, (Number(qtyInput.value) || 1) - 1);
      });
    }
    if (incBtn && qtyInput) {
      incBtn.addEventListener('click', function () {
        qtyInput.value = Math.min(10, (Number(qtyInput.value) || 1) + 1);
      });
    }

    if (form && cfg.enableCartDrawer) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var vid = variantInput ? variantInput.value : null;
        var qty = qtyInput ? Number(qtyInput.value) || 1 : 1;
        addToCart(vid, qty, function () {
          if (submitBtn) {
            submitBtn.classList.add('is-added');
            submitBtn.textContent = 'Added to Bag';
            window.setTimeout(function () {
              submitBtn.classList.remove('is-added');
              submitBtn.textContent = 'Add to Bag';
            }, 1400);
          }
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     Track Order Page Form
     ------------------------------------------------------------------------ */
  function initTrackOrder() {
    var form = document.querySelector('[data-track-form]');
    if (!form) return;
    var result = document.querySelector('[data-track-result]');
    var msg = document.querySelector('[data-track-msg]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var num = (document.getElementById('TrackOrderNumber') || {}).value || '';
      if (result) result.removeAttribute('hidden');
      if (msg) {
        msg.textContent =
          'To view live courier tracking for order ' +
          num +
          ', open your Shopify order confirmation email link or sign in to your customer account below.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initCartDrawerEvents();
    initHero();
    initLineupCards();
    initCraftsmanship();
    initFaq();
    initPdp();
    initTrackOrder();
  });
})();
