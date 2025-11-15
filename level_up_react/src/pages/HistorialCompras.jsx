import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/historialStyles.css';

const HistorialCompras = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    // Aquí podrías traer el historial real desde API o localStorage.
    // De momento dejamos datos de ejemplo.
    const mock = [
      {
        id: 'ORD-001',
        fecha: '2025-01-05',
        total: '59.990 CLP',
        estado: 'Entregado',
        items: 3,
      },
      {
        id: 'ORD-002',
        fecha: '2025-01-12',
        total: '29.990 CLP',
        estado: 'En tránsito',
        items: 1,
      },
    ];

    setOrdenes(mock);
  }, []);

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main">
          <div className="historial-page">
            <div className="perfil-container">
              <div className="perfil-header">
                <h1>Historial de compras</h1>
                <p>Revisa el detalle de tus pedidos anteriores.</p>
              </div>

              <section className="perfil-card historial-card">
                {ordenes.length === 0 ? (
                  <div className="historial-empty">
                    <p>Aún no tienes compras registradas.</p>
                    <span>Cuando realices compras, aparecerán aquí.</span>
                  </div>
                ) : (
                  <div className="historial-table-wrapper">
                    <table className="historial-table">
                      <thead>
                        <tr>
                          <th>N° Orden</th>
                          <th>Fecha</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenes.map((orden) => (
                          <tr key={orden.id}>
                            <td>{orden.id}</td>
                            <td>{orden.fecha}</td>
                            <td>{orden.items}</td>
                            <td>{orden.total}</td>
                            <td>
                              <span className={`estado estado-${orden.estado.replace(' ', '').toLowerCase()}`}>
                                {orden.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
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
