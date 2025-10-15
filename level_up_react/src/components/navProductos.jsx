import React from 'react';
import '../styles/components/navBarProductosStyles.css';

export default function NavbarProductos ({ onCategoryChange }) {
    const handleCategoryClick = (e, category) => {
        e.preventDefault();
        onCategoryChange(category);
    };

    const handleShowAll = (e) => { 
        e.preventDefault();
        onCategoryChange(null);
    };

    return (
        <nav className="navbar navbar-expand barProductos" data-bs-theme="dark">
            <div className="container productosBarGreen">
                <ul className="navbar-nav productosUl">

                    <li className="nav-item productosBtn">
                        <a className="nav-link productosBtnA" href="#" onClick={handleShowAll}>
                        Mostrar Todos
                        </a>
                    </li>
                
                    <li className="nav-item dropdown productosBtn">
                        <a className="nav-link dropdown-toggle productosBtnA" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Zona Gamer
                        </a>
                        <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Consolas")}>Consolas</a></li>
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Computadores Gamers")}>Computadores Gamer</a></li>
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Mouse")}>Mouse</a></li>
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Mousepad")}>MousePad</a></li>
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Sillas Gamers")}>Sillas Gamer</a></li>
                        </ul>
                    </li>

                    {/* Ropa y Personalizados */}
                    <li className="nav-item dropdown productosBtn">
                        <a className="nav-link dropdown-toggle productosBtnA" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Ropa y Personalizados
                        </a>
                        <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Poleras Personalizadas")}>Poleras Personalizadas</a></li>
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Polerones Gamers Personalizados")}>Polerones Gamer Personalizados</a></li>
                        </ul>
                    </li>

                    {/* Juegos y Accesorios */}
                    <li className="nav-item dropdown productosBtn">
                        <a className="nav-link dropdown-toggle productosBtnA" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Juegos y Accesorios
                        </a>
                        <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Accesorios")}>Accesorios</a></li>
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, "Juegos de Mesa")}>Juegos de Mesa</a></li>
                        </ul>
                    </li>

                    {/* Botón para mostrar todos los productos */}
                    
                </ul>
            </div>
        </nav>
    );
};
