import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer_container">
                <div className="footer_top">
                    <div className="footer-col">
                        <div className="footer_brand">
                            <img 
                                src="/assets/icons/icono.png" 
                                alt="Level-Up Gamer" 
                                className="footer_logo" 
                            />
                        </div>

                        <p className="footer_label">Síguenos:</p>
                        <div className="social">
                            <a 
                                href="https://instagram.com/levelupgamer.cl" 
                                className="social_btn" 
                                aria-label="Instagram"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a 
                                href="https://facebook.com/levelupgamer.cl" 
                                className="social_btn" 
                                aria-label="Facebook"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a 
                                href="https://www.tiktok.com/search?q=levelupgamer" 
                                className="social_btn" 
                                aria-label="TikTok"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div className="footer-col">
                        <h4 className="heading">Sitios de interés</h4>
                        <ul className="links">
                            <li>
                                <Link to="/contacto">Contáctanos</Link>
                            </li>
                            <li>
                                <Link to="/garantia">Nuestras garantías</Link>
                            </li>
                            <li>
                                <Link to="/terminos">Términos y condiciones</Link>
                            </li>
                            <li>
                                <Link to="/blog">Blog</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="heading">Contáctenos</h4>
                        <ul className="contacto">
                            <li>
                                <a href="mailto:consultas@levelupgamer.cl">
                                    consultas@levelupgamer.cl
                                </a>
                            </li>
                            <li>
                                <a href="mailto:ventas@levelupgamer.cl">
                                    ventas@levelupgamer.cl
                                </a>
                            </li>
                            <li>
                                <a href="tel:+56999999999">
                                    +56 9 9999 9999
                                </a>
                            </li>
                            <li>Av. Vicuña Mackenna #4917, Local 1, San Joaquín.</li>
                            <li>Lun a Vie 10:00–18:30 • Sáb 10:00–14:00</li>
                            <li>Dom y Festivos cerrado.</li>
                        </ul>
                    </div>
                </div>

                <hr className="divider" />

                <div className="footer_bajo">
                    <div className="derechosreservados">
                        © Level-Up Gamer, 2025. Todos los derechos reservados.
                    </div>
                    <div className="pagos">
                        <img 
                            src="/assets/img/pagos/mercado-pago.png" 
                            alt="Mercado Pago" 
                        />
                        <img 
                            src="/assets/img/pagos/webpay.png" 
                            alt="WebPay" 
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;