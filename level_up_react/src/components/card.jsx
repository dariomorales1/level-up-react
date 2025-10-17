import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components/cardStyles.css';
import showToast from './toast.jsx';



export default function Card ({codigo, nombre, imgLink, descripcionCorta, precio} = {}) {
    const { dispatchCart } = useApp();
    const navigate = useNavigate();

    const CardClick = () => {
        navigate(`/producto.html?codigo=${codigo}`);
    };

    const AddToCart = (e) => {
    e.stopPropagation();
    
    // Crear objeto producto para el carrito
    const product = {
        id: codigo,
        name: nombre,
        price: precio,
        image: imgLink
        };
        
        dispatchCart({ type: 'ADD_TO_CART', payload: product });
        showToast("Se ha ingresado " + nombre + " al carrito");
    };

    return (
        <div className="card">
            <div className="linkCard" onClick={CardClick}>
                <img className="cardImg" src={imgLink}
                    alt={nombre}/>
                <div className="card-body cardContainer">
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text">{descripcionCorta}</p>
                    <p className="precio"><strong>Precio: $</strong>{precio}</p>
                </div>
            </div>
            <div className="cardFooter">
                <button className="btnAgregar" onClick={AddToCart}>Añadir al carrito</button>
            </div>
        </div>
        
    );
}