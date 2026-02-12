import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GlobalStyle from './styles/GlobalStyle';

const DATA_URL = process.env.REACT_APP_CARDS_ENDPOINT || '/data/cards.json';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const IMAGE_ROOT = '/assets/cards/';
const CARD_BACK_IMAGE = '/assets/back.png';
const PLACEHOLDER_IMAGE = CARD_BACK_IMAGE;
const MOBILE_QUERY = '(max-width: 540px)';
const CART_STORAGE_KEY = 'pokemart-cart-v1';
const THEME_KEY = 'pokemart-theme';
const HERO_LIGHT_IMAGE = '/assets/cards/charizarday.png';
const HERO_LIGHT_ALT = 'Charizard arte diurno Carta Destacada';
const HERO_DARK_IMAGE = '/assets/Charizard_ex.png';
const HERO_DARK_ALT = 'Charizard EX Carta Destacada';
const HERO_BACK_IMAGE = '/assets/back.png';
const HERO_BASE_Z_ROTATION = -8;
const HERO_MAX_TILT = 6;
const HERO_MAX_TRANSLATE = 10;
const HERO_SPIN_DURATION_MS = 550;
const HERO_SPIN_HALF_FRACTION = 0.55;
const HERO_SPIN_HOLD_FRACTION = 0.2;
const HERO_ROAR_DURATION_MS = 650;
const HERO_ROAR_MAX_TRANSLATE = 10;
const HERO_ROAR_MAX_SCALE = 0.08;
const HERO_ROAR_WOBBLES = 4.5;
const SKELETONS_POPULAR = 6;
const SKELETONS_DEALS = 4;
const POPULAR_COUNT = 8;
const DEALS_COUNT = 4;
const MAX_VISIBLE_ITEMS = 5;

const raritySymbols = {
  Common: '●',
  Uncommon: '◆',
  Rare: '★',
  'Rare Holo': '★',
  'Rare Holo EX': '★',
  'Rare Holo GX': '★',
  'Rare Holo V': '★',
  'Rare Secret': '★',
  'Rare Ultra': '★',
  'Black White Rare': '★',
  'Illustration Rare': '◆'
};

const rarityBasePrices = {
  Common: 1.5,
  Uncommon: 3,
  Rare: 8,
  'Illustration Rare': 18,
  'Ultra Rare': 24,
  'Special Illustration Rare': 36,
  'Black White Rare': 42
};

const formatCurrency = (value) => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD'
}).format(value);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const listaSinDuplicados = (valores = []) => Array.from(new Set(valores.filter(Boolean)));

const calcularDesfaseDeterminista = (texto) => {
  if (!texto) {
    return 0;
  }
  let hash = 7;
  for (let index = 0; index < texto.length; index += 1) {
    hash = (hash * 31 + texto.charCodeAt(index)) % 1000;
  }
  return hash / 100;
};

const buildImageCandidates = (card) => {
  if (!card?.id) {
    return [PLACEHOLDER_IMAGE];
  }

  const basePath = `${IMAGE_ROOT}${card.id}`;
  const candidates = [
    `${basePath}.png`,
    `${basePath}.jpg`,
    `${basePath}.jpeg`,
    `${basePath}.webp`,
    PLACEHOLDER_IMAGE
  ];
  return listaSinDuplicados(candidates);
};

const normalizeCard = (card) => {
  const priceValue = toNumber(card?.price ?? card?.priceEUR ?? card?.priceUsd);
  const setName = card?.set?.name || card?.setName || 'Colección local';
  const rarity = card?.rarity || 'Rare';
  const basePrice = rarityBasePrices[rarity] ?? 12;
  const desfase = calcularDesfaseDeterminista(card?.id || card?.name);
  const estimatedPrice = Number((basePrice + desfase).toFixed(2));
  return {
    ...card,
    set: card?.set?.name ? card.set : { name: setName },
    price: priceValue || estimatedPrice,
    imageCandidates: buildImageCandidates(card)
  };
};

const mezclarArreglo = (arreglo) => {
  const copia = arreglo.slice();
  for (let index = copia.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copia[index], copia[swapIndex]] = [copia[swapIndex], copia[index]];
  }
  return copia;
};

const elegirSubconjuntoAleatorio = (cards, amount, exclusionSet = new Set()) => {
  const pool = cards.filter((card) => !exclusionSet.has(card?.id));
  const workingPool = pool.length ? pool : cards.slice();
  if (!workingPool.length) {
    return [];
  }
  const shuffled = mezclarArreglo(workingPool);
  const limit = Math.min(amount, shuffled.length);
  return shuffled.slice(0, limit);
};

const obtenerPrecioCarta = (carta) => {
  const directPrice = toNumber(carta?.price);
  if (directPrice && directPrice > 0) {
    return directPrice;
  }

  const marketPrice = toNumber(carta?.cardmarket?.prices?.averageSellPrice);
  if (marketPrice && marketPrice > 0) {
    return marketPrice;
  }

  const priceGroups = carta?.tcgplayer?.prices;
  if (!priceGroups) {
    return null;
  }

  for (const group of Object.values(priceGroups)) {
    const market = toNumber(group?.market);
    if (market && market > 0) {
      return market;
    }
    const mid = toNumber(group?.mid);
    if (mid && mid > 0) {
      return mid;
    }
  }

  return null;
};

