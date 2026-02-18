import React from 'react';
import CardItem from '../CardItem';
import { obtenerPrecioCarta } from '../../utils/formatters';

const DealsSection = ({ cards, status, statusMessage, onAdd }) => {
  return (
    <section className="deals-section py-16 bg-poke-light/50 dark:bg-content3 transition-colors duration-500 border-none shadow-none" id="deals">
      <div className="container mx-auto px-4">
        {/* Título con color adaptativo */}
        <h2 className="text-3xl font-bold mb-10 flex items-center justify-center gap-3 text-poke-darkBlue dark:text-white uppercase tracking-wider">
           {/* Icono ... */}
           <span className="dark:text-poke-yellow">Ofertas Relámpago</span>
        </h2>

        {/* Grid de cartas */}
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