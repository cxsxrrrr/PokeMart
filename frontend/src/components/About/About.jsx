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
    { name: "Camila Polo", role: "Diseño & UX", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
    { name: "Raul Martinez", role: "Logística & Envíos", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" },
    { name: "Jose Jimenez", role: "Verificación & QA", avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" },
];

const cardStyle = "bg-white dark:bg-[#17233f] rounded-2xl shadow-md border border-gray-200/30 dark:border-[#233252]";

const About = () => {
    return (
        <div className="pt-12">

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
                <h2 className="section-title flex justify-center" style={{ marginBottom: 40 }}>
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
                    <h2 className="section-title flex justify-center mb-10">
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
            <section className="container mx-auto px-5 py-16">
                <div className="bg-gradient-to-br from-[#141f41] to-[#1b2fb5] dark:from-[#0d1533] dark:to-[#152299] rounded-2xl p-12 md:p-16 text-center text-white">
                    <IconStarFilled size={36} className="text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-4">
                        Nuestra Misión
                    </h2>
                    <p className="max-w-xl mx-auto text-[1.05rem] leading-relaxed opacity-90">
                        Ser la plataforma líder en compra y venta de cartas Pokémon TCG en Latinoamérica,
                        brindando una experiencia segura, confiable y accesible para todos los amantes del coleccionismo.
                    </p>
                </div>
            </section>

            {/* Contacto */}
            <section className="container mx-auto px-5 pt-4 pb-20">
                <h2 className="section-title flex justify-center mb-10">
                    Contáctanos
                </h2>
                <div className="flex justify-center gap-8 flex-wrap">
                    <div className="flex items-center gap-2.5">
                        <IconMapPin size={22} className="text-violet-600 dark:text-cyan-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-semibold">Maracaibo, Venezuela</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <IconMail size={22} className="text-violet-600 dark:text-cyan-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-semibold">contacto@pokemart-tcg.com</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
