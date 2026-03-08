import { useMemo, useState, useEffect } from "react";
import CardItem from "../CardItem";
import { CONSTANTS } from "../../utils/constants";

const API_BASE = CONSTANTS.API_BASE_URL || "http://localhost:8000";
const LISTINGS_URL = `${API_BASE}/store/listings/`;

// Adapta un listing del backend al formato que entiende CardItem
const normalizeListing = (listing) => ({
  id: `listing-${listing.id}`,
  listingId: listing.id,
  name: listing.card?.name ?? "Sin nombre",
  rarity: listing.card?.rarity ?? "Rare",
  set: { name: listing.card?.collection ?? "Colección" },
  price: parseFloat(listing.price) || 0,
  quantity: listing.quantity,
  condition: listing.condition,
  seller: listing.seller?.username ?? "Vendedor",
  description: listing.description ?? "",
  image_url: listing.card?.image_url ?? "",
  imageCandidates: listing.card?.image_url
    ? [listing.card.image_url]
    : [CONSTANTS.PLACEHOLDER_IMAGE],
  images: listing.card?.image_url
    ? { small: listing.card.image_url, large: listing.card.image_url }
    : null,
});

const Catalog = ({ onAdd }) => {
  const [listings, setListings] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [fetchError, setFetchError] = useState("");
  const [query, setQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadListings = async () => {
      setFetchStatus("loading");
      try {
        const response = await fetch(LISTINGS_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (cancelled) return;

        const normalized = Array.isArray(data) ? data.map(normalizeListing) : [];
        setListings(normalized);
        setFetchStatus(normalized.length ? "ready" : "empty");
        setFetchError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Error cargando listings del backend:", err);
        setFetchStatus("error");
        setFetchError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
      }
    };

    loadListings();
    return () => { cancelled = true; };
  }, []);

  const uniqueConditions = useMemo(() => {
    return Array.from(new Set(listings.map(l => l.condition).filter(Boolean)));
  }, [listings]);

  const uniqueRarities = useMemo(() => {
    return Array.from(new Set(listings.map(l => l.rarity).filter(Boolean)));
  }, [listings]);

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((c) => {
      const matchesQuery = !q || (c.name ?? "").toLowerCase().includes(q) || (c.seller ?? "").toLowerCase().includes(q);
      const matchesCondition = !conditionFilter || c.condition === conditionFilter;
      const matchesRarity = !rarityFilter || c.rarity === rarityFilter;
      return matchesQuery && matchesCondition && matchesRarity;
    });
  }, [listings, query, conditionFilter, rarityFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };


  const isEmpty = fetchStatus === "ready" && filteredCards.length === 0;

  return (
    <main className="popular-section py-16">
      <div className="container mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3 text-poke-darkBlue dark:text-white uppercase tracking-wider">
            <span className="dark:text-poke-yellow">Catálogo</span>
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center mt-6 w-full max-w-2xl mx-auto"
          >
            <div className="search-bar w-full" style={{ marginTop: 0 }}>
              <input
                type="text"
                autoComplete="off"
                name="catalog-search"
                className="input"
                placeholder="Buscar por nombre o vendedor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="search-btn neu-button" type="submit">
                Buscar
              </button>
            </div>

            {listings.length > 0 && (
              <div className="flex gap-4 w-full justify-center flex-wrap">
                <select 
                  className="input px-4 py-2 bg-white/70 dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded-xl max-w-xs cursor-pointer text-sm dark:text-white"
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                >
                  <option value="">Cualquier Condición</option>
                  {uniqueConditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select 
                  className="input px-4 py-2 bg-white/70 dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded-xl max-w-xs cursor-pointer text-sm dark:text-white"
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                >
                  <option value="">Cualquier Rareza</option>
                  {uniqueRarities.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
          </form>
        </header>

        {fetchStatus === "loading" && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Cargando listings del servidor...
          </p>
        )}

        {fetchStatus === "error" && (
          <p className="status-message error" style={{ textAlign: "center", color: "#dc2626" }}>
            {fetchError}
          </p>
        )}

        {fetchStatus === "empty" && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            No hay listings disponibles en este momento.
          </p>
        )}

        {fetchStatus === "ready" && (
          <section className="deals-grid" aria-label="Resultados del catálogo">
            {filteredCards.map((card) => {
              const hasImages = Boolean(card.images?.small || card.images?.large);

              if (hasImages) {
                return (
                  <CardItem
                    key={card.id}
                    card={card}
                    basePrice={card.price}
                    onAdd={onAdd}
                  />
                );
              }

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
                  <h3 style={{ margin: 0, fontWeight: 800 }}>{card.name}</h3>
                  <p style={{ margin: "6px 0 0", color: "#475569" }}>
                    Vendedor: <strong>{card.seller}</strong>
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#475569" }}>
                    Condición: <strong>{card.condition}</strong>
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#475569" }}>
                    Rareza: <strong>{card.rarity}</strong>
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#1d4ed8", fontWeight: 700 }}>
                    ${card.price.toFixed(2)}
                  </p>
                  {card.description && (
                    <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                      {card.description}
                    </p>
                  )}
                  <button
                    type="button"
                    className="neu-button"
                    style={{ marginTop: 10, width: "100%" }}
                    onClick={() => onAdd && onAdd(card, card.price)}
                  >
                    Añadir al carrito
                  </button>
                </article>
              );
            })}
          </section>
        )}

        {fetchStatus === "ready" && isEmpty && (
          <p className="status-message" style={{ textAlign: "center", padding: "2rem" }}>
            Sin resultados para "{query}".
          </p>
        )}
      </div>
    </main>
  );
};

export default Catalog;