import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Link as NextUILink } from "@heroui/react";
import { IconAlertCircle, IconCircleCheck, IconMail, IconX } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import "./VerifyEmailForm.css";

export default function VerifyEmailForm() {
  const PUBLIC_URL = process.env.PUBLIC_URL || "";
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { verifyEmail, resendVerificationCode, loading, error, setError } = useAuth();

  useEffect(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setIsInvalidEmail(true);
      return;
    }

    if (otp.trim().length < 6) {
      setError("Ingresa el código OTP de 6 dígitos.");
      return;
    }

    try {
      await verifyEmail(email.trim().toLowerCase(), otp.trim());
      setSuccessMessage("Correo validado correctamente. Redirigiendo...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      console.error("Error verificando correo:", err);
    }
  };

  const handleResendCode = async () => {
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setIsInvalidEmail(true);
      return;
    }

    try {
      await resendVerificationCode(email.trim().toLowerCase());
      setSuccessMessage("Te enviamos un nuevo código OTP al correo.");
      setCooldown(60);
    } catch (err) {
      console.error("Error reenviando OTP:", err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative verify-email-root">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-violet-200 dark:hover:border-cyan-800 hover:scale-105 transition-all text-slate-400 hover:text-violet-700 dark:hover:text-cyan-400 group"
        aria-label="Cerrar y volver a la tienda"
      >
        <IconX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden bg-violet-900 dark:bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://assets.pokemon.com/static2/_ui/img/chrome/body_bg.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-violet-950 dark:from-slate-950 to-transparent"></div>
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/30 dark:bg-cyan-500/20 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-400/20 dark:bg-blue-600/20 blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 mt-14">
          <h2 className="text-5xl xl:text-6xl font-display font-black leading-[1.1] mb-4 text-white drop-shadow-md">
            Verifica tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 dark:from-cyan-300 dark:to-blue-400">
              Correo
            </span>
          </h2>
          <p className="text-lg text-violet-100/80 dark:text-slate-300 max-w-md font-medium leading-relaxed">
            Te enviamos un código OTP para activar tu cuenta y habilitar el inicio de sesión.
          </p>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center mt-8 perspective-[1000px]">
          <div className="relative w-full max-w-[340px] flex items-center justify-center">
            <div className="absolute inset-0 bg-violet-500/40 dark:bg-cyan-500/30 rounded-[30px] blur-[80px] transform"></div>
            <img
              src={`${PUBLIC_URL}/assets/cards/zsv10pt5-161.png`}
              alt="Carta Destacada"
              className="w-[90%] h-auto object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 premium-card-anim z-20"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/50 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-cyan-400 mb-3">Activar cuenta</h1>
            <p className="text-slate-500 dark:text-cyan-100/70 text-base">
              ¿No recibiste el código? Revisa spam o vuelve a <NextUILink href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }} className="font-bold text-violet-700 dark:text-cyan-400 hover:text-violet-800 dark:hover:text-cyan-300 transition-colors">registrarte</NextUILink>.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm font-medium">
              <IconAlertCircle size={20} />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg text-sm font-medium">
              <IconCircleCheck size={20} />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              isRequired
              type="email"
              label="Correo Electrónico"
              labelPlacement="outside"
              placeholder="tu@email.com"
              variant="bordered"
              radius="sm"
              value={email}
              isInvalid={isInvalidEmail}
              errorMessage={isInvalidEmail && "Ingresa un correo válido"}
              onValueChange={(v) => {
                setEmail(v);
                if (isInvalidEmail) {
                  setIsInvalidEmail(false);
                }
              }}
              classNames={{
                label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-14 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-cyan-50",
              }}
            />

            <Input
              isRequired
              type="text"
              label="Código OTP"
              labelPlacement="outside"
              placeholder="000000"
              variant="bordered"
              radius="sm"
              value={otp}
              onValueChange={setOtp}
              classNames={{
                label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-14 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-cyan-50 tracking-[0.35em] font-bold",
              }}
              endContent={<IconMail className="text-slate-400" size={18} />}
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full font-display font-bold text-base h-14 rounded-xl mt-2 flex items-center justify-center gap-2 transition-all bg-violet-800 text-white hover:bg-violet-900 dark:bg-cyan-500 dark:text-slate-950"
              startContent={!loading && <IconCircleCheck size={18} />}
            >
              {loading ? "Validando..." : "Validar correo"}
            </Button>
          </form>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={loading || cooldown > 0}
            className="mt-4 w-full font-display font-bold text-sm h-12 rounded-xl border border-violet-300 dark:border-cyan-700 text-violet-700 dark:text-cyan-300 hover:bg-violet-50 dark:hover:bg-cyan-900/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Reenviar código en ${cooldown}s` : "Reenviar código"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-cyan-300 hover:underline"
          >
            <IconMail size={16} />
            Ya validé mi correo, ir al login
          </button>

          <div className="mt-10 text-center lg:text-left text-sm text-slate-400 dark:text-slate-500 font-medium">
            © 2026 PokéMart International. Secure ID.
          </div>
        </div>
      </div>
    </div>
  );
}
