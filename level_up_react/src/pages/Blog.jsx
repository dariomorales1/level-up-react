import React from "react";  
import '../styles/pages/blogStyles.css';



const Blog = () => {
  return (
    <div className="container-xxl blog mt-4">
      <header className="blog__header text-center">
        <hr />
        <h1 className="titulo mb-1">Blog Noticias 2025</h1>
        <hr />
        <p className="text-muted mb-0">
          Actualizado: <span id="lastUpdate"></span>
        </p>
      </header>

      <section className="blog__list mt-4">
        {/* === Artículo 1 === */}
        <article className="blog-card">
          <h2 className="blog-card__title">
            Acer presenta hardware gamer y monitor OLED de hasta 720Hz
          </h2>
          <p className="blog-card__meta">
            IFA 2025 · Monitores y PCs ·{" "}
            <a
              className="blog-card__source"
              href="https://hothardware.com/news/acer-unveils-high-octane-nitro-and-predator-gaming-pcs-720hz-oled-monitor"
              target="_blank"
              rel="noopener noreferrer"
            >
              HotHardware
            </a>
          </p>
          <p>
            Acer renovó sus líneas <strong>Nitro</strong> y{" "}
            <strong>Predator</strong> y mostró un monitor OLED con tasa de
            refresco de <strong>hasta 720Hz</strong>, pensado para e-sports.
            La gama incluye laptops, desktops y monitores con HDMI 2.1.
          </p>
          <p className="blog-card__why">
            <strong>¿Por qué importa?</strong> Nuevo stock atractivo para vitrina
            gamer (monitores rápidos y equipos listos para 1440p/4K).
          </p>
        </article>

        {/* === Artículo 2 === */}
        <article className="blog-card">
          <h2 className="blog-card__title">
            Bajan precios en GPUs RTX 50: ofertas bajo MSRP
          </h2>
          <p className="blog-card__meta">
            GPUs ·{" "}
            <a
              className="blog-card__source"
              href="https://hothardware.com/news/geforce-rtx-5070-deal-below-msrp"
              target="_blank"
              rel="noopener noreferrer"
            >
              HotHardware
            </a>
          </p>
          <p>
            Ya se ven ofertas que dejan a <strong>GeForce RTX 5070/5070 Ti</strong>{" "}
            por <strong>debajo del MSRP</strong>, señal de mayor disponibilidad y
            competencia en la gama media-alta.
          </p>
          <p className="blog-card__why">
            <strong>¿Por qué importa?</strong> Buen momento para combos PC + monitor
            1440p y upgrades de clientes.
          </p>
        </article>

        {/* === Artículo 3 === */}
        <article className="blog-card">
          <h2 className="blog-card__title">
            MSI dice que el burn-in en sus OLED es “prácticamente nulo”
          </h2>
          <p className="blog-card__meta">
            Monitores ·{" "}
            <a
              className="blog-card__source"
              href="https://www.pcgamer.com/hardware/gaming-monitors/after-running-an-oled-monitor-for-533-days-seven-hours-and-22-minutes-straight-msi-claims-the-effects-of-burn-in-on-its-displays-are-basically-none/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PC Gamer
            </a>
          </p>
          <p>
            Tras <strong>533 días</strong> de uso continuo en pruebas, MSI reporta{" "}
            <strong>mínimo burn-in</strong> en sus modelos OLED, siempre que se
            respeten los ciclos de mantenimiento del panel.
          </p>
          <p className="blog-card__why">
            <strong>¿Por qué importa?</strong> Más confianza para recomendar{" "}
            <strong>OLED</strong> a gamers que dudan por retenciones.
          </p>
        </article>

        {/* === Artículo 4 === */}
        <article className="blog-card">
          <h2 className="blog-card__title">
            Silksong tendrá upgrade gratis a Switch 2
          </h2>
          <p className="blog-card__meta">
            Nintendo ·{" "}
            <a
              className="blog-card__source"
              href="https://nintendowire.com/news/2025/09/03/hollow-knight-silksong-will-have-a-free-upgrade-pack-for-switch-2/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NintendoWire
            </a>
          </p>
          <p>
            <strong>Team Cherry</strong> confirmó que{" "}
            <strong>Hollow Knight: Silksong</strong> ofrecerá actualización gratuita
            a la versión nativa de <strong>Switch 2</strong> para quienes compren el
            juego en Switch.
          </p>
          <p className="blog-card__why">
            <strong>¿Por qué importa?</strong> Argumento de venta para clientes que
            piensan migrar a la próxima consola.
          </p>
        </article>

        {/* === Artículo 5 === */}
        <article className="blog-card">
          <h2 className="blog-card__title">
            Las consolas actuales están “históricamente caras”
          </h2>
          <p className="blog-card__meta">
            Mercado ·{" "}
            <a
              className="blog-card__source"
              href="https://arstechnica.com/gaming/2025/08/todays-game-consoles-are-historically-overpriced/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ars Technica
            </a>
          </p>
          <p>
            Un análisis histórico muestra que{" "}
            <strong>las consolas 2025 cuestan más</strong> que lo esperado por
            tendencia de décadas, con recortes de precio más tardíos.
          </p>
          <p className="blog-card__why">
            <strong>¿Por qué importa?</strong> Útil para explicar diferencias de
            precio y empujar <strong>bundles</strong> o reacondicionados.
          </p>
        </article>
      </section>
    </div>
  );
};

export default Blog;
