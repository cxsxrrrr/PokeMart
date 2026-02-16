import { useRef, useEffect } from 'react';
import CardItem from '../CardItem';
import { obtenerPrecioCarta } from '../../utils/formatters';

const PopularCarousel = ({ cards, status, onAdd, isMobile, statusMessage }) => {
  const containerRef = useRef(null);
  const carouselIndexRef = useRef(0);
  const MAX_VISIBLE_ITEMS = 5; // Configurable o importado de constantes

  const moveCarousel = (direction) => {
    if (isMobile || status !== "ready") return;
    const total = cards.length;
    if (total <= 1) return;

    // Actualizar índice circularmente
    carouselIndexRef.current = (carouselIndexRef.current + direction + total) % total;

    if (containerRef.current) {
       requestAnimationFrame(updateCarouselVisuals);
    }
  };

  const updateCarouselVisuals = () => {
      if (!containerRef.current) return;

      // Seleccionar solo los elementos que son cartas (ignorar esqueletos si es necesario)
      const cardElements = Array.from(containerRef.current.querySelectorAll(".card-item"));
      const total = cardElements.length;
      if (!total) return;

      const visibleWindow = Math.min(MAX_VISIBLE_ITEMS, total);
      const threshold = Math.floor(visibleWindow / 2);
      const currentIndex = carouselIndexRef.current % total;

      cardElements.forEach((card, idx) => {
        // Calcular la distancia relativa circular
        const rawOffset = idx - currentIndex;
        let offset = rawOffset;

        // Ajuste para circularidad infinita
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const absOffset = Math.abs(offset);
        const hidden = absOffset > threshold && total > visibleWindow;

        // Aplicar estilos 3D
        if (hidden) {
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
            card.style.transform = `translateX(-50%) translateZ(-800px) scale(0)`;
        } else {
            const translateX = offset * 12; // 12rem de separación
            const translateZ = -Math.min(absOffset * 160, 720);
            const rotateY = offset * -12; // Rotación suave
            const scale = Math.max(0.6, 1 - absOffset * 0.15);

            card.style.opacity = "1";
            card.style.zIndex = String(100 - absOffset * 10);
            card.style.pointerEvents = absOffset === 0 ? "auto" : "none"; // Solo el central es clickeable completamente
            card.style.transform =
                `translateX(-50%) translateX(${translateX}rem) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        }
      });
  };

  // Efecto para inicializar y actualizar cuando cambian las cartas
  useEffect(() => {
     if (status === "ready" && !isMobile) {
         // Pequeño timeout para asegurar que el DOM se pintó
         setTimeout(updateCarouselVisuals, 50);
     }
  }, [cards, status, isMobile]);

  return (
    <section className="popular-section container" id="popular">
      <h2 className="section-title">
        <img src="/assets/Charizard.svg" alt="Charizard" className="section-title__icon" onError={(e) => e.target.style.display='none'} />
        <span>Populares esta semana</span>
      </h2>

      <div className="carousel-shell">
        <button
            className="carousel-nav carousel-nav--prev"
            onClick={() => moveCarousel(-1)}
            disabled={isMobile || cards.length <= 1}
            aria-label="Anterior"
        >&lt;</button>

        <div className="carousel-window">
          <div className="carousel-track" ref={containerRef}>
            {/* Estado de carga - Esqueletos */}
            {status === "loading" && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-item skeleton-card carousel-item">
                    <div className="skeleton skeleton-img"/>
                    <div className="skeleton skeleton-text"/>
                </div>
            ))}

            {/* Estado vacío o error */}
            {(status === "error" || status === "empty") && (
                <div className="status-message">{statusMessage || "No hay cartas populares."}</div>
            )}

            {/* Cartas reales */}
            {status === "ready" && cards.map((card) => (
                <CardItem
                    key={card.id}
                    card={card}
                    basePrice={obtenerPrecioCarta(card)}
                    ctaLabel="Añadir"
                    onAdd={onAdd}
                    isCarousel={true}
                />
            ))}
          </div>
        </div>

        <button
            className="carousel-nav carousel-nav--next"
            onClick={() => moveCarousel(1)}
            disabled={isMobile || cards.length <= 1}
            aria-label="Siguiente"
        >&gt;</button>
      </div>
    </section>
  );
};

export default PopularCarousel;