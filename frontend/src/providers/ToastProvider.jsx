import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconAlertCircle, IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onClose={() => removeToast(toast.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    info: <IconInfoCircle className="text-blue-500" size={20} />,
    success: <IconCheck className="text-green-500" size={20} />,
    warning: <IconAlertCircle className="text-amber-500" size={20} />,
    error: <IconAlertCircle className="text-red-500" size={20} />,
  };

  const bgColors = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    success: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-4 ${bgColors[toast.type] || bgColors.info} backdrop-blur-md`}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {icons[toast.type] || icons.info}
        </div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <IconX size={18} />
      </button>
    </motion.div>
  );
};
