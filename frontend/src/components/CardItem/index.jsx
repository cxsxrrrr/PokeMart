import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CONSTANTS, raritySymbols } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const CardItem = ({ card, basePrice, discountRate, ctaLabel, onAdd, isCarousel }) => {
  const [rotation, setRotation] = useState(0);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const timeoutRef = useRef(null);

  const imageCandidates = useMemo(() => {
    if (Array.isArray(card?.imageCandidates) && card.imageCandidates.length) {
      return card.imageCandidates;
    }
    return [CONSTANTS.PLACEHOLDER_IMAGE];
  }, [card]);

  const displayedPrice = useMemo(() => {
    if (basePrice && discountRate) return basePrice * (1 - discountRate);
    return basePrice;
  }, [basePrice, discountRate]);

  const handleAdd = () => {
    onAdd(card, displayedPrice || basePrice || 0);
    setAdded(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setAdded(false), 1800);
  };

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const advanceImageCandidate = useCallback(() => {
    setImageIndex((prev) => Math.min(prev + 1, imageCandidates.length - 1));
  }, [imageCandidates.length]);

  const frontSrc = imageCandidates[Math.min(imageIndex, imageCandidates.length - 1)] || CONSTANTS.PLACEHOLDER_IMAGE;
  const rarity = card?.rarity || "Rare";

  return (
    <div
      className={`
        card-item relative group rounded-xl p-4 transition-all duration-300
        bg-white dark:bg-content1
        shadow-lg hover:shadow-2xl hover:-translate-y-2
        border border-gray-100 dark:border-white/5
      `}
    >
      {/* Imagen */}
      <div className="card-img-container">
        <div className="card-img-flip" style={{ transform: `rotateY(${rotation}deg)` }}>
          <img
            className="card-img-face card-img-face--front"
            alt={card?.name}
            loading="lazy"
            src={frontSrc}
            onError={advanceImageCandidate}
          />
          <img
            className="card-img-face card-img-face--back"
            alt=""
            aria-hidden="true"
            src={CONSTANTS.CARD_BACK_IMAGE}
          />
        </div>
        {discountRate ? <div className="discount-badge">-{Math.round(discountRate * 100)}%</div> : null}
      </div>

      <div className="card-info mt-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
          {card.name}
        </h3>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {card.set?.name}
          </span>
          {/* Precio */}
          <span className="font-bold text-poke-darkBlue dark:text-poke-yellow text-lg">
            {displayedPrice ? formatCurrency(displayedPrice) : "N/D"}
            {displayedPrice && basePrice && discountRate && (
              <span className="old-price">{formatCurrency(basePrice)}</span>
            )}
          </span>
        </div>

        {/* Botón Añadir */}
        <button
          className="w-full mt-4 py-2 rounded-lg bg-poke-red text-white font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-500/20"
          onClick={(e) => { e.preventDefault(); handleAdd(); }}
        >
          {added ? "Agregado ✓" : ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default CardItem;