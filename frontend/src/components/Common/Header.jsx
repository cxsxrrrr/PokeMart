import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconSun, IconMoon, IconUser, IconShoppingBag } from "@tabler/icons-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import AuthModal from "../Auth/AuthModal";
import logo from "../../assets/logo2.png";

import { useAuth } from "../../hooks/useAuth";

const Header = ({
  cartCount,
  onCartClick,
  theme,
  onToggleTheme,
  onSearch,
  headerLight,
  user,
}) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const headerContentRef = useRef(null);
  const headerFlexRef = useRef(null);
  const isMenuMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event) => {
      if (headerContentRef.current && !headerContentRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (!event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  return (
    <>
      <header className="main-header">
        <div
          className={`container header-content${menuOpen ? " menu-open" : ""}${headerLight ? " header-content--light" : ""}`}
          ref={headerContentRef}
        >
          <Link to="/" className="logo">
            <img
              src={logo}
              alt="PokéMart TCG"
              className="logo__img"
            />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="header-utility"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
          </button>
          <div
            className="header-flex"
            id="header-utility"
            aria-hidden={isMenuMobile ? !menuOpen : false}
            ref={headerFlexRef}
          >
            <div className="user-actions">
              <Link to="/" className="header-sell" onClick={() => isMenuMobile && setMenuOpen(false)}>
                Inicio
              </Link>
              <Link to="/catalog" className="header-sell" onClick={() => isMenuMobile && setMenuOpen(false)}>
                Catálogo
              </Link>
              {!user && (
                <Link to="/about" className="header-sell" onClick={() => isMenuMobile && setMenuOpen(false)}>
                  Nosotros
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="header-sell" onClick={() => isMenuMobile && setMenuOpen(false)}>
                 Dashboard
                </Link>
              )}

              <button
                className="header-sell cart-icon flex items-center justify-center transition-transform hover:-translate-y-1"
                type="button"
                aria-label="Ver carrito"
                onClick={onCartClick}
                style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', position: 'relative' }}
              >
                <IconShoppingBag size={25} stroke={1.5} />
                <span className="cart-count absolute -top-1 -right-2 bg-purple-600 dark:bg-cyan-400 text-white dark:text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-transparent">{cartCount}</span>
              </button>
              <button
                className="header-sell flex items-center justify-center transition-transform hover:-translate-y-1"
                onClick={onToggleTheme}
                aria-label="Cambiar tema"
                type="button"
                style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
              >
                {theme === "dark" ? (
                  <IconSun size={26} />
                ) : (
                  <IconMoon size={26} />
                )}
              </button>
              <div className="user-profile flex items-center ml-1 relative user-menu-container">
                {user ? (
                  <div className="relative">
                    <button
                      className="header-sell w-9 h-9 rounded-full overflow-hidden border-2 transition-transform hover:scale-105"
                      style={{ borderColor: 'currentColor', display: 'block', padding: 0 }}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-label="Perfil"
                    >
                      <img
                        src={user.avatarUrl && user.avatarUrl !== "" ? user.avatarUrl : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"}
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"; }}
                      />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-bold text-slate-800 dark:text-cyan-400 capitalize truncate">{user.username}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-cyan-400 rounded-md transition-colors"
                          >
                            Configuración de Perfil
                          </button>
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                          >
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="header-sell flex items-center justify-center transition-transform hover:-translate-y-1"
                    style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                    onClick={() => setIsAuthModalOpen(true)}
                    aria-label="Iniciar sesión o registrarse"
                  >
                    <IconUser size={26} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;