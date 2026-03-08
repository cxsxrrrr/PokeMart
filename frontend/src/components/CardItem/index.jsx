import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CONSTANTS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import './CardItem.css';

const CardItem = ({ card, basePrice, discountRate, ctaLabel, onAdd }) => {
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const timeoutRef = useRef(null);

  const mockData = useMemo(() => {
    const seed = card.id ? card.id.charCodeAt(0) + card.id.charCodeAt(card.id.length - 1) : 50;
    const ratings = [4.5, 4.8, 4.9, 5.0, 4.7];
    const sellers = ["AshKetchum", "MistyWater", "BrockRock", "GaryOak", "RocketShop", "PokeFan99"];
    return {
      rating: ratings[seed % ratings.length],
      sellerName: sellers[seed % sellers.length],
      sellerAvatar: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(seed % 150) + 1}.png`
    };
  }, [card.id]);

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

  return (
    <div className="card-item relative poke-card-group group flex flex-col items-center bg-white dark:bg-[#17233f] border-2 border-gray-200 dark:border-[#233252] hover:border-violet-600 dark:hover:border-cyan-500 rounded-2xl p-4 min-h-[480px] h-full transition-all duration-300 hover:shadow-xl dark:hover:shadow-cyan-500/20">

      {/* BADGE DE DESCUENTO */}
      {discountRate ? (
        <div className="absolute -top-3 -left-3 
      bg-purple-400 text-slate-900 
      dark:bg-cyan-400 dark:text-cyan-900
      px-3 py-1 rounded-full font-extrabold text-sm z-50 border-2 border-slate-900 shadow-lg">
          -{Math.round(discountRate * 100)}%
        </div>
      ) : null}

      {/* CONTENEDOR DE IMAGEN 3D */}
      <div className="card-3d-wrapper">
        <div className="card-3d-flip">
          <div className="card-3d-face card-3d-front">
            <img src={frontSrc} alt={card?.name} loading="lazy" onError={advanceImageCandidate} />
          </div>
          <div className="card-3d-face card-3d-back">
            <img src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg" alt="Reverso" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DE LA CARTA */}
      <div className="flex flex-col flex-1 w-full z-20">
        <h3 className="text-center font-bold text-lg mb-3 text-gray-800 dark:text-gray-100 truncate px-1">
          {card.name}
        </h3>

        {/* AGREGAMOS */}
        <div className="flex flex-row items-center justify-between mb-3 pl-2 pr-1">
          <div className="flex flex-col justify-center">
            {displayedPrice && basePrice && discountRate && (
              <span className="text-[0.75rem] line-through text-gray-400 font-medium leading-tight">
                {formatCurrency(basePrice)}
              </span>
            )}
            <span className="text-xl font-black text-[color:dark-gray] dark:text-cyan-400 leading-none tracking-tight">
              {displayedPrice ? formatCurrency(displayedPrice) : "N/D"}
            </span>
          </div>

          {/* Badge de Rating */}
          <div className="flex items-center gap-1.5 bg-yellow-100 dark:bg-amber-500/10 px-2.5 py-1 rounded border border-yellow-200 dark:border-amber-500/30">
            <svg
              className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 dark:text-[#FFCC00] dark:fill-[#FFCC00]"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-[0.8rem] font-bold text-yellow-700 dark:text-[#FFCC00] leading-none pt-[1px]">
              {mockData.rating}
            </span>
          </div>
        </div>

        {/* Línea divisora */}
        <hr className="w-full border-gray-200 dark:border-slate-700/50 my-3" />

        {/* Información del Vendedor */}
        <div className="flex items-center gap-2.5 mb-4">
          <img src={mockData.sellerAvatar} alt="avatar" className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 dark:border-slate-600 object-cover" />
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate">
            @{mockData.sellerName}
          </span>
        </div>

        {/* Botón*/}
        <button
          className="w-full mt-auto py-3 px-4 bg-violet-900 hover:bg-violet-500 dark:bg-cyan-600 dark:hover:bg-cyan-400
    text-white dark:text-slate-900
    rounded-xl font-bold transition-colors shadow-md"
          onClick={(e) => { e.preventDefault(); handleAdd(); }}
        >
          {added ? "Agregado" : ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default CardItem;