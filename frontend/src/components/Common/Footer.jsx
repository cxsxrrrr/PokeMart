import { Link } from "react-router-dom";
import logo from "../../assets/logo-morado.png";

const Footer = ({ backendStatus }) => {
    const backendLabel =
        backendStatus === "online" ? "Online" :
            backendStatus === "offline" ? "Offline" : "Revisando...";

    return (
        <footer className="main-footer" id="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <div className="logo" style={{ fontSize: "1.4rem" }}>
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="PokéMart TCG"
                                    className="logo__img"
                                />
                            </Link>
                        </div>
                        <p
                            style={{ marginTop: "1rem", color: "#ccc", fontSize: "0.9rem" }}
                        >
                            Tu tienda de confianza hecha por fans para fans. Compra, vende e
                            intercambia tus cartas favoritas de forma segura.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Enlaces Rápidos</h4>
                        <ul>
                            <li>
                                <Link to="/dashboard">Vender mis Cartas</Link>
                            </li>
                            <li>
                                <Link to="/about">Sobre Nosotros</Link>
                            </li>
                            <li>
                                <Link to="/catalog">Ver Catálogo</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Ayuda</h4>
                        <ul>
                            <li>
                                <Link to="/about">Centro de Soporte</Link>
                            </li>
                            <li>
                                <Link to="/terms">Términos y Condiciones</Link>
                            </li>
                            <li>
                                <Link to="/privacy">Política de Privacidad</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Suscríbete a ofertas</h4>
                        <p
                            style={{
                                fontSize: "0.9rem",
                                marginBottom: "1rem",
                            }}
                        >
                            Recibe alertas de stock y descuentos exclusivos.
                        </p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Tu email..." />
                            <button type="submit">⚡</button>
                        </form>
                        <div
                            className={`backend-status backend-status--${backendStatus}`}
                        >
                            Backend: {backendLabel}
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p>© 2026 URBE</p>
                </div>
            </div>
        </footer>
  );
};

export default Footer;