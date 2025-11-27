import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/checkoutStyles.css';
import showToast from '../components/toast';

const CheckoutPage = () => {
    const { user } = useApp();
    const {
        items,
        isEmpty,
        totalAmount,
        clearCart,
    } = useCart();

    const {
        crearOrdenDesdeCarrito,
        puntosUsuario,
        esTop5PorPuntos,
        correoInstitucional,
        refrescarPuntosYTop
    } = useOrders();

    const navigate = useNavigate();

    const [usePointsDiscount, setUsePointsDiscount] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    // Cargar info inicial de puntos / top5
    useEffect(() => {
        if (user?.id) {
        refrescarPuntosYTop(user.id).catch((err) => {
            console.error('Error cargando puntos/top5:', err);
        });
        }
    }, [user, refrescarPuntosYTop]);

    const carritoVacio = isEmpty || !items || items.length === 0;

    const subtotal = useMemo(() => {
        if (!items || items.length === 0) return 0;
        return items.reduce((sum, item) => {
        const quantity = item?.quantity ?? 0;
        const price = item?.price ?? 0;
        return sum + quantity * price;
        }, 0);
    }, [items]);

    const shipping = carritoVacio ? 0 : 3990;

    const discounts = useMemo(() => {
        if (carritoVacio) {
        return {
            duocDiscount: 0,
            pointsDiscount: 0,
            totalDiscountPercent: 0,
        };
        }

        let duocDiscount = 0;
        let pointsDiscount = 0;

        if (correoInstitucional) {
        duocDiscount = 20;
        }

        if (usePointsDiscount && esTop5PorPuntos) {
        pointsDiscount = 15;
        }

        const totalDiscountPercent = duocDiscount + pointsDiscount;

        return {
        duocDiscount,
        pointsDiscount,
        totalDiscountPercent,
        };
    }, [carritoVacio, correoInstitucional, usePointsDiscount, esTop5PorPuntos]);

    const finalTotal = useMemo(() => {
        if (carritoVacio) return 0;
        const base = subtotal + shipping;
        const discountFactor = (100 - discounts.totalDiscountPercent) / 100;
        return Math.round(base * discountFactor);
    }, [carritoVacio, subtotal, shipping, discounts.totalDiscountPercent]);

    const handleUsePointsToggle = () => {
        if (!esTop5PorPuntos) {
        showToast('Solo el Top 5 de usuarios por puntos puede usar este descuento.', 'warning');
        return;
        }
        if (!puntosUsuario || puntosUsuario <= 0) {
        showToast('No tienes puntos disponibles para activar este descuento.', 'warning');
        return;
        }
        setUsePointsDiscount((prev) => !prev);
    };

    const handlePay = async () => {
        if (!user?.id) {
        showToast('Debes iniciar sesión para pagar', 'warning');
        return;
        }
        if (carritoVacio) {
        showToast('No puedes pagar un carrito vacío', 'warning');
        return;
        }

        try {
        setIsPaying(true);

        const payload = {
            usePointsDiscount,
        };

        const createdOrder = await crearOrdenDesdeCarrito(user.id, payload);

        // Limpia el carrito en frontend si el back creó el pedido correctamente
        await clearCart();

        showToast('Pago realizado con éxito. Tu pedido ha sido generado.', 'success');

        navigate('/historial');
        } catch (error) {
        console.error('Error procesando pago:', error);
        showToast('Error al procesar el pago. Intenta nuevamente.', 'error');
        } finally {
        setIsPaying(false);
        }
    };

    const handleBackToShop = () => {
        navigate('/');
    };

    return (
        <div className="checkout-page">
        <div className="checkout-container">
            <header className="checkout-header">
            <h1>Resumen de tu compra</h1>
            <p>Revisa los detalles de tu pedido antes de pagar.</p>
            </header>

            {carritoVacio ? (
            <div className="checkout-empty">
                <p>Tu carrito está vacío, agrega productos para continuar.</p>
                <button className="btn" onClick={handleBackToShop}>
                Volver a la tienda
                </button>
            </div>
            ) : (
            <div className="checkout-layout">
                {/* Columna izquierda: Detalle de productos */}
                <section className="checkout-items-card">
                <h2>Productos en tu carrito</h2>
                <div className="checkout-items-table-wrapper">
                    <table className="checkout-items-table">
                    <thead>
                        <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                        <tr key={item.productId}>
                            <td className="checkout-item-info">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="checkout-item-image"
                            />
                            <span>{item.name}</span>
                            </td>
                            <td>${(item.price ?? 0).toLocaleString('es-CL')}</td>
                            <td>{item.quantity}</td>
                            <td>
                            $
                            {((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString(
                                'es-CL'
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </section>

                {/* Columna derecha: Resumen, puntos y descuentos */}
                <aside className="checkout-summary-card">
                <h2>Resumen del pago</h2>

                <div className="checkout-summary-row">
                    <span>Subtotal productos:</span>
                    <span>${subtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="checkout-summary-row">
                    <span>Envío:</span>
                    <span>${shipping.toLocaleString('es-CL')}</span>
                </div>

                <hr className="checkout-divider" />

                {/* Puntos y descuentos */}
                <div className="checkout-points-section">
                    <h3>Mis puntos</h3>
                    <p className="checkout-points-text">
                    Tienes{' '}
                    <strong>
                        {(puntosUsuario ?? 0).toLocaleString('es-CL')}
                    </strong>{' '}
                    puntos acumulados.
                    </p>
                    <p className="checkout-points-text">
                    {esTop5PorPuntos
                        ? 'Estás en el Top 5 de usuarios por puntos. Puedes activar el descuento especial de puntos.'
                        : 'No estás en el Top 5 de usuarios por puntos. Aún no puedes usar el descuento especial.'}
                    </p>

                    <div className="checkout-toggle-row">
                    <label className="checkout-toggle-label">
                        <input
                        type="checkbox"
                        checked={usePointsDiscount}
                        onChange={handleUsePointsToggle}
                        disabled={!esTop5PorPuntos || (puntosUsuario ?? 0) <= 0}
                        />
                        <span>Usar mis puntos para activar el descuento especial</span>
                    </label>
                    </div>
                </div>

                <div className="checkout-discounts-section">
                    <h3>Descuentos aplicados</h3>
                    <ul>
                    <li>
                        <span>Descuento correo DUOC:</span>
                        <span>
                        {correoInstitucional ? `${discounts.duocDiscount}%` : '0%'}
                        </span>
                    </li>
                    <li>
                        <span>Descuento por puntos (Top 5):</span>
                        <span>
                        {usePointsDiscount && esTop5PorPuntos
                            ? `${discounts.pointsDiscount}%`
                            : '0%'}
                        </span>
                    </li>
                    <li className="checkout-discount-total">
                        <span>Descuento total:</span>
                        <span>{discounts.totalDiscountPercent}%</span>
                    </li>
                    </ul>
                </div>

                <hr className="checkout-divider" />

                <div className="checkout-summary-row checkout-total-row">
                    <span>Total a pagar:</span>
                    <span>${finalTotal.toLocaleString('es-CL')}</span>
                </div>

                <div className="checkout-actions">
                    <button
                    className="btn2"
                    type="button"
                    onClick={handleBackToShop}
                    disabled={isPaying}
                    >
                    Seguir comprando
                    </button>
                    <button
                    className="btn"
                    type="button"
                    onClick={handlePay}
                    disabled={isPaying || carritoVacio}
                    >
                    {isPaying ? 'Procesando...' : 'Pagar ahora'}
                    </button>
                </div>
                </aside>
            </div>
            )}
        </div>
        </div>
    );
};

export default CheckoutPage;
