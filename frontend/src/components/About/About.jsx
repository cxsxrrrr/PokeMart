import { IconShieldCheck, IconTruckDelivery, IconUsers, IconCards, IconStarFilled, IconMapPin, IconMail } from "@tabler/icons-react";

const stats = [
    { value: "10K+", label: "Cartas disponibles" },
    { value: "5K+", label: "Clientes satisfechos" },
    { value: "4.9★", label: "Valoración promedio" },
    { value: "24h", label: "Tiempo de envío" },
];

const values = [
    {
        icon: IconShieldCheck,
        title: "Autenticidad Garantizada",
        description: "Cada carta pasa por un proceso de verificación riguroso para asegurar su originalidad y condición.",
    },
    {
        icon: IconTruckDelivery,
        title: "Envío Seguro",
        description: "Embalaje especializado con protección premium para que tus cartas lleguen en perfecto estado.",
    },
    {
        icon: IconUsers,
        title: "Comunidad Activa",
        description: "Únete a miles de coleccionistas y entrenadores que compran, venden e intercambian diariamente.",
    },
    {
        icon: IconCards,
        title: "Catálogo Extenso",
        description: "Desde las ediciones clásicas hasta las más recientes, tenemos lo que buscas.",
    },
];

const team = [
    { name: "Valentina Moran", role: "CEO & Fundadora", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
    { name: "Cesar Moran", role: "CTO & Co-Fundador", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { name: "Camila Polo", role: "Diseño UX", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
    { name: "Raul Martinez", role: "Logística & Envíos", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" },
    { name: "Jose Jimenez", role: "Verificación & QA", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" },
];

const cardStyle = "bg-white dark:bg-[#17233f] rounded-2xl shadow-md border border-gray-200/30 dark:border-[#233252]";

const About = () => {
    return (
        <div>

            {/* Hero Section */}
            <section className="text-center px-6 pt-20 pb-16 rounded-b-[32px] bg-gradient-to-br from-violet-600/[0.08] to-cyan-500/[0.06] dark:from-violet-600/[0.15] dark:to-cyan-500/[0.1]">
                <p className="inline-block bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-5 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wide">
                    SOBRE NOSOTROS
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white leading-tight mb-5">
                    Tu destino para
                    <br />
                    <span className="text-violet-600 dark:text-cyan-400">cartas Pokémon TCG</span>
                </h1>
                <p className="max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    En <strong className="text-gray-800 dark:text-white">PokéMart TCG</strong> conectamos coleccionistas y entrenadores de todo el mundo.
                    Compra, vende e intercambia cartas con total confianza y seguridad.
                </p>
            </section>

            {/* Stats */}
            <section className="container mx-auto px-5" style={{ paddingTop: 80, paddingBottom: 80 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`${cardStyle} p-6`}>
                            <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent mb-1">
                                {stat.value}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Nuestros Valores */}
            <section className="container mx-auto px-5" style={{ paddingTop: 40, paddingBottom: 80 }}>
                <h2 className="section-title flex justify-center dark:text-cyan-400" style={{ marginBottom: 40 }}>
                    Nuestros Valores
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((item) => (
                        <div
                            key={item.title}
                            className={`${cardStyle} p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-600/10 dark:hover:shadow-cyan-500/10`}
                        >
                            <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-violet-600/10 to-cyan-500/10 dark:from-violet-600/20 dark:to-cyan-500/20 flex items-center justify-center mb-4">
                                <item.icon size={26} stroke={1.8} className="text-violet-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="font-extrabold text-lg text-gray-800 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[0.95rem]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Nuestro Equipo */}
            <section className="py-16 px-6 bg-gradient-to-br from-violet-600/[0.05] to-cyan-500/[0.04] dark:from-violet-600/[0.1] dark:to-cyan-500/[0.08]">
                <div className="container mx-auto">
                    <h2 className="section-title flex justify-center mb-10 dark:text-cyan-400">
                        Nuestro Equipo
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                        {team.map((member) => (
                            <div key={member.name} className={`${cardStyle} p-6 text-center`}>
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-violet-600/10 to-cyan-500/10 dark:from-violet-600/20 dark:to-cyan-500/20 p-2 mx-auto mb-4 block"
                                />
                                <h3 className="font-extrabold text-[1.05rem] text-gray-800 dark:text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-violet-600 dark:text-cyan-400 font-semibold text-sm">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Misión */}
            <section className="container mx-auto px-5 pt-10 pb-12">
                <div className="relative max-w-4xl mx-auto">
                    {/* Glow effect behind */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 blur-2xl opacity-20 dark:opacity-30 rounded-[3rem] -z-10 animate-pulse" />
                    
                    <div className="bg-white/80 dark:bg-[#0f1424]/80 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-violet-500/10 dark:hover:shadow-cyan-500/10 hover:-translate-y-1">
                        
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 dark:bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-[#16213b] dark:to-[#0f1424] border border-violet-200 dark:border-cyan-500/20 rounded-2xl shadow-inner mb-8 group-hover:scale-110 transition-transform duration-500">
                            <IconStarFilled size={36} className="text-yellow-400 drop-shadow-md" />
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            Nuestra Misión
                        </h2>
                        <p className="max-w-2xl mx-auto text-[1.1rem] md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Ser la plataforma líder en compra y venta de cartas Pokémon TCG en Latinoamérica,
                            brindando una experiencia segura, confiable y accesible para todos los amantes del coleccionismo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contacto */}
            <section className="container mx-auto px-5 pt-8 pb-24">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="section-title flex justify-center mb-10 dark:text-cyan-400">
                        Contáctanos
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <div className="flex items-center gap-5 bg-white dark:bg-[#17233f] px-8 py-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#233252] transition-colors hover:border-violet-300 dark:hover:border-cyan-500/50">
                            <div className="w-14 h-14 bg-violet-100 dark:bg-cyan-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <IconMapPin size={26} className="text-violet-600 dark:text-cyan-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs tracking-wider text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Ubicación</p>
                                <p className="text-gray-800 dark:text-white font-extrabold text-[1.1rem]">Maracaibo, Venezuela</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 bg-white dark:bg-[#17233f] px-8 py-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#233252] transition-colors hover:border-violet-300 dark:hover:border-cyan-500/50">
                            <div className="w-14 h-14 bg-violet-100 dark:bg-cyan-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <IconMail size={26} className="text-violet-600 dark:text-cyan-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs tracking-wider text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Correo</p>
                                <p className="text-gray-800 dark:text-white font-extrabold text-[1.1rem]">contacto@pokemart.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
