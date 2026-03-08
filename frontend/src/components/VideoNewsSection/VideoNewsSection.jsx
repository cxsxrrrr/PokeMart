import { useState } from "react";
import "./VideoNewsSection.css";
import pikachugif from "../../assets/pikachu-gif.gif";
import pokeball from "../../assets/pokeball.gif";
import newpokemon from "../../assets/pokemon-wind-wave.webp";

const fallbackVideos = [
  {
    id: "pokemon-news-1",
    title: "Nuevos Pokémon iniciales",
    description: "Primer vistazo a los nuevos compañeros de aventura: carisma, personalidad y una región tropical que promete exploración desde el minuto uno.",
    source: "Canal Oficial Pokémon",
    publishedAt: "Nuevo",
    previewWebp: newpokemon,
    previewGif: newpokemon,
  },
  {
    id: "pokemon-news-2",
    title: "Momento Pikachu",
    description: "Un clip corto y nostálgico de Pikachu para abrir la sección de noticias con energía clásica y mantener la Home más viva.",
    source: "Pokémon Highlights",
    publishedAt: "Reciente",
    previewGif: pikachugif,
  },
  {
    id: "pokemon-news-3",
    title: "Gameplay reveal",
    description: "Mecánicas nuevas, mundo abierto y más.",
    source: "Nintendo / Pokémon",
    publishedAt: "Reciente",
    previewGif: pokeball,
  },
];

const VideoNewsSection = ({ videos = fallbackVideos }) => {
  return (
    <section className="popular-section video-news-section py-16">
      <div className="container mx-auto px-4">
        <div className="video-news-header">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-poke-darkBlue dark:text-white uppercase tracking-wider">
            <span className="dark:text-poke-yellow">Anuncios oficiales</span>
          </h2>
        </div>

        <div className="video-news-grid">
          {videos.map((video) => (
            <article className="video-news-card" key={video.id}>
              <div className="video-frame-wrap">
                {video.previewGif ? (
                  <picture>
                    {video.previewWebp ? (
                      <source srcSet={video.previewWebp} type="image/webp" />
                    ) : null}
                    <img
                      src={video.previewGif}
                      alt={video.title}
                      className="video-gif-preview"
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="video-news-meta">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoNewsSection;