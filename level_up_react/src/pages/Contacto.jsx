import React from 'react';
import '../styles/pages/contactoStyles.css';

const Contacto = () => {
  return (
    <div className="container-xxl mt-4">
      <hr />
      <h1 className="titulo mb-4">Contacto</h1>
      <hr />

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-lg-4">
          <aside className="contacto-info h-100">
            <h2 className="contacto-info_titulo">Información de contacto</h2>

            <ul className="contacto-info_lista">
              <li>
                <i className="fa-solid fa-envelope"></i>{" "}
                <a href="mailto:consultas@levelupgamer.cl">
                  consultas@levelupgamer.cl
                </a>
              </li>
              <li>
                <i className="fa-solid fa-envelope-open-text"></i>{" "}
                <a href="mailto:ventas@levelupgamer.cl">
                  ventas@levelupgamer.cl
                </a>
              </li>
              <li>
                <i className="fa-brands fa-whatsapp"></i>{" "}
                <a
                  href="https://wa.me/56999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +56 9 9999 9999
                </a>
              </li>
              <li>
                <i className="fa-solid fa-location-dot"></i> Av. Vicuña Mackenna
                #4917, Local 1, San Joaquín.
              </li>
              <li>
                <i className="fa-regular fa-clock"></i> Lunes a Viernes de 10:00
                a 18:30. Sábados 10:00 a 14:00. Domingos y festivos cerrados.
              </li>
            </ul>

            <div className="contacto-info_social">
              <p className="mb-2">Síguenos</p>
              <a
                className="btn btn-sm btn-outline-light me-2"
                href="https://instagram.com/levelupgamer.cl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram"></i> levelupgamer.cl
              </a>
              <a
                className="btn btn-sm btn-outline-light"
                href="https://levelupgamer.cl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-globe"></i> levelupgamer.cl
              </a>
            </div>
          </aside>
        </div>

        <div className="col-12 col-lg-8">
          <section className="contacto-form h-100">
            <form id="contactoForm" noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Tu nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Ej: Daniel Gamer"
                  required
                />
                <div className="invalid-feedback">Ingresa tu nombre.</div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Tu correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
                <div className="invalid-feedback">
                  Ingresa un correo válido.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Asunto
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  name="subject"
                  placeholder="Consulta, cotización, soporte..."
                  required
                />
                <div className="invalid-feedback">Ingresa el asunto.</div>
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Tu mensaje
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Cuéntanos en qué te ayudamos"
                  required
                ></textarea>
                <div className="invalid-feedback">Escribe tu mensaje.</div>
              </div>

              <button className="btn btn-contacto" type="submit">
                <i className="fa-regular fa-paper-plane me-1"></i> Enviar
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};


export default Contacto;
