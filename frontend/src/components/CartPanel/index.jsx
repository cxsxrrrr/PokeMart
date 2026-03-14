import { useEffect, useRef } from 'react';
import { CONSTANTS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { IconX, IconTrash, IconMinus, IconPlus, IconShoppingCart, IconSparkles, IconArrowRight, IconMessage2 } from '@tabler/icons-react';
import { Button, ScrollShadow, Spinner } from '@heroui/react';
import { cartService } from '../../services/cart.service';
import { chatService } from '../../services/chat.service';
import { useToast } from '../../providers/ToastProvider';
import { useNavigate } from 'react-router-dom';

const CartPanel = ({ isOpen, items, onClose, onIncrease, onDecrease, onRemove, total, loading }) => {
  const panelRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCheckout = async () => {
    try {
      const response = await cartService.checkout();
      const orders = response.orders;
      
      if (!orders || orders.length === 0) {
        throw new Error("No se crearon órdenes.");
      }

      // Enviar mensaje inicial de negociación para cada orden
      for (const order of orders) {
        const itemsList = order.items.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
        const welcomeMsg = `¡Hola! Estoy interesad@ en negociar por estas cartas:\n${itemsList}`;
        await chatService.sendMessage(order.id, welcomeMsg);
      }
      
      const multiple = orders.length > 1;
      showToast(
        multiple 
          ? `¡Se han creado ${orders.length} negociaciones separadas!` 
          : "¡Solicitud de negociación enviada!", 
        "success"
      );
      
      setTimeout(() => {
        onClose();
        // Redirigir a la primera negociación o al dashboard general
        navigate(`/dashboard`); 
        window.location.reload(); 
      }, 2000);
    } catch (error) {
      showToast("Error al procesar la solicitud: " + error.message, "error");
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[1000] transition-all duration-500 ease-in-out ${isOpen ? 'visible' : 'invisible'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop con Blur Dinámico */}
      <div 
        className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />

      {/* Cuerpo del Carrito */}
      <aside 
        ref={panelRef}
        className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header Premium */}
        <header className="px-6 py-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 dark:bg-cyan-500 rounded-2xl shadow-lg shadow-violet-500/20 dark:shadow-cyan-500/20">
              <IconShoppingCart size={24} className="text-white dark:text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-slate-800 dark:text-white">Mi Carrito</h2>
              <span className="text-xs font-bold text-violet-600 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <IconSparkles size={12} /> {items.length} {items.length === 1 ? 'objeto' : 'objetos'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <IconX size={24} />
          </button>
        </header>

        {/* Lista de Items */}
        <ScrollShadow size={40} className="flex-1 px-6 py-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Spinner color="secondary" size="lg" label="Sincronizando..." />
            </div>
          ) : items.length ? (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="group flex gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-all hover:border-violet-200 dark:hover:border-cyan-900">
                  {/* Miniatura de la Carta */}
                  <div className="w-20 h-28 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm p-1 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={item.image || CONSTANTS.PLACEHOLDER_IMAGE} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info y Acciones */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">{item.setName}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Control de Cantidad Estilizado */}
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <button 
                          onClick={() => onDecrease(item.id)}
                          className="p-0.5 text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <IconMinus size={16} stroke={3} />
                        </button>
                        <span className="text-sm font-black w-6 text-center text-slate-700 dark:text-slate-200">{item.quantity}</span>
                        <button 
                          onClick={() => onIncrease(item.id)}
                          className="p-0.5 text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <IconPlus size={16} stroke={3} />
                        </button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{formatCurrency(item.price)} C/U</p>
                        <p className="font-black text-violet-700 dark:text-cyan-400">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botón Eliminar Flotante (Sutil) */}
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="self-start p-1.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700">
                <IconShoppingCart size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">Tu carrito está vacío</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed mb-8">
                ¡Parece que aún no has atrapado ninguna carta! Explora nuestra colección y comienza tu aventura.
              </p>
              <Button 
                variant="flat" 
                color="secondary" 
                onClick={onClose}
                className="font-bold rounded-xl"
              >
                Volver a la tienda
              </Button>
            </div>
          )}
        </ScrollShadow>

        {/* Footer Checkout Premium */}
        <footer className="px-8 py-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              <span>Envío</span>
              <span className="text-green-500 dark:text-green-400 font-bold">SEGÚN AGENCIA ACORDADA</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
              <span className="text-xl font-bold text-slate-800 dark:text-white">Total</span>
              <div className="text-right">
                <span className="text-3xl font-display font-black text-slate-900 dark:text-cyan-400 drop-shadow-sm">
                  {formatCurrency(total)}
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Precio Sugerido</p>
              </div>
            </div>
          </div>

          <Button
            isDisabled={!items.length}
            onClick={handleCheckout}
            size="lg"
            className="w-full h-16 bg-violet-700 hover:bg-violet-800 dark:bg-cyan-500 dark:text-slate-950 font-display font-black text-lg rounded-2xl shadow-xl shadow-violet-500/20 dark:shadow-cyan-500/20 group overflow-hidden relative"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 translate-x-3 group-hover:translate-x-0 transition-transform duration-300">
              Proceder a Negociación
              <IconArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute top-0 right-0 h-full w-12 bg-white/10 skew-x-12 translate-x-20 group-hover:-translate-x-60 transition-transform duration-1000" />
          </Button>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center justify-center gap-2 uppercase tracking-widest">
            <IconMessage2 size={12} /> Trato seguro con mediación Team Rocket Proof
          </p>
        </footer>
      </aside>
    </div>
  );
};

export default CartPanel;