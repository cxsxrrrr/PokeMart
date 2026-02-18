import { useRef, useEffect, useState } from 'react';
import CardItem from '../CardItem';
import { obtenerPrecioCarta } from '../../utils/formatters';

const PopularCarousel = ({ cards, status, onAdd, isMobile, statusMessage }) => {
  const containerRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0); // Estado React para el índice
  const MAX_VISIBLE_Items = 5;

  const moveCarousel = (direction) => {
    if (isMobile || status !== "ready" || cards.length <= 1) return;
    setCarouselIndex(prev => {
        const total = cards.length;
        return (prev + direction + total) % total;
    });
  };

  // Efecto para actualizar estilos visuales cuando el índice cambia
  useEffect(() => {
    if (!containerRef.current || isMobile || status !== 'ready') return;
    
    // Aquí implementamos la lógica de renderizado visual manual del "script vanilla"
    const cardElements = Array.from(containerRef.current.querySelectorAll('.card-item'));
    const total = cardElements.length;
    if (!total) return;

    const visibleWindow = Math.min(MAX_VISIBLE_Items, total);
    const threshold = Math.floor(visibleWindow / 2);

    cardElements.forEach((card, idx) => {
        const rawOffset = idx - carouselIndex;
        let offset = rawOffset;

        // Circularidad
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const absOffset = Math.abs(offset);
        const hidden = absOffset > threshold && total > visibleWindow;

        if (hidden) {
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
            card.style.transform = `translateX(-50%) translateZ(-800px) scale(0)`;
        } else {
            const translateX = offset * 12; // 12rem
            const translateZ = -Math.min(absOffset * 160, 720);
            const rotateY = offset * -12;
            const scale = Math.max(0.6, 1 - absOffset * 0.15);
            
            card.style.opacity = "1";
            card.style.zIndex = String(100 - absOffset * 10);
            card.style.pointerEvents = absOffset === 0 ? "auto" : "none";
            card.style.transform = `translateX(-50%) translateX(${translateX}rem) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            
            // Clase para debugging o estilos extra
            if (offset === 0) card.classList.add('is-center');
            else card.classList.remove('is-center');
        }
    });

  }, [carouselIndex, cards, status, isMobile]);

  return (
    <section className="popular-section container" id="popular">
      <h2 className="section-title text-poke-darkBlue dark:text-white transition-colors duration-300">
        <img src="/assets/Charizard.svg" alt="Charizard" className="section-title__icon" onError={(e) => e.target.style.display='none'} />
        <span>Populares esta semana</span>
      </h2>

      <div className="carousel-shell">
        <button
            className="carousel-nav carousel-nav--prev"
            onClick={() => moveCarousel(-1)}
            disabled={isMobile || cards.length <= 1}
        >&lt;</button>

        <div className="carousel-window">
          <div className="carousel-track" ref={containerRef}>
            {status === "loading" && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-item skeleton-card carousel-item">
                    <div className="skeleton skeleton-img"/>
                    <div className="skeleton skeleton-text"/>
                </div>
            ))}

            {(status === "error" || status === "empty") && (
                <div className="status-message">{statusMessage || "No hay cartas populares."}</div>
            )}

            {status === "ready" && cards.map((card) => (
                <CardItem
                    key={card.id}
                    card={card}
                    basePrice={obtenerPrecioCarta(card)}
                    ctaLabel="Añadir"
                    onAdd={onAdd}
                    isCarousel={true} // Importante para el CSS base
                />
            ))}
          </div>
        </div>

        <button
            className="carousel-nav carousel-nav--next"
            onClick={() => moveCarousel(1)}
            disabled={isMobile || cards.length <= 1}
        >&gt;</button>
      </div>
    </section>
  );
};

export default PopularCarousel;