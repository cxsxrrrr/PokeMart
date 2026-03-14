import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { IconArrowLeft, IconFingerprint, IconEye, IconLock } from "@tabler/icons-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <IconFingerprint size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white">Política de Privacidad</h1>
              <p className="text-slate-500 dark:text-slate-400">Última actualización: 13 de marzo, 2026</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <IconEye size={20} className="text-cyan-500" /> ¿Qué información recolectamos?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Recopilamos información básica para el funcionamiento del servicio: nombre de usuario, correo electrónico, dirección de envío y preferencias de colección. No almacenamos datos de tarjetas de crédito directamente; utilizamos procesadores de pago seguros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <IconLock size={20} className="text-cyan-500" /> Protección de Datos
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Aplicamos medidas de seguridad físicas y electrónicas para evitar el acceso no autorizado a tu información. Tus datos personales nunca serán vendidos a terceros con fines comerciales.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold mb-2">Tus Derechos</h3>
                <p className="text-sm opacity-80 leading-relaxed">Puedes solicitar el acceso, corrección o eliminación de tus datos personales en cualquier momento desde tu panel de configuración.</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold mb-2">Cookies</h3>
                <p className="text-sm opacity-80 leading-relaxed">Utilizamos cookies esenciales para mantener tu sesión activa y recordar tus preferencias de visualización (como el modo oscuro).</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
