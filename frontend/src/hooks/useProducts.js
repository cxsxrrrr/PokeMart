import { useState, useRef, useCallback, useEffect } from 'react';
import { CONSTANTS } from '../utils/constants';
import { normalizeCard, filtrarCartas, elegirSubconjuntoAleatorio } from '../utils/formatters';

const API_BASE = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
const LISTINGS_URL = `${API_BASE}/store/listings/`;

// Adapta un listing del backend al formato que entiende CardItem/Home
const normalizeListing = (listing) => ({
    id: `listing-${listing.id}`,
    listingId: listing.id,
    name: listing.card?.name ?? 'Sin nombre',
    rarity: listing.card?.rarity ?? 'Rare',
    set: { name: listing.card?.collection ?? 'Colección' },
    price: parseFloat(listing.price) || 0,
    quantity: listing.quantity,
    condition: listing.condition,
    seller: listing.seller?.username ?? 'Vendedor',
    description: listing.description ?? '',
    image_url: listing.card?.image_url ?? '',
    imageCandidates: listing.card?.image_url
        ? [listing.card.image_url]
        : [CONSTANTS.PLACEHOLDER_IMAGE],
    images: listing.card?.image_url
        ? { small: listing.card.image_url, large: listing.card.image_url }
        : null,
});

export const useProducts = () => {
    const [popularCards, setPopularCards] = useState([]);
    const [dealCards, setDealCards] = useState([]);
    const [catalogCards, setCatalogCards] = useState([]);
    const [status, setStatus] = useState("loading");
    const [statusMessage, setStatusMessage] = useState("");

    const listingsRef = useRef([]);
    const fetchPromiseRef = useRef(null);
    const lastQueryRef = useRef("");
    const statusRef = useRef(status);

    statusRef.current = status;

    const ensureListings = useCallback(async () => {
        if (listingsRef.current.length) {
            return listingsRef.current;
        }

        if (!fetchPromiseRef.current) {
            fetchPromiseRef.current = fetch(LISTINGS_URL, { cache: "no-store" })
                .then(async (response) => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    const listings = Array.isArray(data) ? data.map(normalizeListing) : [];

                    if (listings.length > 0) {
                        listingsRef.current = listings;
                        return listings;
                    }

                    // Fallback al JSON local si no hay listings
                    throw new Error("No hay listings en el backend");
                })
                .catch(async (error) => {
                    console.warn("Backend no disponible o vacío, usando JSON local:", error.message);
                    fetchPromiseRef.current = null;

                    // Fallback al JSON local
                    const fallbackResponse = await fetch(CONSTANTS.DATA_URL, { cache: "no-store" });
                    if (!fallbackResponse.ok) throw new Error("No se pudo cargar el catálogo local");
                    const payload = await fallbackResponse.json();
                    const cards = Array.isArray(payload?.data) ? payload.data : [];
                    listingsRef.current = cards.map(normalizeCard);
                    return listingsRef.current;
                });
        }

        return fetchPromiseRef.current;
    }, []);

    const aplicarSelecciones = useCallback((sourceCards) => {
        setCatalogCards(sourceCards);

        if (!sourceCards.length) {
            setPopularCards([]);
            setDealCards([]);
            setStatus("empty");
            setStatusMessage("No se encontraron cartas.");
            return;
        }

        const popular = elegirSubconjuntoAleatorio(sourceCards, CONSTANTS.POPULAR_COUNT);
        const exclusion = new Set(popular.map(c => c.id));
        const deals = elegirSubconjuntoAleatorio(sourceCards, CONSTANTS.DEALS_COUNT, exclusion);

        setPopularCards(popular);
        setDealCards(deals);
        setStatus("ready");
        setStatusMessage("");
    }, []);

    const loadCards = useCallback(async (termino = "") => {
        const normalizedTerm = termino.trim();
        if (normalizedTerm === lastQueryRef.current && statusRef.current === "ready") return;

        lastQueryRef.current = normalizedTerm;
        setStatus("loading");

        try {
            const cards = await ensureListings();
            const filtered = filtrarCartas(cards, normalizedTerm);
            aplicarSelecciones(filtered);
        } catch (error) {
            console.error(error);
            setStatus("error");
            setStatusMessage("Error cargando catálogo.");
        }
    }, [ensureListings, aplicarSelecciones]);

    useEffect(() => {
        loadCards("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { popularCards, dealCards, catalogCards, status, statusMessage, loadCards };
};
