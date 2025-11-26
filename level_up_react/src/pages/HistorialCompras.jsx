import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { useOrders } from "../hooks/useOrders";

const HistorialCompras = () => {
  const { user, userOrders, userPoints } = useApp();
  const { obtenerOrdenesUsuario, obtenerPuntosUsuario } = useOrders();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        await Promise.all([
          obtenerOrdenesUsuario(user.id),
          obtenerPuntosUsuario(user.id),
        ]);
      } catch (err) {
        console.error("Error cargando historial de compras:", err);
        setError("Hubo un problema al cargar tus órdenes.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  if (!user) {
    return <p className="text-center mt-10">Debes iniciar sesión para ver tu historial.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Cargando historial...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Historial de Compras</h1>

      {/* Puntos Totales */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <p className="font-semibold text-lg">🎯 Puntos acumulados: {userPoints}</p>
      </div>

      {/* Lista de Órdenes */}
      {userOrders.length === 0 ? (
        <p className="text-center text-gray-500">Aún no has realizado ninguna compra.</p>
      ) : (
        <div className="space-y-4">
          {userOrders.map((orden) => (
            <div
              key={orden.id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <p><strong>🧾 ID Orden:</strong> {orden.id}</p>
              <p><strong>📅 Fecha:</strong> {new Date(orden.createdAt).toLocaleString()}</p>
              <p><strong>💰 Total:</strong> ${orden.totalAmount}</p>
              <p><strong>🏷️ Descuento aplicado:</strong> {orden.discountPercent}%</p>
              <p><strong>💵 Total Final:</strong> ${orden.finalAmount}</p>
              <p><strong>🎁 Puntos Ganados:</strong> {orden.pointsGranted}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialCompras;
