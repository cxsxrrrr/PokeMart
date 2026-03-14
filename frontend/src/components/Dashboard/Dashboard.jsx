import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconTrendingUp, IconShoppingBag, IconMessageCircle, IconClock, IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatters";
import { CONSTANTS } from "../../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ventas"); // 'ventas' | 'compras'
  const [ventas, setVentas] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const urlBase = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
      
      const [resVentas, resCompras] = await Promise.all([
        fetch(`${urlBase}/store/sales/`, { credentials: "include" }),
        fetch(`${urlBase}/store/orders/`, { credentials: "include" })
      ]);

      if (resVentas.ok) setVentas(await resVentas.json());
      if (resCompras.ok) setCompras(await resCompras.json());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "Disponible":
      case "Available":
        return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">Disponible</span>;
      case "Pendiente":
      case "Pending":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><IconClock size={12}/> Pendiente</span>;
      case "En proceso":
      case "En PROCESO":
      case "En Progreso":
      case "En progreso":
        return <span className="px-3 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><IconClock size={12}/> En proceso</span>;
      case "Completado":
      case "Finalizado":
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><IconCheck size={12}/> Completado</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-5 pb-20 min-h-[80vh]">
      
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-800 dark:from-[#0b1021] dark:to-[#111827] rounded-3xl p-8 mb-6 text-white shadow-xl shadow-violet-900/20 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-white/5 rotate-12 pointer-events-none blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[100%] bg-cyan-400/10 rounded-full pointer-events-none blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 backdrop-blur-md flex items-center justify-center">
              <img 
                src={user?.avatarUrl && user.avatarUrl !== "" ? user.avatarUrl : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"} 
                alt="User" 
                className="w-full h-full object-cover p-2"
                onError={(e) => { e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"; }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-black mb-1">¡Hola de nuevo, {user?.username}!</h1>
              <p className="text-violet-200 dark:text-cyan-400 font-medium tracking-tight">Gestiona tus cartas y negociaciones activas</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/catalog')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors font-bold flex items-center gap-2 backdrop-blur-sm"
            >
              <IconSearch size={20} /> Explorar
            </button>
            <button 
              onClick={() => alert("Pronto podrás publicar tus propias cartas...")}
              className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-900 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all font-black flex items-center gap-2"
            >
              <IconPlus size={20} /> Publicar
            </button>
          </div>
        </div>
      </div>

      {/* Panel "Mis Operaciones" */}
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 bg-gradient-to-r from-violet-600 to-cyan-500 inline-block text-transparent bg-clip-text">Centro de Negocios</h2>
        
        {/* TABS */}
        <div className="flex gap-2 bg-slate-100 dark:bg-[#161f36] p-1.5 rounded-2xl w-full max-w-sm mb-8 relative z-20">
          <button
            onClick={() => setActiveTab("ventas")}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${activeTab === 'ventas' ? 'bg-white dark:bg-[#1f2b4a] shadow-sm text-violet-700 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-[#1c2742]'}`}
          >
            <IconTrendingUp size={18} /> Mis Ventas
          </button>
          <button
            onClick={() => setActiveTab("compras")}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${activeTab === 'compras' ? 'bg-white dark:bg-[#1f2b4a] shadow-sm text-violet-700 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-[#1c2742]'}`}
          >
            <IconShoppingBag size={18} /> Mis Compras
          </button>
        </div>
        
        {/* LISTA DE TRANSACCIONES */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20"><IconClock className="animate-spin mx-auto text-violet-400" size={40} /></div>
          ) : (activeTab === 'ventas' ? ventas : compras).map(item => (
            <div 
              key={item.id} 
              onClick={() => item.type === 'order' && navigate(`/dashboard/negotiations/${item.id}`)}
              className={`bg-white dark:bg-[#17223b] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-[#243354] flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-cyan-900/10 ${item.type === 'order' ? 'cursor-pointer group' : ''}`}
            >
              
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-cyan-50 dark:from-[#212f51] dark:to-[#192745] p-2 rounded-xl border border-violet-200/50 dark:border-cyan-500/20">
                  <img src={item.image || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/0.png"} alt={item.item_name} className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white capitalize leading-tight mb-1">{item.item_name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {item.type === 'listing' ? "Publicación en catálogo" : (activeTab === 'ventas' ? `Comprador: ${item.buyer}` : `Vendedor: ${item.seller}`)} 
                    <span className="mx-2 text-slate-300">•</span> 
                    <span className="font-bold text-violet-600 dark:text-cyan-400 uppercase tracking-tighter">{formatCurrency(item.total_price)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-10">
                <div className="flex flex-col items-start sm:items-end min-w-[120px]">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Estado</p>
                  {getStatusBadge(item.status)}
                </div>

                {item.type === 'order' && (
                  <div className="flex items-center justify-center p-3 rounded-xl bg-violet-100 dark:bg-cyan-500/10 text-violet-600 dark:text-cyan-400 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-cyan-500 dark:group-hover:text-slate-950 transition-all">
                    <IconMessageCircle size={22} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {!loading && ((activeTab === 'ventas' ? ventas : compras).length === 0) && (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <IconShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No tienes operaciones de {activeTab === 'ventas' ? 'venta' : 'compra'} activas.</p>
              <button 
                 onClick={() => navigate('/catalog')}
                 className="mt-4 text-violet-600 dark:text-cyan-400 font-bold hover:underline"
              >
                {activeTab === 'ventas' ? '¿Quieres publicar una carta?' : '¡Explora el catálogo para comprar!'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
