import { useMemo, useState } from "react";
import CardItem from "../CardItem";
import { obtenerPrecioCarta } from "../../utils/formatters";
import cardsJson from "../../data/cards.json";

const safeGetPrice = (card) => {
  try {
    return obtenerPrecioCarta(card);
  } catch {
    return null;
  }
};

const Catalog = ({
  cards = [],
  status = "ready",
  statusMessage = "",
  onAdd,
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  // Si la ruta/padre no pasa cards, usamos el JSON local
  const effectiveCards = useMemo(() => {
    if (Array.isArray(cards) && cards.length > 0) return cards;
    return Array.isArray(cardsJson?.data) ? cardsJson.data : [];
  }, [cards]);

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return effectiveCards;
    return effectiveCards.filter((c) => (c?.name ?? "").toLowerCase().includes(q));
  }, [effectiveCards, query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const isEmpty = status === "ready" && filteredCards.length === 0;

  return (
    <main className="popular-section py-16">
      <div className="container mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3 text-poke-darkBlue dark:text-white uppercase tracking-wider">
            <span className="dark:text-poke-yellow">Catálogo</span>
          </h1>

          <form
            onSubmit={handleSubmit}
            className="search-bar"
            style={{ marginTop: 18, justifyContent: "center" }}
          >
            <input
              type="text"
              autoComplete="off"
              name="catalog-search"
              className="input"
              placeholder="Buscar en el catálogo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn neu-button" type="submit">
              Buscar
            </button>
          </form>
        </header>

        {(status === "error" || status === "empty") && (
          <p className="status-message error">
            {statusMessage || "No hay cartas para mostrar."}
          </p>
        )}

        {status === "ready" && (
          <section className="deals-grid" aria-label="Resultados del catálogo">
            {filteredCards.map((card) => {
              const hasImages = Boolean(card?.images?.small || card?.images?.large);
              const price = safeGetPrice(card);

              // Si tu card viene “completa”, usa CardItem como en Home
              if (hasImages) {
                return (
                  <CardItem
                    key={card.id}
                    card={card}
                    basePrice={price ?? 0}
                    onAdd={onAdd}
                  />
                );
              }

              // Fallback para cards del JSON (id, name, rarity)
              return (
                <article
                  key={card.id}
                  className="card-item"
                  style={{
                    border: "1px solid rgba(148,163,184,0.35)",
                    borderRadius: 14,
                    padding: 14,
                    background: "#fff",
                  }}
                >
                  <h3 style={{ margin: 0, fontWeight: 800 }}>{card?.name}</h3>
                  <p style={{ margin: "6px 0 0", color: "#475569" }}>
                    Rareza: <strong>{card?.rarity ?? "—"}</strong>
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#475569" }}>
                    Precio: <strong>{price ?? "—"}</strong>
                  </p>
                  <button
                    type="button"
                    className="neu-button"
                    style={{ marginTop: 10, opacity: 0.7 }}
                    disabled
                    title="Para comprar, hace falta cargar datos completos (imagen/precio)"
                  >
                    Añadir
                  </button>
                </article>
              );
            })}
          </section>
        )}

        {status === "ready" && isEmpty && (
          <p className="status-message">
            Sin resultados para “{query}”.
          </p>
        )}
      </div>
    </main>
  );
};

export default Catalog;