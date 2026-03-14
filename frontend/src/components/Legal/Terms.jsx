import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { IconArrowLeft, IconScale, IconShieldCheck, IconAlertCircle } from "@tabler/icons-react";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <IconScale size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white">Términos y Condiciones</h1>
              <p className="text-slate-500 dark:text-slate-400">Última actualización: 13 de marzo, 2026</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                1. Aceptación de los Términos
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Al acceder y utilizar PokéMart, aceptas cumplir y estar sujeto a los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                2. Uso del Mercado
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                PokéMart es una plataforma tecnológica que facilita el intercambio de cartas coleccionables. Los usuarios son responsables de la veracidad de sus anuncios y de la calidad de los productos ofrecidos.
              </p>
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
                <IconAlertCircle className="text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Queda estrictamente prohibida la venta de reproducciones o cartas falsificadas. El incumplimiento de esta norma resultará en la suspensión inmediata de la cuenta.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                3. Tarifas y Pagos
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nuestra plataforma cobra una comisión por cada transacción exitosa para mantener la infraestructura y seguridad. Todas las tarifas se mostrarán claramente antes de finalizar cualquier operación.
              </p>
            </section>

            <section className="p-8 bg-violet-600 rounded-2xl text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <IconShieldCheck /> Seguridad Garantizada
              </h2>
              <p className="opacity-90">
                Utilizamos sistemas de encriptación de última generación para proteger tus datos y transacciones. Tu seguridad es nuestra prioridad número uno.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
