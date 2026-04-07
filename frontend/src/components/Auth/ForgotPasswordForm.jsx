import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Link as NextUILink } from "@heroui/react";
import { IconAlertCircle, IconLock, IconMail, IconX } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import "./ForgotPasswordForm.css";

export default function ForgotPasswordForm() {
  const PUBLIC_URL = process.env.PUBLIC_URL || "";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const { forgotPassword, resetPassword, loading, error, setError } = useAuth();

  useEffect(() => {
    setError(null);
  }, [setError]);

  const canReset = useMemo(() => {
    return email.trim() && otp.trim().length === 6 && newPassword.length >= 6 && confirmPassword.length >= 6;
  }, [email, otp, newPassword, confirmPassword]);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const requestOtp = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setIsInvalidEmail(true);
      return;
    }

    try {
      await forgotPassword(email.trim().toLowerCase());
      setActiveTab("reset");
      setSuccessMessage("Te enviamos un código OTP a tu correo. Revisa tu bandeja de entrada.");
    } catch (err) {
      console.error("Error solicitando OTP:", err);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await resetPassword(email.trim().toLowerCase(), otp.trim(), newPassword);
      setSuccessMessage("Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error("Error restableciendo contraseña:", err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative forgot-form-root">
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

        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/30 dark:bg-cyan-500/20 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-400/20 dark:bg-blue-600/20 blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 mt-14">
          <h2 className="text-5xl xl:text-6xl font-display font-black leading-[1.1] mb-4 text-white drop-shadow-md">
            Recupera tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 dark:from-cyan-300 dark:to-blue-400">
              Cuenta
            </span>
          </h2>
          <p className="text-lg text-violet-100/80 dark:text-slate-300 max-w-md font-medium leading-relaxed">
            Solicita un código OTP y actualiza tu contraseña en minutos, sin perder tu progreso de colección.
          </p>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center mt-8 perspective-[1000px]">
          <div className="relative w-full max-w-[340px] flex items-center justify-center">
            <div className="absolute inset-0 bg-violet-500/40 dark:bg-cyan-500/30 rounded-[30px] blur-[80px] transform"></div>
            <img
              src={`${PUBLIC_URL}/assets/cards/pikachupicasso.jpg`}
              alt="Carta Destacada"
              className="w-[90%] h-auto object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 premium-card-anim z-20"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/50 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[440px] relative z-10">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-cyan-400 mb-3">
              Recuperar contraseña
            </h1>
            <p className="text-slate-500 dark:text-cyan-100/70 text-base">
              ¿Recordaste tu contraseña? <NextUILink href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }} className="font-bold text-violet-700 dark:text-cyan-400 hover:text-violet-800 dark:hover:text-cyan-300 transition-colors">Iniciar sesión</NextUILink>
            </p>
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("request")}
              className={`w-1/2 rounded-lg py-2 text-sm font-bold transition-colors ${activeTab === "request" ? "bg-white dark:bg-slate-800 text-violet-700 dark:text-cyan-300 shadow" : "text-slate-500 dark:text-slate-400"}`}
            >
              Solicitar código
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reset")}
              className={`w-1/2 rounded-lg py-2 text-sm font-bold transition-colors ${activeTab === "reset" ? "bg-white dark:bg-slate-800 text-violet-700 dark:text-cyan-300 shadow" : "text-slate-500 dark:text-slate-400"}`}
            >
              Cambiar clave
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm font-medium">
              <IconAlertCircle size={20} />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg text-sm font-medium">
              <IconMail size={18} />
              {successMessage}
            </div>
          )}

          {activeTab === "request" ? (
            <form onSubmit={requestOtp} className="flex flex-col gap-5">
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
                  inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                  input: "text-slate-900 dark:text-cyan-50",
                }}
              />

              <Button
                type="submit"
                isLoading={loading}
                className="w-full font-display font-bold text-base h-14 rounded-xl mt-2 flex items-center justify-center gap-2 transition-all bg-violet-800 text-white hover:bg-violet-900 dark:bg-cyan-500 dark:text-slate-950"
                startContent={!loading && <IconMail size={18} />}
              >
                {loading ? "Enviando..." : "Enviar código OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitReset} className="flex flex-col gap-5">
              <Input
                isRequired
                type="email"
                label="Correo Electrónico"
                labelPlacement="outside"
                placeholder="tu@email.com"
                variant="bordered"
                radius="sm"
                value={email}
                onValueChange={setEmail}
                classNames={{
                  label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                  inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
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
                  inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                  input: "text-slate-900 dark:text-cyan-50 tracking-[0.35em] font-bold",
                }}
              />

              <Input
                isRequired
                type="password"
                label="Nueva contraseña"
                labelPlacement="outside"
                placeholder="Mínimo 6 caracteres"
                variant="bordered"
                radius="sm"
                value={newPassword}
                onValueChange={setNewPassword}
                classNames={{
                  label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                  inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                  input: "text-slate-900 dark:text-cyan-50",
                }}
              />

              <Input
                isRequired
                type="password"
                label="Confirmar contraseña"
                labelPlacement="outside"
                placeholder="Repite la contraseña"
                variant="bordered"
                radius="sm"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                classNames={{
                  label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                  inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                  input: "text-slate-900 dark:text-cyan-50",
                }}
              />

              <Button
                type="submit"
                isDisabled={!canReset}
                isLoading={loading}
                className="w-full font-display font-bold text-base h-14 rounded-xl mt-2 flex items-center justify-center gap-2 transition-all bg-violet-800 text-white hover:bg-violet-900 dark:bg-cyan-500 dark:text-slate-950"
                startContent={!loading && <IconLock size={18} />}
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </form>
          )}

          <div className="mt-10 text-center lg:text-left text-sm text-slate-400 dark:text-slate-500 font-medium">
            © 2026 PokéMart International. Secure ID.
          </div>
        </div>
      </div>
    </div>
  );
}
