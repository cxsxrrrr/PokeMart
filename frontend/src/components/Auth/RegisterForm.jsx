import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Checkbox, Link as NextUILink } from "@heroui/react";
import { IconEye, IconEyeOff, IconBrandGoogle, IconSparkles, IconX, IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import "./RegisterForm.css";

const AVATAR_OPTIONS = [
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",  // Pikachu
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",   // Bulbasaur
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",   // Charmander
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",   // Squirtle
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png", // Eevee
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",  // Gengar
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png", // Snorlax
];

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
  const [isInvalid, setIsInvalid] = useState(false);
  const { register, loading, error, setError } = useAuth();
 
  useEffect(() => {
    setError(null);
  }, [setError]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsInvalid(true);
      return;
    }
    if (password.length < 6 || !username.trim()) return;

    try {
      await register(username, email, password, avatarUrl);
      navigate('/login'); // mandamos a hacer login
    } catch (err) {
      console.error("Registro fallido:", err);
    }
  };

  const goHome = () => navigate('/');

  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative register-form-root">

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
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/30 dark:bg-cyan-500/20 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-400/20 dark:bg-blue-600/20 blur-[100px] pointer-events-none z-0"></div>

        {/* Contenido Izquierda (Top) */}
        <div className="relative z-10 mt-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-sm">
            <IconSparkles className="text-violet-300 dark:text-cyan-400" size={16} />
            <span className="text-xs font-bold tracking-widest uppercase text-violet-50 dark:text-cyan-50">Miles de Entrenadores</span>
          </div>
          <h2 className="text-5xl xl:text-6xl font-display font-black leading-[1.1] mb-4 text-white drop-shadow-md">
            Únete a la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 dark:from-cyan-300 dark:to-blue-400">
              Comunidad
            </span>
          </h2>
          <p className="text-lg text-violet-100/80 dark:text-slate-300 max-w-md font-medium leading-relaxed">
            La tienda #1 para coleccionistas. Compra, vende e intercambia cartas verificadas con total seguridad.
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

        {/* Prueba social / Stats */}
        <div className="relative z-10 flex items-center mt-8">
          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-violet-900 dark:border-slate-900 bg-violet-200 overflow-hidden"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" alt="user" className="w-full h-full object-contain scale-125" /></div>
              <div className="w-10 h-10 rounded-full border-2 border-violet-900 dark:border-slate-900 bg-fuchsia-200 overflow-hidden"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png" alt="user" className="w-full h-full object-contain scale-125" /></div>
              <div className="w-10 h-10 rounded-full border-2 border-violet-900 dark:border-slate-900 bg-white text-violet-900 font-bold flex items-center justify-center text-xs">+5k</div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white drop-shadow-sm">Usuarios Activos</span>
              <span className="text-xs text-violet-200 dark:text-slate-400">intercambiando hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          COLUMNA DERECHA
         ======================================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-50/50 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10">

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-cyan-400 mb-3 tracking-tight">Crea tu cuenta</h1>
            <p className="text-slate-500 dark:text-cyan-100/70 text-base">
              ¿Ya eres coleccionista? <NextUILink href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }} className="font-bold text-violet-700 dark:text-cyan-400 hover:text-violet-800 dark:hover:text-cyan-300 transition-colors">Inicia sesión</NextUILink>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm font-medium">
                <IconAlertCircle size={20} />
                {error}
              </div>
            )}

            <Input
              isRequired
              label="Nombre de Usuario"
              labelPlacement="outside"
              placeholder="Escribe un alias único"
              variant="bordered"
              radius="sm"
              onValueChange={setUsername}
              classNames={{
                label: "font-semibold text-slate-700 dark:text-cyan-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-900/50 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-cyan-50"
              }}
            />

            <Input
              isRequired
              type="email"
              label="Correo Electrónico"
              labelPlacement="outside"
              placeholder="tu@email.com"
              variant="bordered"
              radius="sm"
              isInvalid={isInvalid}
              errorMessage={isInvalid && "Ingresa un correo válido"}
              onValueChange={(v) => { setEmail(v); if (isInvalid) setIsInvalid(false); }}
              classNames={{
                label: "font-semibold text-slate-700 dark:text-slate-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-white"
              }}
            />

            <Input
              isRequired
              label="Contraseña"
              labelPlacement="outside"
              placeholder="Mínimo 8 caracteres"
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
                label: "font-semibold text-slate-700 dark:text-slate-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-white"
              }}
            />

            <div className="flex flex-col gap-2 mt-2">
              <label className="font-semibold text-slate-700 dark:text-cyan-300 text-sm">Escoge tu Avatar</label>
              <div className="flex gap-3 mt-1 flex-wrap">
                {AVATAR_OPTIONS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden bg-violet-100 dark:bg-slate-800 transition-all filter hover:brightness-110 ${
                      avatarUrl === url
                        ? "border-violet-600 dark:border-cyan-400 scale-110 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="Avatar option" className="w-full h-full object-cover scale-125" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-1">
              <Checkbox
                size="sm"
                classNames={{
                  wrapper: "group-data-[selected=true]:bg-violet-600 dark:group-data-[selected=true]:bg-cyan-400 after:bg-violet-600 dark:after:bg-cyan-400",
                  label: "text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed"
                }}
              >
                He leído y acepto los <NextUILink href="#" onClick={(e) => { e.preventDefault(); navigate("/terms"); }} size="sm" className="font-bold text-violet-700 dark:text-cyan-400 hover:underline">Términos</NextUILink> y <NextUILink href="#" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }} size="sm" className="font-bold text-violet-700 dark:text-cyan-400 hover:underline">Privacidad</NextUILink>
              </Checkbox>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full font-display font-bold text-base h-14 rounded-xl mt-3 flex items-center justify-center gap-2 transition-all 
                         bg-violet-800 text-white hover:bg-violet-900 shadow-[0_4px_14px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.4)]
                         dark:bg-cyan-500 dark:text-slate-950 dark:shadow-[0_4px_14px_rgba(6,182,212,0.3)] dark:hover:shadow-[0_6px_20px_rgba(6,182,212,0.4)]"
            >
              {loading ? "Creando..." : "Crear mi cuenta"}
            </Button>

          </form>

          <div className="mt-10 text-center lg:text-left text-sm text-slate-400 dark:text-slate-500 font-medium">
            © 2026 PokéMart International. Secure ID.
          </div>
        </div>
      </div>
    </div>
  );
}
