import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconSun, IconMoon, IconUser, IconShoppingBag } from "@tabler/icons-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import AuthModal from "../Auth/AuthModal";
import logo from "../../assets/logo2.png";

const Header = ({
  cartCount,
  onCartClick,
  theme,
  onToggleTheme,
  onSearch,
  headerLight,
  user,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
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
              <a href="/#hero" className="header-sell">Inicio</a>
              <Link to="/catalog" className="header-sell" onClick={() => isMenuMobile && setMenuOpen(false)}>
                Catálogo
              </Link>

              {/* Seccion NOSOTROS*/}
              <Link to="/about" className="header-sell" onClick={() => isMenuMobile && setMenuOpen(false)}>
                Nosotros
              </Link>

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
              <div className="user-profile flex items-center ml-1">
                {user ? (
                  <button
                    className="header-sell w-9 h-9 rounded-full overflow-hidden border-2"
                    style={{ borderColor: 'currentColor', display: 'block', padding: 0 }}
                    onClick={() => navigate("/profile")}
                    aria-label="Perfil"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
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