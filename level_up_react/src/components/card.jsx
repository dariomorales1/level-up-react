import React from 'react';
import '../styles/components/cardStyles.css';
import { showToast } from './toast';

export default function Card ({nombre, imgLink, descripcionCorta, precio} = {}) {
    return (
        <div className="card">
            <div className="linkCard">
                <img className="cardImg" src={imgLink}
                    alt={nombre}/>
                <div className="card-body cardContainer">
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text">{descripcionCorta}</p>
                    <p className="precio"><strong>Precio: $</strong>{precio}</p>
                </div>
            </div>
            <div className="cardFooter">
                <button className="btnAgregar" onClick={() => showToast("Se ha ingresado " + nombre + " al carrito")}>Añadir al carrito</button>
            </div>
        </div>
        
    );
}