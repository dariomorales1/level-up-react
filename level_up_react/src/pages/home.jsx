import React, { useEffect, useState } from 'react';
import MyCarousel from '../components/Carousel';
import CardsContainer from '../components/gridCards';
import productService from '../services/productService';
import '../styles/pages/homeStyles.css';

export default function Home() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga de Bootstrap JS
  useEffect(() => {
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src =
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js';
    bootstrapScript.integrity =
      'sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI';
    bootstrapScript.crossOrigin = 'anonymous';
    document.body.appendChild(bootstrapScript);

    return () => {
      document.body.removeChild(bootstrapScript);
    };
  }, []);

  // Carga de productos y selección de primeros por categoría
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoading(true);
        setError(null);

        const productos = await productService.getAllProducts();
        console.log('[Home] productos (raw):', productos);

        if (!Array.isArray(productos)) {
          console.error('[Home] productos no es un array, valor recibido:', productos);
          setProductosDestacados([]);
          return;
        }

        // Agrupar y tomar el primer producto por categoría
        const primerosPorCategoria = {};

        productos.forEach((p) => {
          // Nombre de la categoría según tu backend: "categoria"
          const categoria =
            p.categoria || p.category || p.Categoría || p.CATEGORY;

          if (!categoria) return;

          if (!primerosPorCategoria[categoria]) {
            primerosPorCategoria[categoria] = p;
          }
        });

        const destacados = Object.values(primerosPorCategoria);
        console.log('[Home] productos destacados:', destacados);
        setProductosDestacados(destacados);
      } catch (err) {
        console.error('Error cargando productos destacados:', err);
        setError(err.message || 'Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  return (
    <div className="page">
      <main>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <MyCarousel />
            <hr />
            <h1 className="titulo">Destacados</h1>
            <hr />

            {loading && <p>Cargando productos destacados...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && productosDestacados.length === 0 && (
              <p>No hay productos destacados para mostrar.</p>
            )}

            {!loading && !error && productosDestacados.length > 0 && (
              <CardsContainer productos={productosDestacados} />
            )}
          </div>
          <div className="col-2"></div>
        </div>
      </main>
    </div>
  );
}
