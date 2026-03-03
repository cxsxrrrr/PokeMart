import {
  IconSearch,
  IconShieldCheck,
  IconTruck,
  IconCreditCard,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const STEPS = [
  { icon: IconSearch, title: "Encuentra tu carta", description: "Busca entre miles de cartas por nombre, set, tipo o rareza." },
  { icon: IconCreditCard, title: "Compra seguro", description: "Paga con tu método favorito. Todas las transacciones son cifradas." },
  { icon: IconShieldCheck, title: "Autenticidad garantizada", description: "Cada carta es verificada por expertos antes del envío." },
  { icon: IconTruck, title: "Recibe en tu puerta", description: "Envío protegido con seguimiento en tiempo real a todo el país." },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-black text-poke-dark uppercase tracking-wide">
            ¿Cómo funciona?
          </h2>
          <p className="text-muted-foreground mt-3">Comprar cartas nunca fue tan fácil.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-poke-dark/10 mb-5 mx-auto">
                <step.icon className="w-7 h-7 text-poke-dark" />
              </div>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-poke-dark/20 font-display">0{i + 1}</span>
              <h3 className="font-display font-bold text-poke-dark text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px] mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
