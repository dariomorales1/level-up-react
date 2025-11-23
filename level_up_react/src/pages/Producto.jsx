import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import productService from '../services/productService';
import renderEstrellas from '../components/stars';
import showToast from '../components/toast';
import '../styles/pages/productoStyles.css';

const MAX_LETRAS = 1000; // Cambiado de MAX_WORDS a MAX_LETRAS

const Producto = () => {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('codigo');

  const navigate = useNavigate();
  const { dispatchCart, user } = useApp();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para reseñas
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(10);
  const [editingResenaId, setEditingResenaId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ===== Helpers para contar letras =====
  const contarLetras = (texto) => {
    if (!texto) return 0;
    return texto.trim().length;
  };

  const letrasRestantes =
    MAX_LETRAS - contarLetras(nuevoComentario || '');

  // Cargar producto desde MS
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        const prod = await productService.getProductByCode(codigo);
        console.log('🧩 Producto recibido desde MS:', prod);
        setProducto(prod);

        // Reset formulario reseña
        setNuevoComentario('');
        setPuntuacion(10);
        setEditingResenaId(null);
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (codigo) {
      fetchProducto();
    }
  }, [codigo]);

  // Promedio de puntuación desde las reseñas
  const promedioPuntuacion = useMemo(() => {
    if (!producto?.resenas || producto.resenas.length === 0) return null;
    const suma = producto.resenas.reduce(
      (acc, r) => acc + (r.puntuacion || 0),
      0
    );
    return suma / producto.resenas.length;
  }, [producto]);

  const handleComentarioChange = (e) => {
    const value = e.target.value;
    const totalLetras = contarLetras(value);

    if (totalLetras <= MAX_LETRAS) {
      setNuevoComentario(value);
    } else {
      // Recortar a las primeras 1000 letras
      const recortado = value.substring(0, MAX_LETRAS);
      setNuevoComentario(recortado);
    }
  };

  const handlePuntuacionChange = (e) => {
    setPuntuacion(Number(e.target.value));
  };

  const AddToCart = (e) => {
    e.stopPropagation();
    if (!producto) return;

    const productForCart = {
      id: producto.codigo,
      name: producto.nombre,
      price: producto.precio,
      image: producto.imagenUrl,
    };

    console.log('🛒 Card - Adding product to cart:', productForCart);
    dispatchCart({ type: 'ADD_TO_CART', payload: productForCart });
    showToast(`Se ha ingresado ${producto.nombre} al carrito`);
  };

  const handleVolver = () => {
    navigate(-1);
  };

  const recargarProducto = async () => {
    try {
      const prod = await productService.getProductByCode(codigo);
      setProducto(prod);
    } catch (err) {
      console.error('Error recargando producto:', err);
    }
  };

  const handleSubmitResena = async (e) => {
    e.preventDefault();
    if (!producto) return;

    if (!user) {
      showToast('Debes iniciar sesión para dejar una reseña');
      return;
    }

    if (!nuevoComentario.trim()) {
      showToast('El comentario no puede estar vacío');
      return;
    }

    if (puntuacion < 1 || puntuacion > 10) {
      showToast('La puntuación debe estar entre 1 y 10');
      return;
    }

    try {
      setSubmitting(true);

      if (editingResenaId) {
        // Editar reseña existente
        await productService.updateResena(producto.codigo, editingResenaId, {
          comentario: nuevoComentario.trim(),
          puntuacion,
          usuarioId: user.id,
        });
        showToast('Reseña actualizada correctamente');
      } else {
        // Crear reseña nueva
        await productService.addResena(producto.codigo, {
          comentario: nuevoComentario.trim(),
          puntuacion,
          usuarioId: user.id,
        });
        showToast('Reseña creada correctamente');
      }

      // Limpiar formulario y recargar reseñas
      setNuevoComentario('');
      setPuntuacion(10);
      setEditingResenaId(null);
      await recargarProducto();
    } catch (err) {
      console.error('Error al guardar reseña:', err);
      showToast(err.message || 'Error al guardar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditarResena = (resena) => {
    if (!user) {
      showToast('Debes iniciar sesión para editar reseñas');
      return;
    }
    if (resena.usuarioId !== user.id) {
      showToast('Solo puedes editar tus propias reseñas');
      return;
    }

    setEditingResenaId(resena.id);
    setNuevoComentario(resena.comentario || '');
    setPuntuacion(resena.puntuacion || 10);
  };

  const handleEliminarResena = async (resena) => {
    if (!user) {
      showToast('Debes iniciar sesión para eliminar reseñas');
      return;
    }
    if (resena.usuarioId !== user.id) {
      showToast('Solo puedes eliminar tus propias reseñas');
      return;
    }

    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar esta reseña?'
    );
    if (!confirmar) return;

    try {
      await productService.deleteResena(producto.codigo, resena.id);
      showToast('Reseña eliminada correctamente');
      await recargarProducto();
    } catch (err) {
      console.error('Error eliminando reseña:', err);
      showToast(err.message || 'Error al eliminar reseña');
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container fluid producto-loading">
          <p>Cargando producto...</p>
        </div>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main>
        <div className="container fluid producto-loading">
          <p>{error || 'Producto no encontrado'}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container fluid">
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <section className="productDetalle">
              {/* Header: Título + botón volver a la derecha */}
              <div className="product-header">
                <h2 className="productName">{producto.nombre}</h2>
                <button
                  type="button"
                  className="btn-volver-producto"
                  onClick={handleVolver}
                >
                  <span className="btn-volver-icon">⮌</span>
                  <span>Volver</span>
                </button>
              </div>

              {/* Card principal: imagen + descripción + rating + compra */}
              <div className="cardDetalle">
                <div className="product-image-wrapper">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="product-image"
                  />
                </div>

                <div className="productInfo">
                  <p className="description">{producto.descripcionLarga}</p>

                  <div className="rating-block">
                    {promedioPuntuacion != null ? (
                      <>
                        <div className="rating-stars">
                          {renderEstrellas(promedioPuntuacion)}
                        </div>
                        <p className="rating-text">
                          Promedio: {promedioPuntuacion.toFixed(1)} / 10 (
                          {producto.resenas.length}{' '}
                          {producto.resenas.length === 1
                            ? 'reseña'
                            : 'reseñas'}
                          )
                        </p>
                      </>
                    ) : (
                      <p className="rating-text sin-resenas">
                        Sin reseñas aún
                      </p>
                    )}
                  </div>

                  <section className="compra">
                    <p className="precio">
                      <strong>Precio: $</strong>
                      {producto.precio.toLocaleString('es-CL')}
                    </p>
                    <button className="btnAgregar" onClick={AddToCart}>
                      Añadir al carrito
                    </button>
                  </section>
                </div>
              </div>

              <hr />

              <div className="detalles">
                {/* Columna izquierda: Especificaciones */}
                <div className="detalles-col">
                  <div className="panel especificaciones-panel">
                    <div className="panel-header">
                      <h3>Especificaciones</h3>
                    </div>
                    <table className="especificaciones-table">
                      <tbody>
                        {(producto.especificaciones || []).map((espec) => (
                          <tr key={espec.id}>
                            <td className="line">
                              {espec.specification || espec.descripcion}
                            </td>
                          </tr>
                        ))}
                        {(!producto.especificaciones ||
                          producto.especificaciones.length === 0) && (
                          <tr>
                            <td className="line sin-datos">
                              Este producto no tiene especificaciones cargadas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Columna derecha: Reseñas */}
                <div className="detalles-col">
                  <div className="panel resenas-panel">
                    <div className="panel-header">
                      <h3>Reseñas</h3>
                    </div>

                    {/* Lista de reseñas */}
                    <div className="resenas-list">
                      {producto.resenas && producto.resenas.length > 0 ? (
                        producto.resenas.map((r) => (
                          <div key={r.id} className="resena-item">
                            <div className="resena-header-row">
                              <span className="resena-score">
                                ⭐ {r.puntuacion}/10
                              </span>
                              <span className="resena-user">
                                Usuario: {r.usuarioId}
                              </span>
                            </div>
                            <p className="resena-comentario">
                              {r.comentario}
                            </p>
                            {user && r.usuarioId === user.id && (
                              <div className="resena-actions">
                                <button
                                  type="button"
                                  className="btn-resena edit"
                                  onClick={() => handleEditarResena(r)}
                                >
                                  <span className="btn-resena-icon">✏️</span>
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn-resena delete"
                                  onClick={() => handleEliminarResena(r)}
                                >
                                  <span className="btn-resena-icon">🗑️</span>
                                  <span>Eliminar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="sin-datos">
                          Aún no hay reseñas para este producto.
                        </p>
                      )}
                    </div>

                    {/* Formulario de nueva reseña / edición */}
                    <div className="resena-form-wrapper">
                      {user ? (
                        <>
                          <h4 className="resena-form-title">
                            {editingResenaId
                              ? 'Editar tu reseña'
                              : 'Escribe una reseña'}
                          </h4>
                          <form
                            className="resena-form"
                            onSubmit={handleSubmitResena}
                          >
                            <div className="resena-form-row">
                              <label htmlFor="puntuacion">
                                Puntuación (1 a 10)
                              </label>
                              <select
                                id="puntuacion"
                                value={puntuacion}
                                onChange={handlePuntuacionChange}
                                className="resena-select"
                              >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                  (num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            <div className="resena-form-row">
                              <label htmlFor="comentario">
                                Comentario (hasta {MAX_LETRAS} letras)
                              </label>
                              <textarea
                                id="comentario"
                                className="resena-textarea"
                                value={nuevoComentario}
                                onChange={handleComentarioChange}
                                rows={4}
                                placeholder="Cuéntanos qué te pareció este producto..."
                              />
                              <div className="char-counter">
                                {letrasRestantes} letras restantes
                              </div>
                            </div>

                            <div className="resena-form-actions">
                              {editingResenaId && (
                                <button
                                  type="button"
                                  className="btn-resena-cancelar"
                                  onClick={() => {
                                    setEditingResenaId(null);
                                    setNuevoComentario('');
                                    setPuntuacion(10);
                                  }}
                                >
                                  Cancelar edición
                                </button>
                              )}
                              <button
                                type="submit"
                                className="btn-resena-submit"
                                disabled={submitting}
                              >
                                {submitting
                                  ? 'Guardando...'
                                  : editingResenaId
                                  ? 'Actualizar reseña'
                                  : 'Publicar reseña'}
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        <p className="resena-login-hint">
                          Debes iniciar sesión para escribir una reseña.
                          <button
                            type="button"
                            className="btn-login-resena"
                            onClick={() => navigate('/login')}
                          >
                            Inicia sesión
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </main>
  );
};

export default Producto;