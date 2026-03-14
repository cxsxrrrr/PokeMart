import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IconHistory, 
  IconSparkles, 
  IconTrendingUp, 
  IconLayoutGrid,
  IconClock,
  IconArrowRight,
  IconShoppingBag,
  IconPlus
} from "@tabler/icons-react";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Image, 
  Avatar, 
  ScrollShadow,
  Divider,
  Chip
} from "@heroui/react";
import { CONSTANTS } from "../../utils/constants";
import CardItem from "../CardItem";

const HomeFeed = ({ onAdd }) => {
  const navigate = useNavigate();
  const [feedData, setFeedData] = useState({
    recommendations: [],
    activity: [],
    new_arrivals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const urlBase = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${urlBase}/store/home-feed/`);
        if (!response.ok) throw new Error("Failed to fetch feed");
        const data = await response.json();
        setFeedData(data);
      } catch (err) {
        console.error("Error loading home feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-12">
              <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[2rem]" />
              <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-[2rem]" />
           </div>
           <div className="lg:col-span-4 h-[600px] bg-slate-100 dark:bg-slate-800 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Feed */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section: Recommendations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black dark:text-white flex items-center gap-2">
                Cartas Recomendadas
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {feedData.recommendations.map((item) => (
                <CardItem 
                  key={item.id} 
                  card={{
                    ...item,
                    imageCandidates: [item.card.image_url],
                    images: { small: item.card.image_url, large: item.card.image_url },
                    name: item.card.name,
                    set: { name: item.card.collection },
                    rarity: item.card.rarity
                  }} 
                  basePrice={parseFloat(item.price)}
                  onAdd={onAdd}
                />
              ))}
            </div>
          </section>

          {/* Section: New Arrivals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black dark:text-white flex items-center gap-2">
                Mira lo último publicado
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {feedData.new_arrivals.map((item) => (
                <Card 
                  key={item.id} 
                  isPressable 
                  className="bg-transparent shadow-none border-none overflow-visible group"
                  onClick={() => onAdd({
                    id: item.id,
                    name: item.card.name,
                    image: item.card.image_url,
                  }, parseFloat(item.price))}
                >
                  <CardBody className="p-0 relative overflow-visible">
                    <div className="relative z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-2">
                       <Image 
                        src={item.card.image_url} 
                        className="w-full aspect-[3/4] object-contain drop-shadow-md group-hover:drop-shadow-[0_20px_30px_rgba(34,211,238,0.3)] dark:group-hover:drop-shadow-[0_20px_30px_rgba(34,211,238,0.4)] transition-all"
                        removeWrapper
                      />
                      
                      {/* Price Tag Floating */}
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-cyan-400 px-2 py-1 rounded-lg text-[10px] font-black border border-white/10 z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        ${item.price}
                      </div>

                      {/* Rapid Add Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                         <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-pulse">
                            <IconPlus size={28} />
                         </div>
                      </div>
                    </div>

                    <div className="mt-3 px-1">
                      <p className="text-[11px] font-black dark:text-white truncate uppercase tracking-tighter opacity-80">{item.card.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-cyan-400/60 uppercase">Nueva Publicación</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Activity Feed */}
        <aside className="lg:col-span-4 sticky top-24">
          <Card className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl">
            <CardHeader className="p-6 pb-0 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 w-full">
                <div className="w-10 h-10 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-600">
                  <IconTrendingUp size={24} />
                </div>
                <h2 className="text-xl font-black dark:text-white">Actividades en Vivo</h2>
              </div>
              <p className="text-xs text-slate-500 font-bold ml-1">LO QUE ESTÁ PASANDO AHORA</p>
            </CardHeader>
            <CardBody className="p-0">
              <ScrollShadow 
                className="h-[550px] overflow-y-auto px-6 py-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="space-y-5">
                  {feedData.activity.filter(act => act.type === 'listing').map((act, i) => (
                    <div key={i} className="flex gap-4 items-center group p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <div className="relative flex-shrink-0">
                        <div className={`p-0.5 rounded-full border-2 ${act.type === 'listing' ? 'border-blue-500/30' : 'border-green-500/30'}`}>
                          <Avatar 
                            size="md" 
                            src={act.type === 'listing' ? act.image : `https://ui-avatars.com/api/?name=${act.user}&background=random`} 
                            className="w-12 h-12 text-tiny"
                            classNames={{
                              img: "object-contain p-1"
                            }}
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#111827] shadow-sm ${act.type === 'listing' ? 'bg-blue-500' : 'bg-green-500'}`}>
                           {act.type === 'listing' ? <IconLayoutGrid size={14} className="text-white" /> : <IconShoppingBag size={14} className="text-white" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <p className="text-sm dark:text-slate-200 leading-tight">
                            <span className="font-bold text-violet-600 dark:text-cyan-400 mr-1">@{act.user}</span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {act.type === 'listing' ? 'publicó' : 'compró por'}
                            </span>
                          </p>
                          <p className="font-black text-sm dark:text-white truncate">
                            {act.type === 'listing' ? act.card_name : `$${act.amount}`}
                          </p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter opacity-70 flex items-center gap-1">
                          <IconClock size={10} /> Hace un momento
                        </p>
                      </div>
                    </div>
                  ))}
                  {feedData.activity.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                      <IconTrendingUp size={48} className="mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Esperando novedades...</p>
                    </div>
                  )}
                </div>
              </ScrollShadow>
            </CardBody>
          </Card>
        </aside>

      </div>
    </div>
  );
};

export default HomeFeed;
