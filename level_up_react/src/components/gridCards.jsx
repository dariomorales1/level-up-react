import React from 'react';
import Card from './card';
import '../styles/components/gridCardsStyles.css';

export default function CardsContainer({ productos }) {
    // Si viene null, undefined o algo raro → forzar array
    const lista = Array.isArray(productos) ? productos : [];

    if (lista.length === 0) {
        return <p>No hay productos.</p>;
    }

    return (
        <div className="cardsContainer">
            {lista.map((p, index) => {
                // Validar para evitar reventones
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

                return (
                    <Card
                        key={codigo}
                        codigo={codigo}
                        nombre={nombre}
                        imgLink={img}
                        descripcionCorta={descripcionCorta}
                        precio={precio}
                    />
                );
            })}
        </div>
    );
}
