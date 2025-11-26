import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import showToast from '../components/toast';
import '../styles/pages/checkoutStyles.css';

const POINTS_EXTRA_DISCOUNT_PERCENT = 10;
const SHIPPING_COST = 3990;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, userPoints } = useApp();
    const { items, isEmpty, clearCart } = useCart();
    const { crearOrdenDesdeCarrito, cargarOrdenesYPoints, obtenerPuntosUsuario } =
        useOrders();

    const [usePoints, setUsePoints] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        if (!user) {
        showToast('Debes iniciar sesión para completar el pago', 'warning');
        navigate('/login');
        return;
        }
        if (isEmpty) {
        showToast('Tu carrito está vacío', 'info');
        navigate('/');
        return;
        }

        // Refrescar puntos al entrar al checkout
        obtenerPuntosUsuario(user.id).catch(() => {});
    }, [user, isEmpty, navigate, obtenerPuntosUsuario]);

    const subtotal = useMemo(() => {
        if (!Array.isArray(items)) return 0;
        return items.reduce(
        (sum, item) =>
            sum + (item.price || 0) * (item.quantity || 0),
        0
        );
    }, [items]);

    const isDuocEmail =
        user?.email?.toLowerCase().endsWith('@duocuc.cl') || false;
    const duocDiscountPercent = isDuocEmail ? 20 : 0;
    const topBuyerDiscountPercent = 0; // lo calcula el backend, aquí solo avisamos
    const pointsDiscountPercent =
        usePoints && (userPoints ?? 0) > 0 ? POINTS_EXTRA_DISCOUNT_PERCENT : 0;

    const totalDiscountPercent =
        duocDiscountPercent + topBuyerDiscountPercent + pointsDiscountPercent;

    const discountAmount = Math.round(
        subtotal * (totalDiscountPercent / 100)
    );
    const totalAfterDiscounts = subtotal - discountAmount;
    const finalTotal = totalAfterDiscounts + SHIPPING_COST;

    const handlePay = async () => {
        if (!user) {
        showToast('Debes iniciar sesión para completar el pago', 'warning');
        return;
        }
        if (isEmpty) {
        showToast('Tu carrito está vacío', 'warning');
        return;
        }

        try {
        setIsPaying(true);

        await crearOrdenDesdeCarrito(user.id, {
            usePointsDiscount: usePoints,
        });

        await cargarOrdenesYPoints(user.id);

        await clearCart();

        showToast(
            'Pago realizado con éxito. Hemos generado tu pedido.',
            'success'
        );
        navigate('/historial-compras');
        } catch (error) {
        console.error('Error procesando pago:', error);
        showToast('Ocurrió un error al procesar el pago', 'error');
        } finally {
        setIsPaying(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="panel-administrador">
        <div className="management-layout">
            <SideBar />

            <main className="management-main">
            <div className="checkout-page">
                <div className="checkout-header">
                <h1>Revisar y pagar</h1>
                <p>Confirma los productos de tu carrito y aplica tus descuentos.</p>
                </div>

                <div className="checkout-layout">
                {/* LEFT: Carrito */}
                <section className="checkout-left">
                    <div className="checkout-card">
                    <div className="checkout-card-header">
                        <h2>Tu carrito</h2>
                        <span>{items.length} producto(s)</span>
                    </div>

                    <div className="checkout-items">
                        {items.map((item) => (
                        <div key={item.productId} className="checkout-item">
                            <img
                            src={item.image}
                            alt={item.name}
                            className="checkout-item-image"
                            />
                            <div className="checkout-item-info">
                            <div className="checkout-item-name">{item.name}</div>
                            <div className="checkout-item-meta">
                                <span>Cantidad: {item.quantity}</span>
                                <span>
                                Precio: ${((item.price || 0)).toLocaleString()}
                                </span>
                            </div>
                            </div>
                            <div className="checkout-item-subtotal">
                            $
                            {(
                                (item.price || 0) * (item.quantity || 0)
                            ).toLocaleString()}
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Puntos */}
                    <div className="checkout-card">
                    <div className="checkout-card-header">
                        <h2>Puntos LevelUp</h2>
                    </div>
                    <div className="points-section">
                        <div className="points-header">
                        <span>Puntos disponibles</span>
                        <strong>{userPoints ?? 0} pts</strong>
                        </div>

                        <div className="points-checkbox">
                        <input
                            type="checkbox"
                            id="usePoints"
                            checked={usePoints}
                            disabled={(userPoints ?? 0) <= 0 || isPaying}
                            onChange={(e) => setUsePoints(e.target.checked)}
                        />
                        <label htmlFor="usePoints">
                            Gastar mis puntos para activar un descuento extra de{' '}
                            <b>{POINTS_EXTRA_DISCOUNT_PERCENT}%</b> en esta compra.
                        </label>
                        </div>

                        <p className="points-detail">
                        Al usar tus puntos:
                        <br />
                        • Se consumen todos tus puntos actuales (se reinician a 0).<br />
                        • Obtienes un <b>{POINTS_EXTRA_DISCOUNT_PERCENT}%</b> de
                        descuento extra sobre el subtotal.<br />
                        • En esta compra volverás a acumular nuevos puntos según el
                        total pagado.
                        </p>
                    </div>
                    </div>
                </section>

                {/* RIGHT: Resumen de pago */}
                <section className="checkout-right">
                    <div className="checkout-card">
                    <div className="checkout-card-header">
                        <h2>Resumen de pago</h2>
                    </div>

                    <div className="checkout-summary-row">
                        <span>Subtotal productos</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="checkout-summary-row">
                        <span>Envío</span>
                        <span>${SHIPPING_COST.toLocaleString()}</span>
                    </div>

                    <div className="discounts-info">
                        <h3>Descuentos aplicados</h3>
                        <ul>
                        {isDuocEmail && (
                            <li>Correo DUOC UC: -{duocDiscountPercent}%</li>
                        )}
                        <li>
                            Top comprador:{' '}
                            <span className="discount-note">
                            Se aplica automáticamente si estás en el top 5.
                            </span>
                        </li>
                        {usePoints && (userPoints ?? 0) > 0 && (
                            <li>
                            Descuento extra por puntos: -
                            {POINTS_EXTRA_DISCOUNT_PERCENT}%
                            </li>
                        )}
                        {totalDiscountPercent === 0 && (
                            <li>Sin descuentos aplicados por ahora.</li>
                        )}
                        </ul>
                    </div>

                    <div className="checkout-summary-row total-row">
                        <span>Total descuentos</span>
                        <span>- ${discountAmount.toLocaleString()}</span>
                    </div>

                    <div className="checkout-summary-row final-row">
                        <span>Total a pagar</span>
                        <span>${finalTotal.toLocaleString()}</span>
                    </div>

                    <div className="checkout-actions">
                        <button
                        type="button"
                        className="btnSecondary"
                        onClick={handleBack}
                        disabled={isPaying}
                        >
                        Volver al carrito
                        </button>
                        <button
                        type="button"
                        className="btnPrimary pay-button"
                        onClick={handlePay}
                        disabled={isPaying || isEmpty}
                        >
                        {isPaying ? 'Procesando pago...' : 'Pagar ahora'}
                        </button>
                    </div>
                    </div>
                </section>
                </div>
            </div>
            </main>
        </div>
        </div>
    );
};

export default CheckoutPage;
