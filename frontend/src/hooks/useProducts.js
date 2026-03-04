import { useState, useRef, useCallback, useEffect } from 'react';
import { CONSTANTS } from '../utils/constants';
import { normalizeCard, filtrarCartas, elegirSubconjuntoAleatorio } from '../utils/formatters';

export const useProducts = () => {
    const [popularCards, setPopularCards] = useState([]);
    const [dealCards, setDealCards] = useState([]);
    const [catalogCards, setCatalogCards] = useState([]); // <-- NUEVO
    const [status, setStatus] = useState("loading");
    const [statusMessage, setStatusMessage] = useState("");

    const catalogRef = useRef([]);
    const catalogPromiseRef = useRef(null);
    const lastQueryRef = useRef("");

    const ensureCatalog = useCallback(async () => {
        if (catalogRef.current.length) {
            return catalogRef.current;
        }

        if (!catalogPromiseRef.current) {
            catalogPromiseRef.current = fetch(CONSTANTS.DATA_URL, { cache: "no-store" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("No se pudo cargar el catálogo local");
                    }
                    return response.json();
                })
                .then((payload) => {
                    const cards = Array.isArray(payload?.data) ? payload.data : [];
                    catalogRef.current = cards.map(normalizeCard);
                    return catalogRef.current;
                })
                .catch((error) => {
                    catalogPromiseRef.current = null;
                    throw error;
                });
        }

        return catalogPromiseRef.current;
    }, []);

    const aplicarSelecciones = (sourceCards) => {
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
        setStatusMessage(""); // <-- limpia mensajes cuando hay data
    };

    const loadCards = useCallback(async (termino = "") => {
        const normalizedTerm = termino.trim();
        if (normalizedTerm === lastQueryRef.current && status === "ready") return;

        lastQueryRef.current = normalizedTerm;
        setStatus("loading");

        try {
            const cards = await ensureCatalog();
            const filtered = filtrarCartas(cards, normalizedTerm);
            aplicarSelecciones(filtered);
        } catch (error) {
            console.error(error);
            setStatus("error");
            setStatusMessage("Error cargando catálogo.");
        }
    }, [ensureCatalog, status]);

    useEffect(() => {
        loadCards("");
    }, [loadCards]);

    return { popularCards, dealCards, catalogCards, status, statusMessage, loadCards }; // <-- NUEVO
};