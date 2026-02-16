export const CONSTANTS = {
    DATA_URL: process.env.REACT_APP_CARDS_ENDPOINT || 'data/cards.json',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
    IMAGE_ROOT: '/assets/cards/',
    CARD_BACK_IMAGE: '/assets/back.png',
    PLACEHOLDER_IMAGE: 'assets/back.png',
    MOBILE_QUERY: '(max-width: 540px)',
    CART_STORAGE_KEY: 'pokemart-cart-v1',
    THEME_KEY: 'pokemart-theme',
    HERO_LIGHT_IMAGE: '/assets/cards/charizarday.png',
    HERO_LIGHT_ALT: 'Charizard arte diurno Carta Destacada',
    HERO_DARK_IMAGE: '/assets/Charizard_ex.png',
    HERO_DARK_ALT: 'Charizard EX Carta Destacada',
    HERO_BACK_IMAGE: '/assets/back.png',
    HERO_BASE_Z_ROTATION: -8,
    HERO_MAX_TILT: 6,
    HERO_MAX_TRANSLATE: 10,
     HERO_SPIN_DURATION_MS: 550,
     HERO_SPIN_HALF_FRACTION: 0.55,
     HERO_SPIN_HOLD_FRACTION: 0.2,
     HERO_ROAR_DURATION_MS: 650,
     HERO_ROAR_MAX_TRANSLATE: 10,
     HERO_ROAR_MAX_SCALE: 0.08,
     HERO_ROAR_WOBBLES: 4.5,
     SKELETONS_POPULAR: 6,
     SKELETONS_DEALS: 4,
     POPULAR_COUNT: 8,
     DEALS_COUNT: 4,
     MAX_VISIBLE_ITEMS: 5,
};

export const raritySymbols = {
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

export const rarityBasePrices = {
  Common: 1.5,
  Uncommon: 3,
  Rare: 8,
  'Illustration Rare': 18,
  'Ultra Rare': 24,
  'Special Illustration Rare': 36,
  'Black White Rare': 42
};