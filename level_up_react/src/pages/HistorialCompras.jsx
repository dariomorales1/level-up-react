import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/historialStyles.css';
import { useOrders } from '../hooks/useOrders';
import { useApp } from '../context/AppContext';
import showToast from '../components/toast';

const HistorialCompras = () => {
  const { user, userOrders, userPoints } = useApp();
  const { cargarOrdenesYPoints } = useOrders();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        await cargarOrdenesYPoints(user.id);
      } catch (error) {
        console.error('Error cargando historial de compras:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user, cargarOrdenesYPoints]);

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main">
          <div className="historial-page">
            <div className="perfil-container">
              <div className="perfil-header">
                <h1>Historial de compras</h1>
                <p>Revisa el detalle de tus pedidos anteriores y tus puntos acumulados.</p>
              </div>

              <section className="perfil-card historial-card">
                <h2>Mis puntos</h2>
                <p>
                  Puntos acumulados:{' '}
                  <strong>{(userPoints ?? 0).toLocaleString('es-CL')}</strong>
                </p>
                <p className="historial-points-hint">
                  Los puntos se usan para habilitar el descuento especial del Top 5.
                </p>
              </section>

              <section className="perfil-card historial-card">
                {loading ? (
                  <div className="historial-empty">
                    <p>Cargando historial de compras...</p>
                  </div>
                ) : !userOrders || userOrders.length === 0 ? (
                  <div className="historial-empty">
                    <p>Aún no tienes compras registradas.</p>
                    <span>Cuando realices compras, aparecerán aquí.</span>
                  </div>
                ) : (
                  <div className="historial-table-wrapper">
                    <table className="historial-table">
                      <thead>
                        <tr>
                          <th>ID Pedido</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th>Descuentos</th>
                          <th>Puntos generados</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((orden) => {
                          const descuentos = [];

                          if (orden.discountPercent && orden.discountPercent > 0) {
                            descuentos.push(`${orden.discountPercent}%`);
                          }
                          if (orden.usedPointsDiscount) {
                            descuentos.push('Descuento Top 5');
                          }
                          if (orden.usedEmailDiscount) {
                            descuentos.push('Correo DUOC 20%');
                          }

                          const textoDescuentos =
                            descuentos.length > 0 ? descuentos.join(' + ') : 'Sin descuento';

                          const puntosGenerados =
                            orden.pointsGranted ?? orden.points ?? 0;

                          return (
                            <tr key={orden.id}>
                              <td>
                                <div className="historial-orden-id">
                                  <div>#{orden.id.slice(0, 8)}...</div>
                                  <small className="order-date">
                                    {new Date(orden.createdAt).toLocaleString('es-CL')}
                                  </small>
                                </div>
                              </td>

                              <td>
                                <div className="historial-productos">
                                  {orden.items?.map((item) => (
                                    <div
                                      key={item.id}
                                      className="historial-producto-row"
                                    >
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="historial-producto-img"
                                      />
                                      <div className="historial-producto-info">
                                        <p className="historial-producto-nombre">
                                          {item.name}
                                        </p>
                                        <p className="historial-producto-detalle">
                                          {item.quantity} x $
                                          {item.price.toLocaleString('es-CL')}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              <td>
                                <strong>
                                  ${orden.finalAmount.toLocaleString('es-CL')}
                                </strong>
                              </td>

                              <td>{textoDescuentos}</td>

                              <td>
                                {puntosGenerados.toLocaleString('es-CL')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistorialCompras;
