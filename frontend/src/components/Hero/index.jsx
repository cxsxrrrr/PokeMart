import React, { useRef, useEffect } from 'react';
import { CONSTANTS } from '../../utils/constants';

// Función auxiliar para limitar valores
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const HeroSection = ({ theme }) => {
  const heroTiltWrapperRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroAudioRef = useRef(null);

  // Referencias para estados de animación (sin re-renderizar)
  const animState = useRef({
    tilt: { x: 0, y: 0 },
    spin: { rotationY: 0, active: false },
    roar: { translateX: 0, translateY: 0, scale: 1, active: false },
    frames: { tilt: null, spin: null, roar: null }
  });

  useEffect(() => {
    const wrapper = heroTiltWrapperRef.current;
    if (!wrapper) return;

    // --- RENDERIZADO ---
    const renderTransform = () => {
      if (!heroCardRef.current) return;

      const { tilt, spin, roar } = animState.current;

      const tiltTranslateX = -(tilt.x / CONSTANTS.HERO_MAX_TILT) * CONSTANTS.HERO_MAX_TRANSLATE;
      const tiltTranslateY = (tilt.y / CONSTANTS.HERO_MAX_TILT) * CONSTANTS.HERO_MAX_TRANSLATE;

      const totalX = tiltTranslateX + roar.translateX;
      const totalY = tiltTranslateY + roar.translateY;
      const totalRotateY = spin.rotationY + tilt.x;

      heroCardRef.current.style.transform = `
        translateX(${totalX.toFixed(2)}px)
        translateY(${totalY.toFixed(2)}px)
        rotateX(${tilt.y.toFixed(2)}deg)
        rotateY(${totalRotateY.toFixed(2)}deg)
        rotate(${CONSTANTS.HERO_BASE_Z_ROTATION}deg)
        scale(${roar.scale.toFixed(3)})
      `;
    };

    const scheduleRender = () => {
      if (animState.current.frames.tilt) cancelAnimationFrame(animState.current.frames.tilt);
      animState.current.frames.tilt = requestAnimationFrame(renderTransform);
    };

    // --- INTERACCIÓN TILT ---
    const handlePointerMove = (e) => {
      if (animState.current.spin.active || animState.current.roar.active) return;

      const rect = wrapper.getBoundingClientRect();
      const relativeX = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      const relativeY = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);

      animState.current.tilt.x = relativeX * CONSTANTS.HERO_MAX_TILT * 2;
      animState.current.tilt.y = -relativeY * CONSTANTS.HERO_MAX_TILT * 2;
      scheduleRender();
    };

    const handlePointerLeave = () => {
      if (animState.current.spin.active || animState.current.roar.active) return;
      animState.current.tilt.x = 0;
      animState.current.tilt.y = 0;
      scheduleRender();
    };

    // --- LÓGICA DE RUGIDO ---
    const triggerRoar = () => {
      if (animState.current.spin.active || animState.current.roar.active) return;

      // Reproducir sonido
      if (heroAudioRef.current) {
        heroAudioRef.current.currentTime = 0;
        heroAudioRef.current.play().catch(() => { });
      }

      const start = performance.now();
      animState.current.roar.active = true;
      animState.current.tilt.x = 0;
      animState.current.tilt.y = 0;

      const animate = (time) => {
        const elapsed = time - start;
        const progress = clamp(elapsed / CONSTANTS.HERO_ROAR_DURATION_MS, 0, 1);

        if (progress < 1) {
          const intensity = 1 - progress;
          const wobble = Math.sin(progress * Math.PI * 4.5);
          const growth = Math.sin(progress * Math.PI);

          animState.current.roar.translateX = wobble * 10 * intensity;
          animState.current.roar.scale = 1 + (0.08 * growth);

          scheduleRender();
          animState.current.frames.roar = requestAnimationFrame(animate);
        } else {
          animState.current.roar = { translateX: 0, translateY: 0, scale: 1, active: false };
          scheduleRender();
        }
      };
      requestAnimationFrame(animate);
    };

    wrapper.addEventListener('pointermove', handlePointerMove);
    wrapper.addEventListener('pointerleave', handlePointerLeave);
    wrapper.addEventListener('click', triggerRoar);

    return () => {
      wrapper.removeEventListener('pointermove', handlePointerMove);
      wrapper.removeEventListener('pointerleave', handlePointerLeave);
      wrapper.removeEventListener('click', triggerRoar);
      cancelAnimationFrame(animState.current.frames.tilt);
      cancelAnimationFrame(animState.current.frames.roar);
    };
  }, []);

  return (
    <>
      <section
        className="landing-hero relative overflow-hidden bg-gray-50 dark:bg-poke-darkBg transition-colors duration-500"
        id="hero"
      >
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Hazte con todas... <span>¡Las mejores cartas!</span></h1>
            <p>El mercado más seguro para comprar y vender tus cartas...</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-primary">Explorar Cartas</button>
              <button className="btn btn-secondary">Empezar a Vender</button>
            </div>
          </div>
          <div className="hero-image">
            <div
              className="hero-tilt-wrapper"
              ref={heroTiltWrapperRef}
              style={{ cursor: 'pointer', perspective: '1000px' }}
            >
              <div className="hero-card" ref={heroCardRef} style={{ transformStyle: 'preserve-3d' }}>
                <img
                  src={theme === 'dark' ? CONSTANTS.HERO_DARK_IMAGE : CONSTANTS.HERO_LIGHT_IMAGE}
                  alt="Hero Card"
                  className="hero-card__face hero-card__face--front"
                  style={{ backfaceVisibility: 'hidden' }}
                />
                <img
                  src={CONSTANTS.HERO_BACK_IMAGE}
                  className="hero-card__face hero-card__face--back"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <audio ref={heroAudioRef} src="/assets/sounds/charizard.mp3" preload="auto" />
    </>
  );
};

export default HeroSection;