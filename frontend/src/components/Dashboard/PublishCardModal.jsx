import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconSearch,
  IconX,
  IconLoader2,
  IconCircleCheck,
  IconPlus,
  IconCards,
  IconCoin,
  IconPackage,
} from "@tabler/icons-react";
import { listingService } from "../../services/listing.service";
import { useToast } from "../../providers/ToastProvider";

const CONDITION_OPTIONS = [
  "Graded 10",
  "Graded 9",
  "Graded 8",
  "Near Mint",
  "Lightly Played",
  "Played",
  "Heavily Played",
  "Damaged",
];

const PLATFORM_FEE_RATE = 0.15;

export default function PublishCardModal({ isOpen, onClose, onCreated }) {
  const modalRef = useRef(null);
  const resultsRef = useRef(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);
  const cacheRef = useRef(new Map());
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);

  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [condition, setCondition] = useState("Near Mint");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const estimatedPayout = useMemo(() => {
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return null;
    }
    return (parsedPrice * (1 - PLATFORM_FEE_RATE)).toFixed(2);
  }, [price]);

  const isFormValid = useMemo(() => {
    const p = Number(price);
    const q = Number(quantity);
    return !!selectedCard && Number.isFinite(p) && p > 0 && Number.isInteger(q) && q > 0 && !!condition;
  }, [selectedCard, price, quantity, condition]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const onOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", onOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("mousedown", onOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Start each publish flow with a clean state to avoid carrying previous values.
    setQuery("");
    setResults([]);
    setSelectedCard(null);
    setPrice("");
    setQuantity("1");
    setCondition("Near Mint");
    setDescription("");
    setSearching(false);
    setLoadingMore(false);
    setHasMore(false);
    setPage(1);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      setResults([]);
      setHasMore(false);
      setPage(1);
      setSearching(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (cacheRef.current.has(normalized)) {
        const cached = cacheRef.current.get(normalized);
        setResults(cached.results);
        setHasMore(cached.hasMore);
        setPage(1);
        return;
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setSearching(true);

      try {
        const data = await listingService.searchCards(normalized, {
          page: 1,
          pageSize: 40,
          signal: controller.signal,
        });
        cacheRef.current.set(normalized, {
          results: data.results,
          hasMore: data.has_more,
        });
        setResults(data.results);
        setHasMore(data.has_more);
        setPage(1);
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast(error.message || "Error buscando cartas", "error");
        }
      } finally {
        setSearching(false);
      }
    }, 180);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, isOpen, showToast]);

  const loadMore = async () => {
    if (loadingMore || searching || !hasMore) {
      return;
    }

    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const data = await listingService.searchCards(normalized, {
        page: nextPage,
        pageSize: 40,
        signal: controller.signal,
      });

      setResults((prev) => {
        const merged = [...prev, ...data.results];
        const dedup = Array.from(new Map(merged.map((item) => [item.id, item])).values());
        return dedup;
      });
      setHasMore(data.has_more);
      setPage(nextPage);
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast(error.message || "Error cargando más cartas", "error");
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleResultsScroll = (e) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceToBottom < 140) {
      loadMore();
    }
  };

  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setQuery(card.name);
    setPrice(card.recommended_price || "");
    setDescription("");
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      await listingService.createListing({
        cardId: selectedCard.id,
        price: Number(price),
        quantity: Number(quantity),
        condition,
        description,
      });

      showToast("Listing publicado correctamente", "success");
      onCreated?.();
      onClose();
    } catch (error) {
      showToast(error.message || "No se pudo publicar la carta", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2500] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={modalRef}
        className="relative my-3 sm:my-0 w-full max-w-6xl max-h-[92dvh] bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto lg:overflow-hidden"
      >
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar"
        >
          <IconX size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] h-auto lg:h-full">
          <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 min-h-0 lg:min-h-[420px]">
            <div className="mb-5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Publicar Carta</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Busca entre miles de cartas y selecciona la que quieres listar.
              </p>
            </div>

            <div className="relative mb-4">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedCard && e.target.value.trim().toLowerCase() !== selectedCard.name.toLowerCase()) {
                    setSelectedCard(null);
                  }
                }}
                placeholder="Buscar por nombre de carta..."
                className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {searching && <IconLoader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="grid grid-cols-[72px_1fr_120px] gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span>Imagen</span>
                <span>Carta</span>
                <span>Precio ref.</span>
              </div>

              <div ref={resultsRef} onScroll={handleResultsScroll} className="max-h-[30vh] sm:max-h-[44vh] overflow-y-auto">
                {query.trim().length < 2 ? (
                  <div className="px-4 py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
                    Escribe al menos 2 letras para buscar.
                  </div>
                ) : results.length === 0 && !searching ? (
                  <div className="px-4 py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No se encontraron cartas para esa búsqueda.
                  </div>
                ) : (
                  results.map((card) => {
                    const selected = selectedCard?.id === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectCard(card)}
                        className={`w-full grid grid-cols-[72px_1fr_120px] gap-3 px-4 py-3 items-center text-left border-t border-slate-100 dark:border-slate-800 transition-colors ${selected ? "bg-violet-50 dark:bg-violet-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-900/40"}`}
                      >
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                          onError={(e) => {
                            e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{card.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{card.collection} · {card.rarity}</p>
                        </div>
                        <p className="font-bold text-violet-700 dark:text-cyan-300">${card.recommended_price}</p>
                      </button>
                    );
                  })
                )}

                {loadingMore && (
                  <div className="px-4 py-4 text-center text-slate-500 dark:text-slate-400 text-sm inline-flex items-center justify-center gap-2 w-full">
                    <IconLoader2 size={16} className="animate-spin" /> Cargando más cartas...
                  </div>
                )}

                {!loadingMore && hasMore && results.length > 0 && (
                  <div className="px-4 py-3 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Desliza hacia abajo para cargar más resultados
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateListing} className="p-5 sm:p-7 bg-slate-50 dark:bg-slate-900/40 overflow-visible lg:overflow-y-auto">
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4">Detalles del Listing</h4>

            <div className="space-y-4">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Carta seleccionada</p>
                {selectedCard ? (
                  <div className="flex items-center gap-3">
                    <IconCards size={18} className="text-violet-600 dark:text-cyan-300" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{selectedCard.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCard.collection} · {selectedCard.rarity}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Selecciona una carta desde la búsqueda.</p>
                )}
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 inline-flex items-center gap-2"><IconCoin size={16} /> Precio</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Ej. 19.99"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 inline-flex items-center gap-2"><IconPackage size={16} /> Cantidad</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 inline-flex items-center gap-2">Condición</span>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {CONDITION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 inline-flex items-center gap-2">Descripción</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={350}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  placeholder="Detalles opcionales del estado de la carta..."
                />
              </label>

              <button
                type="submit"
                disabled={!isFormValid || submitting}
                className="w-full h-12 rounded-xl font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? <IconLoader2 size={18} className="animate-spin" /> : <IconPlus size={18} />}
                {submitting ? "Publicando..." : "Crear Listing"}
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {selectedCard ? "Se publicará como estado Available para aparecer en el catálogo." : "Selecciona una carta para habilitar publicación."}
              </p>

              <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/15">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Al vender esta carta, la plataforma retiene un 15% de comisión.
                </p>
                {estimatedPayout && (
                  <p className="text-xs mt-1 text-amber-700 dark:text-amber-200">
                    Ganancia estimada para ti: <span className="font-bold">${estimatedPayout}</span>
                  </p>
                )}
              </div>

              {isFormValid && !submitting && (
                <div className="text-emerald-700 dark:text-emerald-300 text-xs font-bold inline-flex items-center gap-1">
                  <IconCircleCheck size={14} /> Listo para publicar
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
