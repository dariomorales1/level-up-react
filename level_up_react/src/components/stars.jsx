// src/components/stars.js
import React from 'react';
import '../styles/components/starsStyles.css'; // si quieres estilos separados

const renderEstrellas = (puntaje = 0) => {
  // puntaje viene en rango 0–10
  const maxStars = 5;
  const ratingSobre5 = Math.max(0, Math.min(10, puntaje)) / 2; // 0–5

  const estrellas = [];

  for (let i = 1; i <= maxStars; i++) {
    const diff = ratingSobre5 - i;

    let clase = 'estrella-vacia';

    if (diff >= 0) {
      clase = 'estrella-llena';
    } else if (diff >= -0.5) {
      clase = 'estrella-media';
    }

    estrellas.push(
      <span key={i} className={`estrella ${clase}`}>
        ★
      </span>
    );
  }

  return <div className="estrellas-container">{estrellas}</div>;
};

export default renderEstrellas;
