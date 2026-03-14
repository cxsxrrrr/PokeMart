import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    /* paleta de colores no tocar */
    :root {
        --poke-red: #be1f1f;
        --poke-yellow: #FFCC00;
        --poke-blue: #14113a;
        --poke-dark-blue: #141f41;
        --bg-light: #e6e6ee;
        --text-dark: #333333;
        --card-border: #E0E0E0;
        /* New badge colors for light/dark modes */
        --badge-purple: #7c3aed; /* Changed to darker purple for better combination with page colors */
        --badge-cyan: #06b6d4; /* Cyan for dark mode badges */
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: 'Poppins', sans-serif;
        background-color: var(--bg-light);
        color: var(--text-dark);
        overflow-x: hidden;
        transition: background-color 0.4s ease, color 0.4s ease;
    }

    input:focus, textarea:focus, select:focus, button:focus {
        outline: none !important;
        box-shadow: none !important;
    }
    
    /* Para componentes que usen focus-visible */
    *:focus-visible {
        outline: none !important;
        box-shadow: none !important;
    }

    body.cart-open { overflow: hidden; }
    a { text-decoration: none; }
    ul { list-style: none; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* suaviza el cambio entre temas */
    .main-header, .landing-hero, .deals-section, .main-footer, .search-bar .input, .neu-button {
        transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }

    .section-title {
        font-size: 2rem; font-weight: 800; color: var(--badge-purple); /* Changed from var(--poke-dark-blue) to purple for light mode */
        margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px;
        display: flex; align-items: center; gap: 0.65rem;
    }

    .section-title__icon { width: 7rem; height: auto; flex-shrink: 0; display: block; }
    .section-title__icon--offset { transform: translateY(5rem); }

    /* =========================================
       BOTONES GLOBALES
       ========================================= */
    .btn {
        padding: 12px 24px; border-radius: 30px; font-weight: 600;
        cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: none;
    }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .btn-primary { background-color: var(--poke-yellow); color: var(--poke-dark-blue); }
    .btn-secondary {
        background: linear-gradient(135deg, #223286 0%, #1b2fb5 100%); color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.25); box-shadow: 0 12px 26px rgba(27, 47, 181, 0.35);
    }
    .btn-secondary:hover {
        background: linear-gradient(135deg, #5472ff 0%, #2339d0 100%); box-shadow: 0 16px 30px rgba(27, 47, 181, 0.42);
    }
    .btn-secondary:focus { outline: 2px solid rgba(255, 255, 255, 0.4); outline-offset: 3px; }

    /* =========================================
       HEADER & BUSCADOR
       ========================================= */
    .main-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0), rgba(29, 44, 94, 0.28));
        padding: 1rem 0; position: sticky; top: 0; left: 0; right: 0; margin: 0; z-index: 100;
        backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); border: 0px solid rgba(255, 255, 255, 0.28); border-radius: 0 0 18px 18px;
    }

    .header-content { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; position: relative; }
    .header-flex { display: flex; align-items: center; gap: 1.5rem; flex: 1; margin-left: 1.5rem; }
    
    .logo { display: inline-flex; align-items: center; }
    .logo__img { display: block; height: 60px; width: auto; }

    .search-bar { flex-grow: 1; margin: 0 2rem; position: relative; max-width: 500px; }
    .search-bar .input {
        width: 100%; border: none; outline: none; border-radius: 15px; padding: 1em;
        background-color: #ccc; box-shadow: inset 1px 3px 6px rgba(0,0,0,0.18);
        transition: 300ms ease-in-out; font-family: inherit; padding-right: 140px; 
    }
    .search-bar .input:focus {
        background-color: #f4f4f4; transform: scale(1.01);
        box-shadow: 6px 6px 28px rgba(150,150,150,0.6), -6px -6px 28px rgba(255,255,255,0.7);
    }
    .search-btn {
        position: absolute; right: -4px; top: 50%; transform: translateY(-50%);
        background: transparent; border: none; padding: 1em; z-index: 2;
    }

    .neu-button {
        background-color: #e0e0e0; border-radius: 10px;
        box-shadow: inset 4px 4px 10px #bcbcbc, inset -4px -4px 10px #ffffff;
        color: #4d4d4d; cursor: pointer; font-size: 17px; padding: 12px 12px;
        transition: all 0.2s ease-in-out; border: 2px solid rgb(206, 206, 206); font-weight: 700;
    }
    .neu-button:hover, .neu-button:focus {
        box-shadow: inset 2px 2px 5px #bcbcbc, inset -2px -2px 5px #ffffff, 2px 2px 5px #bcbcbc, -2px -2px 5px #ffffff;
    }

    .user-actions { display: flex; gap: 1.5rem; align-items: center; margin-left: auto; }
    .header-sell { color: #ffffff; font-weight: 600; transition: color 0.3s ease; }
    .header-content.header-content--light .header-sell { color: #111111; }

    .cart-icon {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        background: transparent; border: none; padding: 0; transition: transform 0.2s ease;
    }
    .cart-icon:focus-visible { outline: 2px solid rgba(29, 44, 94, 0.6); outline-offset: 4px; }
    .cart-icon:hover { transform: translateY(-4px); }

    /* =========================================
       TOGGLE DARK MODE (SWITCH)
       ========================================= */
    .toggle-cont {
        --primary: #d0d0d0; --light: #f4f4f4; --dark: #cccccc; --gray: #b5b5b5;
        position: relative; z-index: 10; width: fit-content; height: 50px;
        border-radius: 9999px; transform: scale(0.5); transform-origin: center;
    }
    .toggle-cont .toggle-input { display: none; }
    .toggle-cont .toggle-label {
        --gap: 5px; --width: 50px; cursor: pointer; position: relative; display: inline-block; padding: 0.5rem;
        width: calc((var(--width) + var(--gap)) * 2); height: 100%; background-color: var(--dark);
        border: 1px solid #777777; border-bottom: 0; border-radius: 9999px; box-sizing: content-box; transition: all 0.3s ease-in-out;
    }
    .toggle-label::before {
        content: ''; position: absolute; z-index: -10; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: calc(100% + 1.5rem); height: calc(100% + 1.5rem); background-color: var(--gray);
        border: 1px solid #777777; border-bottom: 0; border-radius: 9999px; transition: all 0.3s ease-in-out;
    }
    .toggle-label::after {
        content: ''; position: absolute; z-index: -10; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 100%; height: 100%; background-image: radial-gradient(circle at 50% -100%, rgb(58, 155, 252) 0%, rgba(12, 12, 12, 1) 80%);
        border-radius: 9999px;
    }
    .toggle-cont .toggle-label .cont-icon {
        position: relative; display: flex; justify-content: center; align-items: center; width: var(--width); height: 50px;
        background-image: radial-gradient(circle at 50% 0%, #666666 0%, var(--gray) 100%); border: 1px solid #aaaaaa;
        border-bottom: 0; border-radius: 9999px; box-shadow: inset 0 -0.15rem 0.15rem var(--primary), inset 0 0 0.5rem 0.75rem var(--second);
        transition: transform 0.3s ease-in-out; overflow: clip;
    }
    .cont-icon .sparkle {
        position: absolute; top: 50%; left: 50%; display: block; width: calc(var(--width) * 1px); aspect-ratio: 1;
        background-color: var(--light); border-radius: 50%; transform-origin: 50% 50%; rotate: calc(1deg * var(--deg));
        transform: translate(-50%, -50%); animation: sparkle calc(100s / var(--duration)) linear calc(0s / var(--duration)) infinite;
    }
    @keyframes sparkle { to { width: calc(var(--width) * 0.5px); transform: translate(2000%, -50%); } }
    .cont-icon .icon { width: 1.1rem; fill: var(--light); }
    .toggle-input:checked + .toggle-label { background-color: rgba(65, 67, 68, 0); border: 1px solid #3d6970; border-bottom: 0; }
    .toggle-input:checked + .toggle-label::before { box-shadow: 0 1rem 2.5rem -2rem #0080ff; }
    .toggle-input:checked + .toggle-label .cont-icon {
        overflow: visible; background-image: radial-gradient(circle at 50% 0%, #045ab1 0%, var(--primary) 100%);
        border: 1px solid var(--primary); border-bottom: 0; transform: translateX(calc((var(--gap) * 2) + 100%)) rotate(-225deg);
    }
    .toggle-input:checked + .toggle-label .cont-icon .sparkle {
        z-index: -10; width: calc(var(--width) * 1.5px); background-color: #acacac;
        animation: sparkle calc(100s / var(--duration)) linear calc(10s / var(--duration)) infinite;
    }

    /* =========================================
       POPULAR CAROUSEL (Y FLECHAS)
       ========================================= */
    .popular-section { padding: 4rem 0 8rem; }
    .carousel-shell { display: flex; align-items: center; gap: 1.5rem; margin-top: 1.5rem; }
    
    .carousel-btn {
        background-color: white; border: 2px solid var(--poke-dark-blue);
        color: var(--poke-dark-blue); font-size: 1.5rem; width: 50px; height: 50px;
        border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center;
        z-index: 10; transition: all 0.2s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.1); flex-shrink: 0;
    }
    .carousel-btn:hover { background-color: var(--poke-dark-blue); color: white; transform: scale(1.1); }

    .carousel-window { flex: 1; position: relative; height: 580px; perspective: 1600px; overflow: visible; }
    .carousel-track { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; }
    
    .carousel-track .card-item { 
        position: absolute; top: 0; left: 50%; width: 320px; max-width: 80vw; min-height: 540px !important; 
    }
    
    .carousel-track .card-3d-wrapper { height: 360px !important; margin-bottom: 1.25rem; }
    .carousel-track .card-3d-face img { filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3)); }
    
    @media (max-width: 768px) {
        .carousel-window { height: 520px; }
        .carousel-track .card-item { width: 280px; min-height: 500px !important; }
        .carousel-track .card-3d-wrapper { height: 320px !important; }
        .carousel-btn { width: 40px; height: 40px; font-size: 1.2rem; }
    }

    /* =========================================
       DEALS SECTION (OFERTAS RELÁMPAGO)
       ========================================= */
    .deals-section { padding: 4rem 0; background-color: transparent; }
    .deals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
    @media (max-width: 540px) {
        .deals-grid { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
    }

    /* =========================================
       CARRITO DE COMPRAS (CartPanel - Deprecated, now in component)
       ========================================= */

    /* =========================================
       FOOTER (PIE DE PÁGINA) - SÓLIDO Y PROFESIONAL
       ========================================= */
    .main-footer {
        background-color: var(--poke-dark-blue);
        color: white;
        padding: 60px 0 20px;
        margin-top: 60px;
        border-top: 4px solid white;
    }

    /* 👇 ESTO ASEGURA QUE SE BORREN LOS DEGRADADOS FANTASMAS ANTERIORES 👇 */
    .main-footer::before, .main-footer::after { display: none !important; background: none !important; }

    .footer-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 30px; margin-bottom: 40px;
    }
    .footer-col h4 { color: var(--poke--yellow); margin-bottom: 20px; font-size: 1.2rem; font-weight: 800; }
    .footer-col p { font-size: 0.95rem; line-height: 1.6; }
    .footer-col ul li { margin-bottom: 12px; }
    .footer-col ul li a { color: #ccc; transition: color 0.2s; font-size: 0.95rem; font-weight: 500; }
    .footer-col ul li a:hover { color: white; }

    .newsletter-form { display: flex; margin-bottom: 1.5rem; }
    .newsletter-form input { flex: 1; padding: 10px 15px; border-radius: 8px 0 0 8px; border: none; outline: none; background: rgba(255,255,255,0.1); color: white; }
    .newsletter-form input::placeholder { color: #aaa; }
    .newsletter-form button {
        background-color: #4d7080;
        color: var(--poke-dark-blue);
        border: none; padding: 0 15px; border-radius: 0 8px 8px 0; cursor: pointer; font-size: 1.2rem; transition: background 0.2s;
    }
    .newsletter-form button:hover {
        background-color: #74a8c0;
    }

    .copyright { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; color: #888; }

    /* =========================================
       DARK MODE GLOBALES
       ========================================= */
    body.dark-mode { background-color: #0b1021; color: #e5e7eb; }
    body.dark-mode .main-header {
        background: linear-gradient(135deg, rgba(38, 42, 15, 0.9), rgba(15, 23, 42, 0.7));
        border-color: rgba(148, 163, 184, 0.35); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    body.dark-mode .header-content.header-content--light .header-sell { color: #f8fafc; }

    body.dark-mode .section-title { color: var(--badge-cyan); } /* Changed to cyan for dark mode */
    body.dark-mode .search-bar .input { background-color: #1f2937; color: #e5e7eb; box-shadow: inset 1px 3px 6px rgba(0,0,0,0.45); }
    body.dark-mode .search-bar .input::placeholder { color: #9ca3af; }
    body.dark-mode .search-bar .input:focus { background-color: #111827; box-shadow: 6px 6px 28px rgba(0,0,0,0.55), -6px -6px 28px rgba(255,255,255,0.04); }

    body.dark-mode .neu-button {
        background-color: #1f2937; color: #e5e7eb; border-color: #2d3748;
        box-shadow: inset 3px 3px 8px #0b1220, inset -3px -3px 8px #273244;
    }
    body.dark-mode .neu-button:hover, body.dark-mode .neu-button:focus {
        box-shadow: inset 2px 2px 5px #0b1220, inset -2px -2px 5px #273244, 2px 2px 6px #0b1220, -2px -2px 6px #273244;
    }

    body.dark-mode .landing-hero {
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 20%, transparent 20%),
                    linear-gradient(135deg, #0f172a 0%, #111827 100%);
    }

    body.dark-mode .carousel-btn { background-color: #1f2937; border-color: #374151; color: #e5e7eb; }
    body.dark-mode .carousel-btn:hover { background-color: var(--poke-yellow); color: var(--poke-dark-blue); }
    body.dark-mode .cart-count { background-color: var(--badge-cyan); color: black; } /* Changed to cyan for dark mode */

    /* Increase opacity for CTA buttons in deals section (flash deals) */
    body.dark-mode .deals-section .card-cta,
    body.dark-mode .deals-section button {
        opacity: 1 !important; /* Ensures full opacity for better visibility */
        background-color: var(--badge-cyan) !important; /* Set to cyan for dark mode */
        color: black !important; /* Text color for contrast */
    }

    /* Tabler icons */
    body.dark-mode .how-it-works svg {
        color: #ffffff !important;
        stroke: #ffffff !important;
    }

    /* círculo detrás del icono */
    body.dark-mode .how-it-works .bg-poke-dark\\/10 {
        background-color: rgba(255, 255, 255, 0.12) !important;
    }
`;

export default GlobalStyle;