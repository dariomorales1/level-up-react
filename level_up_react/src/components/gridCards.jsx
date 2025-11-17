import React from 'react';
import Card from './card';
import '../styles/components/gridCardsStyles.css';
import listaProductos from '../assets/listaProductos.js';

export default function CardsContainer ({ productos = [] }) {
 
    const items = (productos && productos.length) ? productos : listaProductos;

    
    return (
        <div className="cardsContainer">
            {items.length === 0 ? (
                <p>No hay productos.</p>
            ) : (
                items.map((p) => (

                <Card
                    key={p.codigo || p.id}
                    codigo={p.codigo || p.id}
                    nombre={p.nombre}
                    imgLink={p.imagenUrl}
                    descripcionCorta={p.descripcionCorta}
                    precio={p.precio}
                />
                ))
            )}

        </div>
        
    );
}