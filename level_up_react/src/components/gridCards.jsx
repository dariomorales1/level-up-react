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
                    key={p["Código"] || p.id}
                    codigo={p["Código"] || p.id}
                    nombre={p.Nombre}
                    imgLink={require(`../${p.imgLink}`)}
                    descripcionCorta={p["Descripción Corta"]}
                    precio={p.Precio}
                />
                ))
            )}

        </div>
        
    );
}