import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Checkbox, Link as NextUILink } from "@heroui/react";
import { IconEye, IconEyeOff, IconBrandGoogle, IconSparkles, IconX, IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 1) return;

    try {
      await login(username, password);
      // login exitoso
      navigate('/');
    } catch (err) {
      console.error("Login fallido:", err);
    }
  };

  const goHome = () => navigate('/');

  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative login-form-root">

      {/* BOTON DE CERRAR (Top Right) */}
      <button
        onClick={goHome}
        className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-violet-200 dark:hover:border-cyan-800 hover:scale-105 transition-all text-slate-400 hover:text-violet-700 dark:hover:text-cyan-400 group"
        aria-label="Cerrar y volver a la tienda"
      >
        <IconX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* =======================================================
          COLUMNA IZQUIERDA (Visuales)
         ======================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden bg-violet-900 dark:bg-slate-900">

        {/* Imagen de fondo / Capa de textura */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://assets.pokemon.com/static2/_ui/img/chrome/body_bg.png')] opacity-20 mix-blend-overlay"></div>
          {/* Gradiente oscuro superior para legibilidad */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent"></div>
          {/* Gradiente oscuro inferior */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-violet-950 dark:from-slate-950 to-transparent"></div>
        </div>

        {/* Luces direccionales tipo Hero (Violeta/Cyan) */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/30 dark:bg-cyan-500/20 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-400/20 dark:bg-blue-600/20 blur-[100px] pointer-events-none z-0"></div>

        {/* Contenido Izquierda (Top) */}
        <div className="relative z-10 mt-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-sm">
            <IconSparkles className="text-violet-300 dark:text-cyan-400" size={16} />
            <span className="text-xs font-bold tracking-widest uppercase text-violet-50 dark:text-cyan-50">Bienvenido de nuevo</span>
          </div>
          <h2 className="text-5xl xl:text-6xl font-display font-black leading-[1.1] mb-4 text-white drop-shadow-md">
            Continuemos tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 dark:from-cyan-300 dark:to-blue-400">
              Aventura
            </span>
          </h2>
          <p className="text-lg text-violet-100/80 dark:text-slate-300 max-w-md font-medium leading-relaxed">
            Accede a nuevas colecciones, revisa tus pedidos y descubre nuevas cartas épicas en nuestra tienda.
          </p>
        </div>

        {/* Imagen Central Flotante */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8 perspective-[1000px]">
          <div className="relative w-full max-w-[340px] flex items-center justify-center">
            {/* Glow detrás de la carta */}
            <div className="absolute inset-0 bg-violet-500/40 dark:bg-cyan-500/30 rounded-[30px] blur-[80px] transform"></div>
            
            {/* Imagen Light Mode */}
            <img
              src="/assets/cards/zsv10pt5-161.png"
              alt="Carta Destacada"
              className="block dark:hidden w-[90%] h-auto object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/30 premium-card-anim z-20"
              onError={(e) => { e.target.src = "/assets/cards/pikachupicasso.jpg"; }}
            />

            {/* Imagen Dark Mode */}
            <img
              src="/assets/cards/pikachupicasso.jpg"
              alt="Carta Destacada Oscura"
              className="hidden dark:block w-[90%] h-auto object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 premium-card-anim z-20"
            />
          </div>
        </div>

      </div>

      {/* =======================================================
          COLUMNA DERECHA (Formulario Limpio)
         ======================================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">

        {/* Decoración sutil en bg */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/50 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10">

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-cyan-400 mb-3">Iniciar Sesión</h1>
            <p className="text-slate-500 dark:text-cyan-100/70 text-base">
              ¿No tienes cuenta? <NextUILink href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }} className="font-bold text-violet-700 dark:text-cyan-400 hover:text-violet-800 dark:hover:text-cyan-300 transition-colors">Regístrate aquí</NextUILink>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {error && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm font-medium">
                <IconAlertCircle size={20} />
                {error}
              </div>
            )}

            <Input
              isRequired
              type="text"
              label="Nombre de Usuario"
              labelPlacement="outside"
              placeholder="Ej. trainer_ash"
              variant="bordered"
              radius="sm"
              onValueChange={setUsername}
              classNames={{
                label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-14 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-cyan-50"
              }}
            />

            <Input
              isRequired
              label="Contraseña"
              labelPlacement="outside"
              placeholder="********"
              variant="bordered"
              radius="sm"
              endContent={
                <button className="focus:outline-none p-2" type="button" onClick={toggleVisibility}>
                  {isVisible ? <IconEyeOff className="text-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" /> : <IconEye className="text-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />}
                </button>
              }
              type={isVisible ? "text" : "password"}
              onValueChange={setPassword}
              classNames={{
                label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-14 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-cyan-50"
              }}
            />

            <div className="flex justify-between items-center mt-2">
              <Checkbox
                size="sm"
                classNames={{
                  label: "text-sm text-slate-600 dark:text-slate-400 font-medium"
                }}
              >
                Recordarme
              </Checkbox>
              <NextUILink href="#" className="text-sm font-semibold text-violet-700 dark:text-cyan-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </NextUILink>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full font-display font-bold text-base h-14 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all 
                         bg-violet-800 text-white hover:bg-violet-900 shadow-[0_4px_14px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.4)]
                         dark:bg-cyan-500 dark:text-slate-950 dark:shadow-[0_4px_14px_rgba(6,182,212,0.3)] dark:hover:shadow-[0_6px_20px_rgba(6,182,212,0.4)]"
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                O INICIA CON
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <Button
              variant="bordered"
              startContent={<IconBrandGoogle className="text-slate-700 dark:text-slate-300" />}
              className="font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 h-14 rounded-xl shadow-sm transition-colors"
            >
              Continuar con Google
            </Button>
          </form>

          <div className="mt-12 text-center lg:text-left text-sm text-slate-400 dark:text-slate-500 font-medium">
            © 2026 PokéMart International. Secure ID.
          </div>
        </div>
      </div>
    </div>
  );
}


