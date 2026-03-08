import { motion } from "framer-motion";
import { IconSparkles, IconArrowRight } from "@tabler/icons-react";
import hero from "../../assets/vekrom.png";
import heroLight from "../../assets/herodark2.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" id="hero">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* IMAGEN LIGHT (Gengar) */}
        <img
          src={heroLight}
          alt="Hero Background Light"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100 dark:opacity-0"
        />

        {/* IMAGEN DARK (Vekrom) */}
        <img
          src={hero}
          alt="Hero Background Dark"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-0 dark:opacity-100"
        />

        {/* --- Gradientes Overlay --- */}
        {/* 1. Gradiente Horizontal */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent sm:via-transparent transition-colors duration-1000" />
        {/* 2. Gradiente Vertical */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-colors duration-1000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-violet-500/30 dark:bg-cyan-400/30 blur-[1px]"
            style={{
              // Distribución dispersa por toda la pantalla usando matemáticas simples
              left: `${(i * 13) % 100}%`,
              top: `${(i * 19) % 100}%`,
              width: (i % 3) * 2 + 2,
              height: (i % 3) * 2 + 2,
            }}
            animate={{
              y: [-20 - (i % 10) * 2, 20 + (i % 10) * 2, -20 - (i % 10) * 2],
              x: [-10, 10, -10],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Violeta Gengar en Light / Cyan en Dark */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium mb-6 dark:bg-cyan-950/50 dark:border-cyan-500/30 dark:text-cyan-300">
              Nueva colección disponible
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-tight mb-6"
          >
            Tu destino para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-fuchsia-600 dark:from-cyan-300 dark:to-blue-600">
              cartas Pokémon
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            Compra, vende e intercambia las cartas más codiciadas del TCG.
            Autenticidad garantizada y envío seguro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            {/* CAMBIO: Botón Violeta Gengar (bg-violet-800) en Light para combinar con la imagen */}
            <a
              href="#popular"
              // Added: shadow-violet-500/50 and hover:shadow-violet-500/70 for Light Mode glow
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-violet-800 text-white hover:bg-violet-900 dark:bg-cyan-500 dark:text-slate-950 font-display font-bold text-base hover:brightness-110 transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] dark:shadow-[0_0_20px_rgba(6,182,212,0.5)] dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]"
            >
              Explorar cartas
              <IconArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#deals"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-base transition-all border bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100 dark:bg-slate-950/50 dark:text-cyan-100 dark:hover:bg-slate-900 dark:border-cyan-500/20"
            >
              Ver ofertas
            </a>
          </motion.div>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-8 mt-12"
          >
            {[
              { label: "Cartas", value: "10K+" },
              { label: "Clientes", value: "5K+" },
              { label: "Valoración", value: "4.9★" },
            ].map((stat) => (
              <div key={stat.label}>
                {/* NÚMEROS: Violeta en Light / Cyan en Dark */}
                <div className="text-2xl font-display font-bold text-violet-700 dark:text-cyan-400">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;