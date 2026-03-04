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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const HowItWorksSection = () => {
  return (
    <section className="how-it-works py-20 relative">
      <div className="container mx-auto px-4 relative">
        <motion.h2
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-poke-dark dark:!text-white"
        >
          ¿CÓMO FUNCIONA?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-16 text-muted-foreground dark:!text-white"
        >
          Comprar cartas nunca fue tan fácil.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article key={i} variants={itemVariants} className="text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-poke-dark/10 flex items-center justify-center dark:bg-white/10">
                  <Icon className="w-7 h-7 text-poke-dark dark:!text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-poke-dark dark:!text-white">
                  {step.title}
                </h3>

                <p className="text-base text-muted-foreground dark:!text-white">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
