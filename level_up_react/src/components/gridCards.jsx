import React from 'react';
import Card from './card';
import '../styles/components/gridCardsStyles.css';

export default function CardsContainer({ productos = [] }) {
    if (!productos.length) return <p>No hay productos.</p>;

    return (
        <div className="cardsContainer">
        {productos.map((p) => (
            <Card
            key={p.codigo || p.id}
            codigo={p.codigo || p.id}
            nombre={p.nombre}
            imgLink={p.imagenUrl}
            descripcionCorta={p.descripcionCorta}
            precio={p.precio}
            />
        ))}
        </div>
    );
}