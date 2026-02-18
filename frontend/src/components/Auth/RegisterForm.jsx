import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar esto
import {
  Card,
  CardBody,
  Input,
  Button,
  Checkbox,
  Link,
  Switch // Si quieres poner el toggle de tema aquí, o usas un botón simple
} from "@heroui/react";
import { IconEye, IconEyeOff, IconBrandGoogle, IconPokeball, IconArrowLeft, IconSun, IconMoon } from "@tabler/icons-react";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsInvalid(true);
      return;
    }
    console.log("Registrando con:", email);
    navigate('/');
  };

  const goHome = () => navigate('/');

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-[#050510] transition-colors duration-500 overflow-hidden relative">

      {/* BOTÓN FLOTANTE PARA VOLVER (Esquina superior izquierda) */}
      <button 
        onClick={goHome}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all font-bold text-sm"
      >
        <IconArrowLeft size={18} />
        <span>Volver a la Tienda</span>
      </button>

      {/* =======================================================
          COLUMNA IZQUIERDA
         ======================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden bg-poke-darkBlue text-white">

        {/* Fondo con imagen o gradiente */}
        <div className="absolute inset-0 bg-[url('https://assets.pokemon.com/static2/_ui/img/chrome/body_bg.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-poke-red/80 to-poke-blue/90 mix-blend-multiply"></div>

        {/* Decoración flotante */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-poke-yellow rounded-full blur-[120px] opacity-20 animate-pulse"></div>

        {/* Contenido Izquierda */}
        <div className="relative z-10 mt-10">
            <h2 className="text-5xl font-black uppercase leading-tight tracking-tighter mb-4">
               Atrapalos <br/> <span className="text-poke-yellow">Todos</span>
            </h2>
            <p className="text-lg text-gray-200 max-w-md font-light">
               La tienda #1 para coleccionistas. Compra, vende e intercambia cartas verificadas con total seguridad.
            </p>
        </div>

        {/* Imagen Central (Charizard o Cartas) - Reemplaza src con lo que gustes */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
             {/* Usamos un placehoder visual atractivo o una imagen de carta flotando */}
             <div className="relative w-[300px] h-[420px] bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl rotate-[-6deg] hover:rotate-0 transition-all duration-500 group flex items-center justify-center">
                <div className="absolute inset-2 border border-white/10 rounded-lg"></div>
                <IconPokeball size={120} className="text-white/20 group-hover:text-poke-yellow/40 transition-colors" />
                <span className="absolute bottom-6 text-white/40 font-bold tracking-widest text-xs">PREMIUM TCG</span>
             </div>
        </div>

        <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
               <div className="flex -space-x-4">
                  <div className="w-10 h-10 rounded-full border-2 border-poke-darkBlue bg-gray-300"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-poke-darkBlue bg-gray-400"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-poke-darkBlue bg-white flex items-center justify-center font-bold text-poke-darkBlue text-xs">+2k</div>
               </div>
               <p className="font-bold text-sm">Entrenadores unidos hoy</p>
            </div>
        </div>
      </div>

      {/* =======================================================
          COLUMNA DERECHA (Formulario)
         ======================================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          
        {/* Decoración móvil (solo visible si no hay columna izquierda) */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-gradient-to-b from-poke-red/5 to-transparent pointer-events-none"></div>

        <div className="w-full max-w-[480px]">
            <div className="mb-8 text-center lg:text-left">
                <div className="inline-block p-3 bg-poke-yellow/10 rounded-2xl mb-4 lg:hidden">
                    <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" onError={(e) => e.target.style.display='none'}/>
                </div>
                <h1 className="text-4xl font-black text-poke-darkBlue dark:text-white mb-2 tracking-tight">Crea tu cuenta</h1>
                <p className="text-gray-500 dark:text-gray-400">¿Ya eres entrenador? <Link href="#" className="font-bold text-poke-red">Inicia sesión</Link></p>
            </div>

            <Card className="w-full shadow-none bg-transparent border-none">
                <CardBody className="p-0 overflow-visible"> 
                {/* overflow-visible para que la sombra del botón no se corte */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        isRequired
                        label="Nombre"
                        labelPlacement="outside"
                        placeholder="Ash"
                        variant="bordered"
                        radius="sm"
                        classNames={{
                           label: "font-semibold text-gray-700 dark:text-gray-300 group-data-[filled-within=true]:text-poke-darkBlue",
                           inputWrapper: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-poke-yellow focus-within:border-poke-blue dark:focus-within:border-poke-yellow h-12"
                        }}
                    />
                    <Input
                        isRequired
                        label="Apellido"
                        labelPlacement="outside"
                        placeholder="Ketchum"
                        variant="bordered"
                        radius="sm"
                        classNames={{
                           label: "font-semibold text-gray-700 dark:text-gray-300 group-data-[filled-within=true]:text-poke-darkBlue",
                           inputWrapper: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-poke-yellow focus-within:border-poke-blue dark:focus-within:border-poke-yellow h-12"
                        }}
                    />
                    </div>

                    <Input
                    isRequired
                    type="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="tu@email.com"
                    variant="bordered"
                    radius="sm"
                    isInvalid={isInvalid}
                    errorMessage={isInvalid && "Ingresa un correo válido"}
                    onValueChange={(v) => { setEmail(v); if(isInvalid) setIsInvalid(false); }}
                    classNames={{
                        label: "font-semibold text-gray-700 dark:text-gray-300 group-data-[filled-within=true]:text-poke-darkBlue",
                        inputWrapper: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-poke-yellow focus-within:border-poke-blue dark:focus-within:border-poke-yellow h-12"
                    }}
                    />

                    <Input
                    isRequired
                    label="Contraseña"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="sm"
                    placeholder="Mínimo 8 caracteres"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? <IconEyeOff className="text-xl text-gray-400" /> : <IconEye className="text-xl text-gray-400" />}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    classNames={{
                        label: "font-semibold text-gray-700 dark:text-gray-300 group-data-[filled-within=true]:text-poke-darkBlue",
                        inputWrapper: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-poke-yellow focus-within:border-poke-blue dark:focus-within:border-poke-yellow h-12"
                    }}
                    />

                    <Checkbox classNames={{ label: "text-small text-gray-600 dark:text-gray-400" }}>
                        Acepto los <Link href="#" size="sm" className="text-poke-blue dark:text-poke-yellow font-bold underline">Términos y Política de Privacidad</Link>
                    </Checkbox>

                    <Button
                    type="submit"
                    className="w-full font-bold text-lg bg-poke-red text-white shadow-lg shadow-poke-red/20 h-12 rounded-medium mt-2"
                    >
                    COMENZAR AVENTURA
                    </Button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">O regístrate con</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    <Button
                    variant="bordered"
                    startContent={<IconBrandGoogle />}
                    className="font-semibold border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 h-12 rounded-medium"
                    >
                    Google
                    </Button>
                </form>
                </CardBody>
            </Card>

            <div className="mt-8 text-center lg:text-left text-xs text-gray-400 font-medium">
                © 2026 PokéMart International. Secure ID.
            </div>
        </div>
      </div>
    </div>
  );
}