import React from 'react';
import Card from './card';
import '../styles/components/gridCardsStyles.css';

export default function CardsContainer({ productos }) {
    const lista = Array.isArray(productos) ? productos : [];

    if (lista.length === 0) {
        return <p>No hay productos.</p>;
    }

    return (
        <div className="cardsContainer">
            {lista.map((p, index) => {
                if (!p) {
                    console.warn("⚠ Producto inválido en el índice:", index);
                    return null;
                }

                const codigo = p.codigo || p.id || `prod-${index}`;
                const img = p.imagenUrl || p.imgLink || null;
                const nombre = p.nombre || p.Nombre || "Producto sin nombre";
                const precio = p.precio || p.Precio || 0;
                const descripcionCorta =
                    p.descripcionCorta ||
                    p["Descripción Corta"] ||
                    p.descripcion ||
                    "Producto sin descripción";
                const stock = p.stock != null ? p.stock : p.Stock != null ? p.Stock : 0;

                return (
                    <Card
                        key={codigo}
                        codigo={codigo}
                        nombre={nombre}
                        imgLink={img}
                        descripcionCorta={descripcionCorta}
                        precio={precio}
                        stock={stock}
                    />
                );
            })}
        </div>
    );
}
