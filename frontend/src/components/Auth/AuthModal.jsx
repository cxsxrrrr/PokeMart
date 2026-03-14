import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IconX, IconUserPlus, IconLogin } from "@tabler/icons-react";

export default function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Decorative Top */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-poke-red dark:from-poke-yellow dark:via-yellow-500 dark:to-orange-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal"
        >
          <IconX size={20} />
        </button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              ¡Bienvenido Entrenador!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inicia sesión o crea una cuenta nueva para empezar tu aventura de recolección.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                onClose();
                navigate("/login");
              }}
              className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-white dark:bg-[#1e293b] border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-poke-yellow transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-poke-yellow group-hover:scale-110 transition-transform">
                  <IconLogin size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-900 dark:text-white">Iniciar Sesión</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Ya tengo una cuenta</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate("/register");
              }}
              className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-white dark:bg-[#1e293b] border-2 border-gray-200 dark:border-gray-700 hover:border-poke-red dark:hover:border-poke-yellow transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-white/5 text-poke-red dark:text-poke-yellow group-hover:scale-110 transition-transform">
                  <IconUserPlus size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-900 dark:text-white">Registrarse</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Quiero crear una cuenta</span>
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
