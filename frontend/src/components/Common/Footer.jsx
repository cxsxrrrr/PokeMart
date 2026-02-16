import React from 'react';

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
                            <img
                                src="/assets/logo.png"
                                alt="PokéMart TCG"
                                className="logo__img"
                            />
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
                                <a href="#popular">Comprar Cartas</a>
                            </li>
                            <li>
                                <a href="#deals">Vender mis Cartas</a>
                            </li>
                            <li>
                                <a href="#footer">Guía de Estado</a>
                            </li>
                            <li>
                                <a href="#footer">Sobre Nosotros</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Ayuda</h4>
                        <ul>
                            <li>
                                <a href="#footer">Centro de Soporte</a>
                            </li>
                            <li>
                                <a href="#footer">Envíos y Devoluciones</a>
                            </li>
                            <li>
                                <a href="#footer">Términos y Condiciones</a>
                            </li>
                            <li>
                                <a href="#footer">Política de Privacidad</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Suscríbete a ofertas</h4>
                        <p
                            style={{
                                color: "#ccc",
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