const filtrarCartas = (cartas, termino) => {
  if (!termino) {
    return cartas;
  }
  const loweredTerm = termino.toLowerCase();
  return cartas.filter((card) => {
    const nameMatch = card?.name?.toLowerCase().includes(loweredTerm);
    const idMatch = card?.id?.toLowerCase().includes(loweredTerm);
    return nameMatch || idMatch;
  });
};

const safeParseCart = (value) => {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry) => entry && typeof entry.id === 'string');
  } catch (error) {
    console.warn('No se pudo interpretar el carrito guardado', error);
    return [];
  }
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }
    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
};

const CardItem = ({ card, basePrice, discountRate, ctaLabel, onAdd, isCarousel }) => {
  const [rotation, setRotation] = useState(0);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const timeoutRef = useRef(null);

  const imageCandidates = useMemo(() => {
    if (Array.isArray(card?.imageCandidates) && card.imageCandidates.length) {
      return card.imageCandidates;
    }
    return [PLACEHOLDER_IMAGE];
  }, [card]);

  const displayedPrice = useMemo(() => {
    if (basePrice && discountRate) {
      return basePrice * (1 - discountRate);
    }
    return basePrice;
  }, [basePrice, discountRate]);

  const handleAdd = () => {
    onAdd(card, displayedPrice || basePrice || 0);
    setAdded(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  useEffect(() => () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const advanceImageCandidate = useCallback(() => {
    setImageIndex((prev) => Math.min(prev + 1, imageCandidates.length - 1));
  }, [imageCandidates.length]);

  const frontSrc = imageCandidates[Math.min(imageIndex, imageCandidates.length - 1)] || PLACEHOLDER_IMAGE;
  const rarity = card?.rarity || 'Rare';

  return (
    <div
      className={`card-item${isCarousel ? ' carousel-item' : ''}`}
      data-hidden="false"
      data-card-id={card?.id}
      onClick={(event) => {
        if (event.target.closest('button')) {
          return;
        }
        setRotation((prev) => prev + 180);
      }}
    >
      <div className="card-img-container">
        <div className="card-img-flip" style={{ transform: `rotateY(${rotation}deg)` }}>
          <img
            className="card-img-face card-img-face--front"
            alt={card?.name || 'Carta Pokémon'}
            decoding="async"
            loading="lazy"
            src={frontSrc}
            onError={advanceImageCandidate}
          />
          <img
            className="card-img-face card-img-face--back"
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="lazy"
            src={CARD_BACK_IMAGE}
            onError={(event) => {
              event.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>
        {discountRate ? (
          <div className="discount-badge">-{Math.round(discountRate * 100)}%</div>
        ) : null}
      </div>
      <div className="card-info">
        <h3>{card?.name || 'Carta Pokémon'}</h3>
        <div className="card-set">
          <span className="rarity-icon">{raritySymbols[rarity] || '★'}</span>
          {card?.set?.name || 'Colección local'}
        </div>
        <div className="card-price" data-card-id={card?.id}>
          {displayedPrice ? formatCurrency(displayedPrice) : 'N/D'}
          {displayedPrice && basePrice && discountRate ? (
            <span className="old-price">{formatCurrency(basePrice)}</span>
          ) : null}
        </div>
        <button
          className={`add-to-cart${added ? ' add-to-cart--added' : ''}`}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            handleAdd();
          }}
        >
          {added ? 'Agregado ✓' : ctaLabel}
        </button>
      </div>
    </div>
  );
};

const CartPanel = ({ isOpen, items, onClose, onIncrease, onDecrease, onRemove, total }) => {
  const panelBodyRef = useRef(null);

  useEffect(() => {
    if (isOpen && panelBodyRef.current) {
      panelBodyRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  return (
    <div className={`cart-panel${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-panel__backdrop" onClick={onClose} />
      <aside className="cart-panel__body" aria-labelledby="cart-panel-title" role="dialog" tabIndex={-1} ref={panelBodyRef}>
        <header className="cart-panel__header">
          <h2 id="cart-panel-title">Tu carrito</h2>
          <button className="cart-panel__close" type="button" onClick={onClose} aria-label="Cerrar carrito">
            ×
          </button>
        </header>
        <div className="cart-panel__content">
          {items.length ? (
            <ul className="cart-panel__list">
              {items.map((item) => (
                <li className="cart-item-row" key={item.id} data-cart-item-id={item.id}>
                  <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} />
                  <div className="cart-item-row__meta">
                    <div className="cart-item-row__name">{item.name}</div>
                    <div className="cart-item-row__set">{item.setName}</div>
                    <div className="cart-item-row__actions">
                      <button className="cart-qty-btn" type="button" onClick={() => onDecrease(item.id)}>
                        −
                      </button>
                      <span className="cart-item-row__qty">{item.quantity}</span>
                      <button className="cart-qty-btn" type="button" onClick={() => onIncrease(item.id)}>
                        +
                      </button>
                    </div>
                    <button className="cart-item-row__remove" type="button" onClick={() => onRemove(item.id)}>
                      Eliminar
                    </button>
                  </div>
                  <div className="cart-item-row__controls">
                    <span className="cart-item-row__price">{formatCurrency(item.price)} c/u</span>
                    <span className="cart-item-row__subtotal">
                      Subtotal: {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="cart-panel__empty">Tu carrito está vacío por ahora.</div>
          )}
        </div>
        <footer className="cart-panel__footer">
          <div className="cart-panel__summary">
            <span>Total estimado</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <button className="cart-panel__checkout" type="button" onClick={() => alert('Funcionalidad de checkout en desarrollo.') }>
            Proceder al pago
          </button>
        </footer>
      </aside>
    </div>
  );
};

function App() {
  const [popularCards, setPopularCards] = useState([]);
  const [dealCards, setDealCards] = useState([]);
  const [popularState, setPopularState] = useState('loading');
  const [dealsState, setDealsState] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [headerLight, setHeaderLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  const catalogRef = useRef([]);
  const catalogPromiseRef = useRef(null);
  const lastQueryRef = useRef('');
  const carouselIndexRef = useRef(0);

  const headerContentRef = useRef(null);
  const headerFlexRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroImageContainerRef = useRef(null);
  const heroTiltWrapperRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroCardFrontRef = useRef(null);
  const heroCardBackRef = useRef(null);
  const heroAudioRef = useRef(null);
  const popularContainerRef = useRef(null);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isMenuMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const ensureCatalog = useCallback(async () => {
    if (catalogRef.current.length) {
      return catalogRef.current;
    }

    if (!catalogPromiseRef.current) {
      catalogPromiseRef.current = fetch(DATA_URL, { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se pudo cargar el catálogo local');
          }
          return response.json();
        })
        .then((payload) => {
          const cards = Array.isArray(payload?.data) ? payload.data : [];
          catalogRef.current = cards.map(normalizeCard);
          return catalogRef.current;
        })
        .catch((error) => {
          catalogPromiseRef.current = null;
          throw error;
        });
    }

    return catalogPromiseRef.current;
  }, []);

  const computeCartTotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const addItemToCart = (card, price) => {
    if (!card) {
      return;
    }
    const cardId = card.id || card.name;
    if (!cardId) {
      return;
    }
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.id === cardId);
      if (index >= 0) {
        const next = prev.slice();
        next[index] = { ...next[index], quantity: next[index].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          id: cardId,
          name: card.name || 'Carta misteriosa',
          price: Number(price) || 0,
          quantity: 1,
          image: card?.imageCandidates?.[0] || PLACEHOLDER_IMAGE,
          setName: card?.set?.name || 'Colección local'
        }
      ];
    });
  };

  const removeItemFromCart = (cardId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cardId));
  };

  const updateItemQuantity = (cardId, delta) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.id === cardId);
      if (index < 0) {
        return prev;
      }
      const next = prev.slice();
      const nextQuantity = next[index].quantity + delta;
      if (nextQuantity <= 0) {
        return next.filter((item) => item.id !== cardId);
      }
      next[index] = { ...next[index], quantity: nextQuantity };
      return next;
    });
  };

  const aplicarSeleccionesAleatorias = (sourceCards) => {
    if (!Array.isArray(sourceCards) || !sourceCards.length) {
      setPopularCards([]);
      setDealCards([]);
      setPopularState('empty');
      setDealsState('empty');
      setStatusMessage('No se encontraron cartas con ese criterio.');
      return;
    }

    const popularSelection = elegirSubconjuntoAleatorio(sourceCards, POPULAR_COUNT);
    const exclusion = new Set(popularSelection.map((card) => card?.id));
    const dealsSelection = elegirSubconjuntoAleatorio(sourceCards, DEALS_COUNT, exclusion);

    setPopularCards(popularSelection);
    setDealCards(dealsSelection);
    setPopularState('ready');
    setDealsState('ready');
    setStatusMessage('');
    carouselIndexRef.current = 0;
  };

  const loadCards = useCallback(async (termino = '') => {
    const normalizedTerm = termino.trim();
    if (normalizedTerm === lastQueryRef.current && popularCards.length && popularState === 'ready') {
      return;
    }
    lastQueryRef.current = normalizedTerm;
    setPopularState('loading');
    setDealsState('loading');
    setStatusMessage('');
    setPopularCards([]);
    setDealCards([]);

    try {
      const cards = await ensureCatalog();
      const filtered = filtrarCartas(cards, normalizedTerm);
      if (!filtered.length) {
        setPopularState('error');
        setDealsState('error');
        setStatusMessage('No se encontraron cartas con ese criterio.');
        return;
      }
      aplicarSeleccionesAleatorias(filtered.slice());
    } catch (error) {
      console.error(error);
      setPopularState('error');
      setDealsState('error');
      setStatusMessage('No se pudo cargar el catálogo local.');
    }
  }, [ensureCatalog, popularCards.length, popularState]);

  const updateHeaderContrast = useCallback(() => {
    const headerContent = headerContentRef.current;
    if (!headerContent) {
      return;
    }
    if (!heroSectionRef.current) {
      setHeaderLight(true);
      return;
    }
    const heroBottom = heroSectionRef.current.offsetTop + heroSectionRef.current.offsetHeight;
    const headerHeight = headerContent.offsetHeight || 0;
    const scrollPosition = window.scrollY || window.pageYOffset || 0;
    const shouldLight = scrollPosition + headerHeight >= heroBottom;
    setHeaderLight(shouldLight);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
    setCartItems(safeParseCart(localStorage.getItem(CART_STORAGE_KEY)).map((item) => ({
      ...item,
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Number(item.price) || 0
    })));
    loadCards('');
  }, [loadCards]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('cart-open', isCartOpen);
  }, [isCartOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.warn('No se pudo guardar el carrito', error);
    }
  }, [cartItems]);

  useEffect(() => {
    updateHeaderContrast();
    const onScroll = () => requestAnimationFrame(updateHeaderContrast);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateHeaderContrast);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateHeaderContrast);
    };
  }, [updateHeaderContrast]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const handler = (event) => {
      if (headerContentRef.current && !headerContentRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!popularContainerRef.current || popularState !== 'ready') {
      return undefined;
    }

    const cards = Array.from(popularContainerRef.current.querySelectorAll('.card-item'));
    const total = cards.length;
    if (!total) {
      return undefined;
    }

    if (isMobile) {
      cards.forEach((card) => {
        card.dataset.hidden = 'false';
        card.style.transform = 'none';
        card.style.opacity = '1';
        card.style.zIndex = '';
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
        card.classList.remove('is-center');
      });
      return undefined;
    }

    const visibleWindow = Math.min(MAX_VISIBLE_ITEMS, total);
    const threshold = Math.floor(visibleWindow / 2);
    const currentIndex = carouselIndexRef.current % total;

    cards.forEach((card, idx) => {
      const rawOffset = idx - currentIndex;
      let offset = rawOffset;
      if (offset > total / 2) {
        offset -= total;
      }
      if (offset < -total / 2) {
        offset += total;
      }

      const absOffset = Math.abs(offset);
      const hidden = absOffset > threshold && total > visibleWindow;
      card.dataset.hidden = hidden ? 'true' : 'false';

      const translateX = offset * 12;
      const translateZ = -Math.min(absOffset * 160, 720);
      const rotateY = offset * -12;
      const scale = Math.max(0.6, 1 - absOffset * 0.15);
      const opacity = hidden ? 0 : Math.max(0.25, 1 - absOffset * 0.25);

      card.style.transform = `translateX(-50%) translateX(${translateX}rem) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity.toString();
      card.style.zIndex = String(100 - absOffset * 10);
      card.style.visibility = hidden ? 'hidden' : 'visible';
      card.classList.toggle('is-center', offset === 0);
      card.style.pointerEvents = absOffset <= 1 ? 'auto' : 'none';
    });

    return undefined;
  }, [popularCards, popularState, isMobile]);

  const moveCarousel = (direction) => {
    if (isMobile || popularState !== 'ready') {
      return;
    }
    const total = popularCards.length;
    if (total <= 1) {
      return;
    }
    if (!popularContainerRef.current) {
      return;
    }
    carouselIndexRef.current = (carouselIndexRef.current + direction + total) % total;
    if (popularContainerRef.current) {
      const event = new Event('carouselUpdate');
      popularContainerRef.current.dispatchEvent(event);
    }
    requestAnimationFrame(() => {
      const cards = Array.from(popularContainerRef.current.querySelectorAll('.card-item'));
      const visibleWindow = Math.min(MAX_VISIBLE_ITEMS, total);
      const threshold = Math.floor(visibleWindow / 2);
      const currentIndex = carouselIndexRef.current % total;

      cards.forEach((card, idx) => {
        const rawOffset = idx - currentIndex;
        let offset = rawOffset;
        if (offset > total / 2) {
          offset -= total;
        }
        if (offset < -total / 2) {
          offset += total;
        }

        const absOffset = Math.abs(offset);
        const hidden = absOffset > threshold && total > visibleWindow;
        card.dataset.hidden = hidden ? 'true' : 'false';

        const translateX = offset * 12;
        const translateZ = -Math.min(absOffset * 160, 720);
        const rotateY = offset * -12;
        const scale = Math.max(0.6, 1 - absOffset * 0.15);
        const opacity = hidden ? 0 : Math.max(0.25, 1 - absOffset * 0.25);

        card.style.transform = `translateX(-50%) translateX(${translateX}rem) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = opacity.toString();
        card.style.zIndex = String(100 - absOffset * 10);
        card.style.visibility = hidden ? 'hidden' : 'visible';
        card.classList.toggle('is-center', offset === 0);
        card.style.pointerEvents = absOffset <= 1 ? 'auto' : 'none';
      });
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/store/health/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Backend error');
        }
        setBackendStatus('online');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setBackendStatus('offline');
        }
      }
    };
    fetchHealth();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const heroCard = heroCardRef.current;
    const heroTiltWrapper = heroTiltWrapperRef.current;
    const heroCardFront = heroCardFrontRef.current;
    const heroCardBack = heroCardBackRef.current;
    if (!heroCard || !heroTiltWrapper || !heroCardFront) {
      return undefined;
    }

    const heroTiltState = { x: 0, y: 0 };
    const heroSpinState = { rotationY: 0 };
    const heroRoarState = { translateX: 0, translateY: 0, scale: 1 };
    let heroTiltAnimationFrame = null;
    let heroSpinAnimationFrame = null;
    let heroRoarAnimationFrame = null;
    let heroSpinActive = false;
    let heroRoarActive = false;

    const updateHeroFacesForSpin = () => {};

    const renderHeroTransformNow = () => {
      const { x: tiltX, y: tiltY } = heroTiltState;
      const tiltTranslateX = HERO_MAX_TILT ? -(tiltX / HERO_MAX_TILT) * HERO_MAX_TRANSLATE : 0;
      const tiltTranslateY = HERO_MAX_TILT ? (tiltY / HERO_MAX_TILT) * HERO_MAX_TRANSLATE : 0;
      const translateX = tiltTranslateX + heroRoarState.translateX;
      const translateY = tiltTranslateY + heroRoarState.translateY;
      const totalRotateY = heroSpinState.rotationY + tiltX;
      const scale = heroRoarState.scale;
      heroCard.style.transform = `translateX(${translateX.toFixed(2)}px) translateY(${translateY.toFixed(2)}px) rotateX(${tiltY.toFixed(2)}deg) rotateY(${totalRotateY.toFixed(2)}deg) rotate(${HERO_BASE_Z_ROTATION}deg) scale(${scale.toFixed(3)})`;
      updateHeroFacesForSpin();
      heroTiltAnimationFrame = null;
    };

    const scheduleHeroRender = () => {
      if (heroTiltAnimationFrame) {
        cancelAnimationFrame(heroTiltAnimationFrame);
      }
      heroTiltAnimationFrame = requestAnimationFrame(renderHeroTransformNow);
    };

    const setHeroTilt = (tiltX, tiltY) => {
      heroTiltState.x = clamp(tiltX, -HERO_MAX_TILT, HERO_MAX_TILT);
      heroTiltState.y = clamp(tiltY, -HERO_MAX_TILT, HERO_MAX_TILT);
      scheduleHeroRender();
    };

    const resetHeroImageTransform = (useAnimation = true, preserveDynamicEffects = true) => {
      heroTiltState.x = 0;
      heroTiltState.y = 0;
      if (heroSpinAnimationFrame) {
        cancelAnimationFrame(heroSpinAnimationFrame);
        heroSpinAnimationFrame = null;
      }
      heroSpinState.rotationY = 0;
      heroSpinActive = false;
      updateHeroFacesForSpin(0);
      if (!preserveDynamicEffects) {
        heroRoarState.translateX = 0;
        heroRoarState.translateY = 0;
        heroRoarState.scale = 1;
        if (heroRoarAnimationFrame) {
          cancelAnimationFrame(heroRoarAnimationFrame);
          heroRoarAnimationFrame = null;
        }
        heroRoarActive = false;
      }
      if (heroTiltAnimationFrame) {
        cancelAnimationFrame(heroTiltAnimationFrame);
        heroTiltAnimationFrame = null;
      }
      if (useAnimation) {
        scheduleHeroRender();
      } else {
        renderHeroTransformNow();
      }
    };

    const playHeroRoarSound = () => {
      if (!heroAudioRef.current) {
        return;
      }
      try {
        heroAudioRef.current.currentTime = 0;
        const playPromise = heroAudioRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch (error) {
        console.warn('No se pudo reproducir el rugido', error);
      }
    };

    const startHeroRoar = () => {
      const startTimestamp = performance.now();
      const duration = HERO_ROAR_DURATION_MS;
      if (heroRoarAnimationFrame) {
        cancelAnimationFrame(heroRoarAnimationFrame);
        heroRoarAnimationFrame = null;
      }
      heroRoarState.translateX = 0;
      heroRoarState.translateY = 0;
      heroRoarState.scale = 1;
      heroRoarActive = true;
      playHeroRoarSound();

      const animate = (timestamp) => {
        const elapsed = timestamp - startTimestamp;
        const progress = clamp(elapsed / duration, 0, 1);
        const intensity = 1 - progress;
        const wobble = Math.sin(progress * Math.PI * HERO_ROAR_WOBBLES);
        heroRoarState.translateX = wobble * HERO_ROAR_MAX_TRANSLATE * intensity;
        heroRoarState.translateY = 0;
        const growth = Math.sin(progress * Math.PI);
        heroRoarState.scale = 1 + HERO_ROAR_MAX_SCALE * growth;
        scheduleHeroRender();
        if (progress < 1) {
          heroRoarAnimationFrame = requestAnimationFrame(animate);
        } else {
          heroRoarState.translateX = 0;
          heroRoarState.translateY = 0;
          heroRoarState.scale = 1;
          heroRoarActive = false;
          heroRoarAnimationFrame = null;
          scheduleHeroRender();
        }
      };

      heroRoarAnimationFrame = requestAnimationFrame(animate);
    };

    const triggerHeroRoar = () => {
      if (prefersReducedMotion) {
        return;
      }
      if (heroSpinActive || heroRoarActive) {
        return;
      }
      const startTimestamp = performance.now();
      const duration = HERO_SPIN_DURATION_MS;
      if (heroSpinAnimationFrame) {
        cancelAnimationFrame(heroSpinAnimationFrame);
        heroSpinAnimationFrame = null;
      }

      heroSpinState.rotationY = 0;
      heroSpinActive = true;
      heroRoarState.translateX = 0;
      heroRoarState.translateY = 0;
      heroRoarState.scale = 1;
      setHeroTilt(0, 0);

      const holdStart = clamp(HERO_SPIN_HALF_FRACTION, 0, 1);
      const holdEnd = clamp(holdStart + HERO_SPIN_HOLD_FRACTION, holdStart, 1);
      const remainingSpan = Math.max(1 - holdEnd, 0.0001);

      const easeOut = (value) => 1 - Math.pow(1 - value, 2);
      const easeIn = (value) => value * value;

      const animateSpin = (timestamp) => {
        const elapsed = timestamp - startTimestamp;
        const progress = clamp(elapsed / duration, 0, 1);
        let rotation;
        if (progress < holdStart) {
          const localProgress = progress / holdStart;
          rotation = easeOut(localProgress) * 180;
        } else if (progress < holdEnd) {
          rotation = 180;
        } else {
          const localProgress = (progress - holdEnd) / remainingSpan;
          rotation = 180 + easeIn(localProgress) * 180;
        }
        heroSpinState.rotationY = rotation;
        scheduleHeroRender();
        if (progress < 1) {
          heroSpinAnimationFrame = requestAnimationFrame(animateSpin);
        } else {
          heroSpinState.rotationY = 0;
          heroSpinAnimationFrame = null;
          heroSpinActive = false;
          scheduleHeroRender();
          startHeroRoar();
        }
      };

      heroSpinAnimationFrame = requestAnimationFrame(animateSpin);
    };

    const handlePointerMove = (event) => {
      if (prefersReducedMotion) {
        return;
      }
      if (event.pointerType === 'touch') {
        return;
      }
      if (heroSpinActive || heroRoarActive) {
        return;
      }
      const rect = heroTiltWrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const relativeX = clamp(((event.clientX - rect.left) / rect.width) - 0.5, -0.5, 0.5);
      const relativeY = clamp(((event.clientY - rect.top) / rect.height) - 0.5, -0.5, 0.5);
      const tiltX = relativeX * HERO_MAX_TILT * 2;
      const tiltY = -relativeY * HERO_MAX_TILT * 2;
      setHeroTilt(tiltX, tiltY);
    };

    const handlePointerExit = () => {
      if (heroSpinActive || heroRoarActive) {
        return;
      }
      resetHeroImageTransform();
    };

    heroTiltWrapper.setAttribute('role', 'button');
    heroTiltWrapper.setAttribute('tabindex', '0');
    heroTiltWrapper.setAttribute('aria-label', 'Carta destacada interactiva');
    if (heroCardBack) {
      heroCardBack.setAttribute('src', HERO_BACK_IMAGE);
      heroCardBack.setAttribute('alt', '');
      heroCardBack.setAttribute('aria-hidden', 'true');
      heroCardBack.setAttribute('draggable', 'false');
    }
    heroCardFront.setAttribute('draggable', 'false');
    resetHeroImageTransform(false, false);

    heroTiltWrapper.addEventListener('pointermove', handlePointerMove);
    heroTiltWrapper.addEventListener('pointerenter', handlePointerMove);
    heroTiltWrapper.addEventListener('pointerleave', handlePointerExit);
    heroTiltWrapper.addEventListener('pointercancel', handlePointerExit);
    heroTiltWrapper.addEventListener('pointerup', handlePointerExit);
    heroTiltWrapper.addEventListener('pointerout', handlePointerExit);
    heroTiltWrapper.addEventListener('click', triggerHeroRoar);
    heroTiltWrapper.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        triggerHeroRoar();
      }
    });

    return () => {
      heroTiltWrapper.removeEventListener('pointermove', handlePointerMove);
      heroTiltWrapper.removeEventListener('pointerenter', handlePointerMove);
      heroTiltWrapper.removeEventListener('pointerleave', handlePointerExit);
      heroTiltWrapper.removeEventListener('pointercancel', handlePointerExit);
      heroTiltWrapper.removeEventListener('pointerup', handlePointerExit);
      heroTiltWrapper.removeEventListener('pointerout', handlePointerExit);
      heroTiltWrapper.removeEventListener('click', triggerHeroRoar);
      if (heroTiltAnimationFrame) {
        cancelAnimationFrame(heroTiltAnimationFrame);
      }
      if (heroSpinAnimationFrame) {
        cancelAnimationFrame(heroSpinAnimationFrame);
      }
      if (heroRoarAnimationFrame) {
        cancelAnimationFrame(heroRoarAnimationFrame);
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!heroCardFrontRef.current) {
      return;
    }
    const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
    const isDarkTheme = normalizedTheme === 'dark';
    const nextSrc = isDarkTheme ? HERO_DARK_IMAGE : HERO_LIGHT_IMAGE;
    const nextAlt = isDarkTheme ? HERO_DARK_ALT : HERO_LIGHT_ALT;
    if (heroCardFrontRef.current.getAttribute('src') !== nextSrc) {
      heroCardFrontRef.current.setAttribute('src', nextSrc);
    }
    if (heroCardFrontRef.current.getAttribute('alt') !== nextAlt) {
      heroCardFrontRef.current.setAttribute('alt', nextAlt);
    }
    heroCardFrontRef.current.dataset.heroTheme = normalizedTheme;
  }, [theme]);

  const backendLabel = backendStatus === 'online'
    ? 'Online'
    : backendStatus === 'offline'
      ? 'Offline'
      : 'Revisando...';

  return (
    <>
      <GlobalStyle />
      <header className="main-header">
        <div
          className={`container header-content${menuOpen ? ' menu-open' : ''}${headerLight ? ' header-content--light' : ''}`}
          ref={headerContentRef}
        >
          <a href="#hero" className="logo">
            <img src="/assets/logo.png" alt="PokéMart TCG" className="logo__img" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="header-utility"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
          </button>
          <div className="header-flex" id="header-utility" aria-hidden={isMenuMobile ? !menuOpen : false} ref={headerFlexRef}>
            <div className="search-bar">
              <input
                type="text"
                autoComplete="off"
                name="text"
                className="input"
                placeholder="Busca Charizard, Pikachu, Crown Zenith..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    loadCards(searchTerm);
                  }
                }}
              />
              <button
                className="search-btn neu-button"
                type="button"
                onClick={() => loadCards(searchTerm)}
              >
                GO!
              </button>
            </div>
            <div className="user-actions">
              <a href="#footer" className="header-sell">Vender Cartas</a>
              <button
                className="cart-icon"
                type="button"
                aria-label="Ver carrito"
                onClick={() => setIsCartOpen((prev) => !prev)}
              >
                <img src="/assets/cart.png" alt="Carrito" className="cart-icon__img" />
                <span className="cart-count">{cartCount}</span>
              </button>
              <div className="toggle-cont" aria-label="Cambiar tema">
                <input
                  className="toggle-input"
                  id="theme-toggle"
                  name="theme-toggle"
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
                />
                <label className="toggle-label" htmlFor="theme-toggle">
                  <div className="cont-icon">
                    <span style={{ '--width': 2, '--deg': 25, '--duration': 11 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 100, '--duration': 18 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 280, '--duration': 5 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 200, '--duration': 3 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 30, '--duration': 20 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 300, '--duration': 9 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 250, '--duration': 4 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 210, '--duration': 8 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 100, '--duration': 9 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 15, '--duration': 13 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 75, '--duration': 18 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 65, '--duration': 6 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 50, '--duration': 7 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 320, '--duration': 5 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 220, '--duration': 5 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 215, '--duration': 2 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 135, '--duration': 9 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 45, '--duration': 4 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 78, '--duration': 16 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 89, '--duration': 19 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 65, '--duration': 14 }} className="sparkle" />
                    <span style={{ '--width': 2, '--deg': 97, '--duration': 1 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 174, '--duration': 10 }} className="sparkle" />
                    <span style={{ '--width': 1, '--deg': 236, '--duration': 5 }} className="sparkle" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="icon">
                      <path d="M0.96233 28.61C1.36043 29.0081 1.96007 29.1255 2.47555 28.8971L10.4256 25.3552C13.2236 24.11 16.4254 24.1425 19.2107 25.4401L27.4152 29.2747C27.476 29.3044 27.5418 29.3023 27.6047 29.32C27.6563 29.3348 27.7079 29.3497 27.761 29.3574C27.843 29.3687 27.9194 29.3758 28 29.3688C28.1273 29.3617 28.2531 29.3405 28.3726 29.2945C28.4447 29.262 28.5162 29.2287 28.5749 29.1842C28.6399 29.1446 28.6993 29.0994 28.7509 29.0477L28.9008 28.8582C28.9468 28.7995 28.9793 28.7274 29.0112 28.656C29.0599 28.5322 29.0811 28.4036 29.0882 28.2734C29.0939 28.1957 29.0868 28.1207 29.0769 28.0415C29.0705 27.9955 29.0585 27.9524 29.0472 27.9072C29.0295 27.8343 29.0302 27.7601 28.9984 27.6901L25.1638 19.4855C23.8592 16.7073 23.8273 13.5048 25.0726 10.7068L28.6145 2.75679C28.8429 2.24131 28.7318 1.63531 28.3337 1.2372C27.9165 0.820011 27.271 0.721743 26.7491 0.9961L19.8357 4.59596C16.8418 6.15442 13.2879 6.18696 10.2615 4.70062L1.80308 0.520214C1.7055 0.474959 1.60722 0.441742 1.50964 0.421943C1.44459 0.409215 1.37882 0.395769 1.3074 0.402133C1.14406 0.395769 0.981436 0.428275 0.818095 0.499692C0.77284 0.519491 0.719805 0.545671 0.67455 0.578198C0.596061 0.617088 0.524653 0.675786 0.4596 0.74084C0.394546 0.805894 0.335843 0.877306 0.296245 0.956502C0.263718 1.00176 0.237561 1.05477 0.217762 1.10003C0.152708 1.24286 0.126545 1.40058 0.120181 1.54978C0.120181 1.61483 0.126527 1.6735 0.132891 1.73219C0.15269 1.85664 0.178881 1.97332 0.237571 2.08434L4.41798 10.5427C5.91139 13.5621 5.8725 17.1238 4.3204 20.1099L0.720514 27.0233C0.440499 27.5536 0.545137 28.1928 0.96233 28.61Z"></path>
                    </svg>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartPanel
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onIncrease={(id) => updateItemQuantity(id, 1)}
        onDecrease={(id) => updateItemQuantity(id, -1)}
        onRemove={removeItemFromCart}
        total={computeCartTotal}
      />

      <main>
        <section className="landing-hero" id="hero" ref={heroSectionRef}>
          <div className="container hero-content">
            <div className="hero-text">
              <h1>Hazte con todas... <span>¡Las mejores cartas!</span></h1>
              <p>El mercado más seguro para comprar y vender tus cartas coleccionables de Pokémon TCG. Desde clásicos vintage hasta las últimas expansiones.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" type="button">Explorar Cartas</button>
                <button className="btn btn-secondary" type="button">Empezar a Vender</button>
              </div>
            </div>
            <div className="hero-image" ref={heroImageContainerRef}>
              <div className="hero-tilt-wrapper" ref={heroTiltWrapperRef}>
                <div className="hero-card" ref={heroCardRef}>
                  <img
                    src={HERO_LIGHT_IMAGE}
                    alt={HERO_LIGHT_ALT}
                    className="hero-card__face hero-card__face--front"
                    ref={heroCardFrontRef}
                  />
                  <img
                    src={HERO_BACK_IMAGE}
                    alt=""
                    aria-hidden="true"
                    className="hero-card__face hero-card__face--back"
                    ref={heroCardBackRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <audio id="hero-roar-audio" src="/assets/sounds/charizard.mp3" preload="auto" ref={heroAudioRef} />

        <section className="popular-section container" id="popular">
          <h2 className="section-title">
            <img src="/assets/charizard-seeklogo.svg" alt="Icono de Charizard" className="section-title__icon" />
            <span>Populares esta semana</span>
          </h2>
          <div className="carousel-shell">
            <button
              className="carousel-nav carousel-nav--prev"
              type="button"
              aria-label="Carta anterior"
              disabled={isMobile || popularCards.length <= 1}
              onClick={() => moveCarousel(-1)}
            >
              &lt;
            </button>
            <div className="carousel-window">
              <div className="carousel-track" id="popular-cards" data-state={popularState} data-count={popularCards.length} ref={popularContainerRef}>
                {popularState === 'loading' ? (
                  Array.from({ length: SKELETONS_POPULAR }).map((_, index) => (
                    <div className="card-item skeleton-card carousel-item" key={`skeleton-popular-${index}`}>
                      <div className="card-img-container">
                        <div className="skeleton skeleton-img" />
                      </div>
                      <div className="card-info">
                        <div className="skeleton skeleton-title" />
                        <div className="skeleton skeleton-line" />
                        <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                        <div className="skeleton skeleton-pill" />
                      </div>
                    </div>
                  ))
                ) : null}
                {popularState === 'error' || popularState === 'empty' ? (
                  <p className="status-message error">{statusMessage || 'No se encontraron cartas populares.'}</p>
                ) : null}
                {popularState === 'ready'
                  ? popularCards.map((card) => (
                    <CardItem
                      key={card.id || card.name}
                      card={card}
                      basePrice={obtenerPrecioCarta(card)}
                      ctaLabel="Añadir al carrito"
                      onAdd={addItemToCart}
                      isCarousel
                    />
                  ))
                  : null}
              </div>
            </div>
            <button
              className="carousel-nav carousel-nav--next"
              type="button"
              aria-label="Carta siguiente"
              disabled={isMobile || popularCards.length <= 1}
              onClick={() => moveCarousel(1)}
            >
              &gt;
            </button>
          </div>
        </section>

        <section className="deals-section" id="deals">
          <div className="container">
            <h2 className="section-title">
              <img src="/assets/Pikachu.svg" alt="Icono de Pikachu" className="section-title__icon section-title__icon--offset" />
              <span>Ofertas Relámpago</span>
            </h2>
            <div className="deals-grid" id="deal-cards">
              {dealsState === 'loading' ? (
                Array.from({ length: SKELETONS_DEALS }).map((_, index) => (
                  <div className="card-item skeleton-card" key={`skeleton-deal-${index}`}>
                    <div className="card-img-container">
                      <div className="skeleton skeleton-img" />
                    </div>
                    <div className="card-info">
                      <div className="skeleton skeleton-title" />
                      <div className="skeleton skeleton-line" />
                      <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                      <div className="skeleton skeleton-pill" />
                    </div>
                  </div>
                ))
              ) : null}
              {dealsState === 'error' || dealsState === 'empty' ? (
                <p className="status-message error">{statusMessage || 'No se encontraron ofertas.'}</p>
              ) : null}
              {dealsState === 'ready'
                ? dealCards.map((card, index) => {
                  const basePrice = obtenerPrecioCarta(card);
                  const discounts = [0.15, 0.2, 0.25, 0.3];
                  const discountRate = discounts[index % discounts.length];
                  return (
                    <CardItem
                      key={card.id || card.name}
                      card={card}
                      basePrice={basePrice}
                      discountRate={discountRate}
                      ctaLabel="¡Comprar oferta!"
                      onAdd={addItemToCart}
                    />
                  );
                })
                : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="main-footer" id="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo" style={{ fontSize: '1.4rem' }}>
                <img src="/assets/logo.png" alt="PokéMart TCG" className="logo__img" />
              </div>
              <p style={{ marginTop: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
                Tu tienda de confianza hecha por fans para fans. Compra, vende e intercambia tus cartas favoritas de forma segura.
              </p>
            </div>
            <div className="footer-col">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#popular">Comprar Cartas</a></li>
                <li><a href="#deals">Vender mis Cartas</a></li>
                <li><a href="#footer">Guía de Estado</a></li>
                <li><a href="#footer">Sobre Nosotros</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Ayuda</h4>
              <ul>
                <li><a href="#footer">Centro de Soporte</a></li>
                <li><a href="#footer">Envíos y Devoluciones</a></li>
                <li><a href="#footer">Términos y Condiciones</a></li>
                <li><a href="#footer">Política de Privacidad</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Suscríbete a ofertas</h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>Recibe alertas de stock y descuentos exclusivos.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Tu email..." />
                <button type="submit">⚡</button>
              </form>
              <div className={`backend-status backend-status--${backendStatus}`}>
                Backend: {backendLabel}
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>© 2026 URBE</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
