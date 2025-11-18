import React from 'react';
import '../styles/components/navBarProductosStyles.css';

export default function NavbarProductos ({ onCategoryChange }) {
    const handleCategoryClick = (e, category) => {
        e.preventDefault();
        onCategoryChange(category);
    };

    const handleShowAll = (e) => { 
        e.preventDefault();
        onCategoryChange('todos');
    };

    return (
        <nav className="navbar navbar-expand barProductos" data-bs-theme="dark">
            <div className="container productosBarGreen">
                <ul className="navbar-nav productosUl">

                    <li className="nav-item productosBtn">
                        <button className="nav-link productosBtnA" type="button" onClick={handleShowAll}>
                        Mostrar Todos
                        </button>
                    </li>
                
                    <li className="nav-item dropdown productosBtn">
                        <button className="nav-link dropdown-toggle productosBtnA" type="button" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Zona Gamer
                            </button>
                        <ul className="dropdown-menu">
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Consolas")}>Consolas</button></li>
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Computadores Gamers")}>Computadores Gamer</button></li>
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Mouse")}>Mouse</button></li>
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Mousepad")}>MousePad</button></li>
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Sillas Gamers")}>Sillas Gamer</button></li>
                        </ul>
                    </li>

                    {/* Ropa y Personalizados */}
                    <li className="nav-item dropdown productosBtn">
                        <button className="nav-link dropdown-toggle productosBtnA" type="button" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Ropa y Personalizados
                            </button>
                        <ul className="dropdown-menu">
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Poleras Personalizadas")}>Poleras Personalizadas</button></li>
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Polerones Gamers Personalizados")}>Polerones Gamer Personalizados</button></li>
                        </ul>
                    </li>

                    {/* Juegos y Accesorios */}
                    <li className="nav-item dropdown productosBtn">
                        <button className="nav-link dropdown-toggle productosBtnA" type="button" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Juegos y Accesorios
                            </button>
                        <ul className="dropdown-menu">
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Accesorios")}>Accesorios</button></li>
                        <li><button className="dropdown-item" type="button" onClick={(e) => handleCategoryClick(e, "Juegos de Mesa")}>Juegos de Mesa</button></li>
                        </ul>
                    </li>

                    {/* Botón para mostrar todos los productos */}
                    
                </ul>
            </div>
        </nav>
    );
};
