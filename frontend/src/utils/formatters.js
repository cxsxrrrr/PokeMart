import { CONSTANTS, rarityBasePrices } from './constants';

export const formatCurrency = (value) => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD'
}).format(value);

export const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const listaSinDuplicados = (valores = []) => Array.from(new Set(valores.filter(Boolean)));

// --- Lógica de Cartas y Negocio ---

export const calcularDesfaseDeterminista = (texto) => {
  if (!texto) return 0;
  let hash = 7;
  for (let index = 0; index < texto.length; index += 1) {
    hash = (hash * 31 + texto.charCodeAt(index)) % 1000;
  }
  return hash / 100;
};

export const buildImageCandidates = (card) => {
  if (!card?.id) return [CONSTANTS.PLACEHOLDER_IMAGE];

  const basePath = `${CONSTANTS.IMAGE_ROOT}${card.id}`;
  const candidates = [
    `${basePath}.png`,
    `${basePath}.jpg`,
    `${basePath}.jpeg`,
    `${basePath}.webp`,
    CONSTANTS.PLACEHOLDER_IMAGE
  ];
  return listaSinDuplicados(candidates);
};

export const normalizeCard = (card) => {
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

export const obtenerPrecioCarta = (carta) => {
  const directPrice = toNumber(carta?.price);
  if (directPrice && directPrice > 0) return directPrice;

  const marketPrice = toNumber(carta?.cardmarket?.prices?.averageSellPrice);
  if (marketPrice && marketPrice > 0) return marketPrice;

  const priceGroups = carta?.tcgplayer?.prices;
  if (!priceGroups) return null;

  for (const group of Object.values(priceGroups)) {
    const market = toNumber(group?.market);
    if (market && market > 0) return market;
    const mid = toNumber(group?.mid);
    if (mid && mid > 0) return mid;
  }

  return null;
};

// --- Utils de Arrays (Aleatoriedad) ---

export const mezclarArreglo = (arreglo) => {
  const copia = arreglo.slice();
  for (let index = copia.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copia[index], copia[swapIndex]] = [copia[swapIndex], copia[index]];
  }
  return copia;
};

export const elegirSubconjuntoAleatorio = (cards, amount, exclusionSet = new Set()) => {
  const pool = cards.filter((card) => !exclusionSet.has(card?.id));
  const workingPool = pool.length ? pool : cards.slice();
  if (!workingPool.length) return [];

  const shuffled = mezclarArreglo(workingPool);
  const limit = Math.min(amount, shuffled.length);
  return shuffled.slice(0, limit);
};

export const filtrarCartas = (cartas, termino) => {
  if (!termino) return cartas;
  const loweredTerm = termino.toLowerCase();
  return cartas.filter((card) => {
    const nameMatch = card?.name?.toLowerCase().includes(loweredTerm);
    const idMatch = card?.id?.toLowerCase().includes(loweredTerm);
    return nameMatch || idMatch;
  });
};

export const safeParseCart = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && typeof entry.id === 'string');
  } catch (error) {
    console.warn('No se pudo interpretar el carrito guardado', error);
    return [];
  }
};