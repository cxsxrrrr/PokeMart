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
      className={`card-item${isCarousel ? " carousel-item" : ""}`}
      data-hidden="false"
      data-card-id={card?.id}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        setRotation((prev) => prev + 180);
      }}
    >
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
      <div className="card-info">
        <h3>{card?.name || "Carta Pokémon"}</h3>
        <div className="card-set">
          <span className="rarity-icon">{raritySymbols[rarity] || "★"}</span>
          {card?.set?.name || "Colección local"}
        </div>
        <div className="card-price">
          {displayedPrice ? formatCurrency(displayedPrice) : "N/D"}
          {displayedPrice && basePrice && discountRate && (
            <span className="old-price">{formatCurrency(basePrice)}</span>
          )}
        </div>
        <button
          className={`add-to-cart${added ? " add-to-cart--added" : ""}`}
          onClick={(e) => { e.preventDefault(); handleAdd(); }}
        >
          {added ? "Agregado ✓" : ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default CardItem;