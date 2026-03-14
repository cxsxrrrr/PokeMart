import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  IconArrowLeft, 
  IconSend, 
  IconCheck, 
  IconClock, 
  IconGripVertical,
  IconX,
  IconUser,
  IconPlus,
  IconShoppingBag,
  IconSearch,
  IconMessageCircle,
  IconTrash
} from "@tabler/icons-react";
import { 
  Button, 
  Input, 
  ScrollShadow, 
  Spinner, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
} from "@heroui/react";
import { chatService } from "../../services/chat.service";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatters";
import { CONSTANTS } from "../../utils/constants";

export default function NegotiationChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerListings, setSellerListings] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchNegotiation = async () => {
    try {
      const msgs = await chatService.getMessages(id);
      setMessages(prev => {
        if (JSON.stringify(prev) === JSON.stringify(msgs)) return prev;
        return msgs;
      });
      
      const urlBase = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${urlBase}/store/orders/${id}/`, {
        credentials: "include"
      });
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
        
        // Cargar listings del vendedor (el primero que aparezca en la lista)
        if (orderData.seller_usernames?.length > 0) {
          const sellerName = orderData.seller_usernames[0];
          const listingsRes = await fetch(`${urlBase}/store/users/${sellerName}/listings/`, {
            credentials: "include"
          });
          if (listingsRes.ok) {
            setSellerListings(await listingsRes.json());
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegotiation();
    const interval = setInterval(fetchNegotiation, 5000); 
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const isFromMe = lastMsg.sender === user?.username;
    
    // Obtenemos el contenedor del ScrollShadow
    const container = messagesEndRef.current?.closest('.scroll-container') || messagesEndRef.current?.parentElement;

    if (loading || isFromMe) {
      // Si es carga inicial o mensaje propio, bajamos sí o sí
      messagesEndRef.current?.scrollIntoView({ behavior: loading ? "auto" : "smooth" });
    } else if (container) {
      // Si es mensaje de otro, solo bajamos si el usuario ya estaba al fondo
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatService.sendMessage(id, newMessage);
      setNewMessage("");
      fetchNegotiation();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await chatService.updateStatus(id, newStatus);
      fetchNegotiation();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddCard = async (listingId, cardName) => {
    try {
      const urlBase = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${urlBase}/store/orders/${id}/add-item/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, quantity: 1 }),
        credentials: "include"
      });
      
      if (res.ok) {
        // Enviar mensaje automático avisando de la nueva carta
        await chatService.sendMessage(id, `¡He añadido "${cardName}" a nuestra negociación!`);
        fetchNegotiation();
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleRemoveCard = async (detailId, cardName) => {
    if (order.details.length <= 1) return; // Ya validado en backend pero por UX

    try {
      const urlBase = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${urlBase}/store/orders/${id}/remove-item/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detail_id: detailId }),
        credentials: "include"
      });
      
      if (res.ok) {
        await chatService.sendMessage(id, `He retirado "${cardName}" de esta negociación. 🗑️`);
        fetchNegotiation();
      }
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };

  if (loading && !order) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Spinner size="lg" label="Sincronizando negociación..." color="secondary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 max-w-6xl h-[88vh] flex flex-col md:flex-row gap-6">
      
      {/* Columna Principal: Chat */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111827] rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Header chat */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/30 dark:bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button 
              isIconOnly 
              variant="flat" 
              onClick={() => navigate('/dashboard')}
              className="rounded-xl"
              size="sm"
            >
              <IconArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                {order?.is_seller ? `Negociación con ${order?.buyer_username}` : `Negociación con ${order?.seller_usernames?.[0] || 'Vendedor'}`}
                <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-700 dark:bg-cyan-500/10 dark:text-cyan-400 rounded-full uppercase tracking-tighter">
                  {order?.status || 'Pendiente'}
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-violet-600 dark:text-cyan-400 uppercase flex items-center gap-1">
                  <IconUser size={12} /> {order?.buyer_username}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {order?.details?.length || 0} cartas • {formatCurrency(order?.total_price || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(order?.is_seller || (order?.status !== "Cancelado" && order?.status !== "Completado")) && (
              <Dropdown classNames={{ content: "bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-1 shadow-xl", base: "dark" }}>
                <DropdownTrigger>
                  <Button variant="flat" color="secondary" size="sm" className="font-bold rounded-xl" endContent={<IconGripVertical size={14} />}>
                    {order?.is_seller ? "Estado" : "Opciones"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => handleStatusChange(key)} variant="flat">
                  {order?.is_seller ? [
                    <DropdownItem key="Pendiente" className="text-slate-700 dark:text-slate-100" startContent={<IconClock size={16} />}>Pendiente</DropdownItem>,
                    <DropdownItem key="En proceso" className="text-slate-700 dark:text-slate-100" startContent={<IconClock size={16} />}>En proceso</DropdownItem>,
                    <DropdownItem key="Completado" color="success" className="text-success-600 dark:text-success-400 font-bold" startContent={<IconCheck size={16} />}>Completado</DropdownItem>,
                    <DropdownItem key="Cancelado" color="danger" className="text-danger-600 dark:text-danger-400 font-bold" startContent={<IconX size={16} />}>Cancelado</DropdownItem>
                  ] : [
                    <DropdownItem key="Cancelado" color="danger" className="text-danger-600 dark:text-danger-400 font-bold" startContent={<IconX size={16} />}>Cancelar Negociación</DropdownItem>
                  ]}
                </DropdownMenu>
              </Dropdown>
            )}
            <Button 
              isIconOnly 
              variant="flat" 
              className="md:hidden rounded-xl"
              onClick={() => setShowCatalog(!showCatalog)}
              size="sm"
            >
              <IconShoppingBag size={18} />
            </Button>
          </div>
        </div>

        {/* Messages area */}
        <ScrollShadow className="flex-1 p-6 space-y-6 bg-slate-50/10 dark:bg-transparent scroll-container">
          {messages.map((msg, index) => {
            const isMe = msg.sender === user?.username;
            return (
              <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  {!isMe && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{msg.sender}</span>}
                  <span className="text-[9px] text-slate-400 font-medium">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  isMe 
                    ? 'bg-violet-600 dark:bg-cyan-500 text-white dark:text-slate-950 rounded-tr-none font-medium' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </ScrollShadow>

        {/* Input area */}
        <div className="p-6 bg-white dark:bg-[#111827] border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu propuesta..."
              className="flex-1"
              size="lg"
              variant="flat"
              classNames={{ inputWrapper: "bg-slate-100/50 dark:bg-slate-800/50 h-14 rounded-2xl border-2 border-transparent focus-within:border-violet-500/30 dark:focus-within:border-cyan-500/30 transition-all" }}
            />
            <Button 
              isIconOnly 
              type="submit"
              color="secondary" 
              size="lg"
              className="h-14 w-14 rounded-2xl shadow-lg shadow-violet-500/20 active:scale-95 transition-transform"
            >
              <IconSend size={24} />
            </Button>
          </form>
        </div>
      </div>

      {/* Sidebar: Detalle de Negociación y Catálogo */}
      <div className={`w-full md:w-80 h-full flex flex-col bg-slate-50 dark:bg-[#0b1021] rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg transition-all ${showCatalog ? 'block' : 'hidden md:flex'}`}>
        
        <ScrollShadow className="flex-1">
          {/* SECCIÓN 1: CARTAS EN ESTA NEGOCIACIÓN */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-white/5">
            <h2 className="text-sm font-black dark:text-white flex items-center gap-2 mb-4 uppercase tracking-wider">
               <IconShoppingBag size={18} className="text-violet-600 dark:text-cyan-400" />
               En esta Negociación
            </h2>
            <div className="space-y-3">
              {order?.details?.map(detail => (
                <div key={detail.id} className="group relative flex gap-3 bg-white dark:bg-[#111827] p-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  {order.details.length > 1 && (
                    <button 
                      onClick={() => handleRemoveCard(detail.id, detail.listing.card.name)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    >
                      <IconTrash size={12} />
                    </button>
                  )}
                  <div className="w-12 h-16 bg-slate-50 dark:bg-slate-900 rounded-lg p-1">
                    <img src={detail.listing.card.image_url} alt={detail.listing.card.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[11px] font-black dark:text-white truncate uppercase">{detail.listing.card.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] font-bold text-slate-500">x{detail.quantity}</span>
                      <span className="text-[10px] font-black text-violet-600 dark:text-cyan-400">{formatCurrency(detail.unit_price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: MÁS CARTAS DEL VENDEDOR */}
          <div className="p-6">
            <h2 className="text-sm font-black dark:text-white flex items-center gap-2 mb-4 uppercase tracking-wider">
               <IconPlus size={18} className="text-slate-400" />
               Añadir más del Vendedor
            </h2>
            <div className="space-y-4">
              {sellerListings.filter(l => !order?.details?.some(d => d.listing.id === l.id)).length === 0 ? (
                <div className="text-center py-6 px-4 opacity-50">
                  <p className="text-[10px] font-medium italic">No hay más cartas disponibles</p>
                </div>
              ) : sellerListings.filter(l => !order?.details?.some(d => d.listing.id === l.id)).map(listing => (
                <div key={listing.id} className="group bg-white dark:bg-[#111827] p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-violet-500/30 dark:hover:border-cyan-500/30 transition-all">
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-18 bg-slate-50 dark:bg-slate-900 rounded-lg p-1 overflow-hidden">
                      <img src={listing.card.image_url} alt={listing.card.name} className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black dark:text-white truncate uppercase mb-1">{listing.card.name}</p>
                      <p className="text-[10px] font-bold text-violet-600 dark:text-cyan-400">{formatCurrency(listing.price)}</p>
                    </div>
                  </div>
                  <Button 
                    fullWidth 
                    size="sm" 
                    variant="flat" 
                    color="secondary"
                    className="rounded-xl font-bold h-8 text-[11px]"
                    onClick={() => handleAddCard(listing.id, listing.card.name)}
                    startContent={<IconPlus size={12} />}
                  >
                    Agregar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollShadow>
        
        {/* Footer Sidebar: Resumen Carrito Negociación */}
        <div className="p-6 bg-white dark:bg-[#111827] border-t border-slate-100 dark:border-slate-800">
           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-cyan-500 dark:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-violet-900/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-black opacity-80">Total Negociación</span>
                <span className="text-sm font-black">{formatCurrency(order?.total_price || 0)}</span>
              </div>
              <p className="text-[9px] font-medium opacity-70">Incluye {order?.details?.length || 0} artículos</p>
           </div>
        </div>
      </div>
    </div>
  );
}
