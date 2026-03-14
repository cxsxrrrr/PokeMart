import { useMemo, useState, useEffect } from "react";
import CardItem from "../CardItem";
import { CONSTANTS } from "../../utils/constants";
import { 
  IconFilter, 
  IconSearch, 
  IconLayoutGrid, 
  IconAdjustmentsHorizontal,
  IconX,
  IconChevronRight,
  IconMoodEmpty
} from "@tabler/icons-react";
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Slider,
  Checkbox,
  ScrollShadow
} from "@heroui/react";

const API_BASE = CONSTANTS.API_BASE_URL || "http://localhost:8000";
const LISTINGS_URL = `${API_BASE}/store/listings/`;

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
  imageCandidates: listing.card?.image_url ? [listing.card.image_url] : [CONSTANTS.PLACEHOLDER_IMAGE],
  images: listing.card?.image_url ? { small: listing.card.image_url, large: listing.card.image_url } : null,
});

const FilterSidebar = ({ 
  query, 
  setQuery, 
  usePriceFilter, 
  setUsePriceFilter, 
  priceRange, 
  setPriceRange, 
  conditionFilter, 
  setConditionFilter, 
  rarityFilter, 
  setRarityFilter, 
  uniqueRarities,
  clearFilters 
}) => (
  <div className="flex flex-col gap-8">
    <div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Filtros Avanzados</h3>
      <Input
        placeholder="Buscar cartas..."
        variant="flat"
        startContent={<IconSearch size={18} className="text-slate-400" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        classNames={{ 
          inputWrapper: "bg-slate-100 dark:bg-slate-800 rounded-xl transition-all shadow-none after:hidden before:hidden border-none group-data-[focus=true]:bg-slate-200 dark:group-data-[focus=true]:bg-slate-700",
          input: "placeholder:text-slate-400 !outline-none !ring-0 focus:!ring-0"
        }}
      />
    </div>

    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Rango de Precio</h3>
        <Checkbox 
          size="sm" 
          color="secondary" 
          isSelected={usePriceFilter} 
          onValueChange={setUsePriceFilter}
        >
          Activar
        </Checkbox>
      </div>
      <div className={usePriceFilter ? "opacity-100" : "opacity-40 pointer-events-none"}>
        <Slider 
          step={10} 
          minValue={0} 
          maxValue={2000} 
          value={priceRange} 
          onChange={setPriceRange}
          formatOptions={{style: "currency", currency: "USD"}}
          className="max-w-md"
          color="secondary"
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Condición</h3>
      <div className="flex flex-col gap-2">
        {["Full Art", "Mint", "Near Mint", "Excellent", "Good", "Lightly Played"].map(cond => (
          <button
            key={cond}
            onClick={() => setConditionFilter(conditionFilter === cond ? "" : cond)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
              conditionFilter === cond 
                ? "bg-violet-600 text-white font-bold" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cond}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Rareza</h3>
      <Select 
        placeholder="Seleccionar rareza" 
        variant="flat"
        selectedKeys={rarityFilter ? [rarityFilter] : []}
        onSelectionChange={(keys) => setRarityFilter(Array.from(keys)[0])}
        classNames={{ trigger: "bg-slate-100 dark:bg-slate-800 rounded-xl" }}
      >
        {uniqueRarities.map(r => <SelectItem key={r} textValue={r}>{r}</SelectItem>)}
      </Select>
    </div>

    <Button 
      variant="light" 
      color="danger" 
      size="sm" 
      onClick={clearFilters}
      startContent={<IconX size={16} />}
    >
      Limpiar Filtros
    </Button>
  </div>
);

const Catalog = ({ onAdd }) => {
  const [listings, setListings] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [usePriceFilter, setUsePriceFilter] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await fetch(LISTINGS_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const normalized = Array.isArray(data) ? data.map(normalizeListing) : [];
        setListings(normalized);
        setFetchStatus(normalized.length ? "ready" : "empty");
      } catch (err) {
        console.error(err);
        setFetchStatus("error");
      }
    };
    loadListings();
  }, []);

  const uniqueRarities = useMemo(() => [...new Set(listings.map(l => l.rarity))].filter(Boolean), [listings]);

  const filteredCards = useMemo(() => {
    const q = query.toLowerCase();
    return listings.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.seller.toLowerCase().includes(q);
      const matchesCondition = !conditionFilter || c.condition === conditionFilter;
      const matchesRarity = !rarityFilter || c.rarity === rarityFilter;
      const matchesPrice = !usePriceFilter || (c.price >= priceRange[0] && c.price <= priceRange[1]);
      return matchesQuery && matchesCondition && matchesRarity && matchesPrice;
    });
  }, [listings, query, conditionFilter, rarityFilter, priceRange, usePriceFilter]);

  const clearFilters = () => {
    setQuery("");
    setConditionFilter("");
    setRarityFilter("");
    setPriceRange([0, 1000]);
    setUsePriceFilter(false);
  };

  const sidebarProps = {
    query, setQuery,
    usePriceFilter, setUsePriceFilter,
    priceRange, setPriceRange,
    conditionFilter, setConditionFilter,
    rarityFilter, setRarityFilter,
    uniqueRarities, clearFilters
  };

  return (
    <div className="container mx-auto px-4 min-h-[90vh]">
      <div className="flex flex-col lg:flex-row gap-8 pt-6">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-hide">
            <FilterSidebar {...sidebarProps} />
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1">
          {/* Header & Mobile Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black dark:text-white flex items-center gap-2">
                <IconLayoutGrid className="text-violet-600 dark:text-cyan-400" />
                Catálogo de Cartas
              </h1>
              <p className="text-sm text-slate-500 font-medium">Explora {filteredCards.length} objetos disponibles</p>
            </div>
            
            <Button 
              className="lg:hidden bg-violet-600 text-white font-bold rounded-xl"
              startContent={<IconFilter size={18} />}
              onClick={() => setShowMobileFilters(true)}
            >
              Filtros
            </Button>
          </div>

          {/* Cards Grid */}
          {fetchStatus === "loading" ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
               ))}
             </div>
          ) : filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  basePrice={card.price}
                  onAdd={onAdd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
               <IconMoodEmpty className="mx-auto text-slate-300 mb-4" size={64} />
               <h2 className="text-xl font-bold dark:text-white">No encontramos lo que buscas</h2>
               <p className="text-slate-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-[#0b1021] p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black dark:text-white">Filtros</h2>
              <Button isIconOnly variant="flat" onClick={() => setShowMobileFilters(false)}><IconX /></Button>
            </div>
            <ScrollShadow className="h-[calc(100vh-120px)]">
              <FilterSidebar {...sidebarProps} />
            </ScrollShadow>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;