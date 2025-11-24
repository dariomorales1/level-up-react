import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/components/cardStyles.css';
import showToast from './toast.jsx';

export default function Card({ codigo, nombre, imgLink, descripcionCorta, precio } = {}) {
    const { addToCart, loading } = useCart();
    const navigate = useNavigate();

    const CardClick = () => {
        navigate(`/producto.html?codigo=${codigo}`);
    };

    const AddToCart = async (e) => {
        e.stopPropagation();
        
        const product = {
            id: codigo,
            name: nombre,
            price: precio,
            image: imgLink
        };
        
        console.log('🛒 Card - Adding product to cart:', product);
        
        try {
            const success = await addToCart(product, 1);
            if (success) {
                showToast("Se ha ingresado " + nombre + " al carrito");
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast("Error al agregar al carrito", "error");
        }
    };

    return (
        <div className="card">
            <div className="linkCard" onClick={CardClick}>
                <img className="cardImg" src={imgLink} alt={nombre}/>
                <div className="card-body cardContainer">
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text">{descripcionCorta}</p>
                    <p className="precio"><strong>Precio: $</strong>{precio.toLocaleString('es-CL')}</p>
                </div>
            </div>
            <div className="cardFooter">
                <button 
                    className="btnAgregar" 
                    onClick={AddToCart}
                    disabled={loading}
                >
                    {loading ? 'Agregando...' : 'Añadir al carrito'}
                </button>
            </div>
        </div>
    );
}