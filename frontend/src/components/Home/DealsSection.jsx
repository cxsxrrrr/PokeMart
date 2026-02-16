import CardItem from '../CardItem';
import { obtenerPrecioCarta } from '../../utils/formatters';

const DealsSection = ({ cards, status, statusMessage, onAdd }) => {
  return (
    <section className="deals-section" id="deals">
      <div className="container">
        <h2 className="section-title">
          <img src="/assets/Pikachu.svg" alt="Pikachu" className="section-title__icon section-title__icon--offset" />
          <span>Ofertas Relámpago</span>
        </h2>

        <div className="deals-grid" id="deal-cards">
          {status === "loading" && Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="card-item skeleton-card"><div className="skeleton skeleton-img"/></div>
          ))}

          {(status === "error" || status === "empty") && (
             <p className="status-message error">{statusMessage || "No hay ofertas."}</p>
          )}

          {status === "ready" && cards.map((card, index) => {
             const discounts = [0.15, 0.20, 0.25, 0.30];
             const discount = discounts[index % discounts.length];
             return (
               <CardItem
                 key={card.id}
                 card={card}
                 basePrice={obtenerPrecioCarta(card)}
                 discountRate={discount}
                 ctaLabel="¡Comprar oferta!"
                 onAdd={onAdd}
               />
             );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;